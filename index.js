// Initalization
const express = require('express');
const config = require('./config.json'); // Website config
const FormData = require('form-data');
const fetch = require('node-fetch');
const app = express();
app.use(require('express-session')(config.session));
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fs = require('fs');
const {sort} = require('./util/sort');

let pubdir = __dirname + '/public';

app.use(express.static(pubdir));

app.get('/', async (req, resp) => {
    if(!req.session.bearer_token)
        return resp.redirect('/login') // Redirect to login page
    
    const data = await fetch(`https://discord.com/api/users/@me`, {headers: { Authorization: `Bearer ${req.session.bearer_token}` } }); // Fetching user data
    const json = await data.json();

    if(!json.username) // This can happen if the Bearer token has expired or user has not given permission "indentity"
        return resp.redirect('/login') // Redirect to login page

    app.locals.timestamp = (+new Date()).toString();

    const a = require('./db/auth.json');
    a[json.id] = app.locals.timestamp;

    app.locals.disc = json;

    const s = require('./public/suggestions.json');
    let t = req.query.sort;
    if (t === undefined) t = 0;

    app.locals.suggestions = sort(s.s,t);

    fs.writeFile('./db/auth.json',JSON.stringify(a),function(err) {
      if (err) {
        console.error(err);
        resp.send("Rip error\n" + err);
      } else {
        resp.render('index.ejs');
      }
    });

    // resp.send(`<h1>Hello, ${json.username}#${json.discriminator}!</h1>` +
    //           `<img src="https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512">`) // Show user's nametag and avatar
});

app.get('/login/callback', async (req, resp) => {
    const accessCode = req.query.code;
    if (!accessCode) // If something went wrong and access code wasn't given
        return resp.send('No access code specified');

    // Creating form to make request
    const data = new FormData();
    data.append('client_id', config.oauth2.client_id);
    data.append('client_secret', config.oauth2.secret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', config.oauth2.redirect_uri);
    data.append('scope', 'identify');
    data.append('code', accessCode);

    // Making request to oauth2/token to get the Bearer token
    const json = await (await fetch('https://discord.com/api/oauth2/token', {method: 'POST', body: data})).json();
    req.session.bearer_token = json.access_token;

    resp.redirect('/'); // Redirecting to main page
});

app.get('/login', (req, res) => {
    // Redirecting to login url
    res.redirect(`https://discord.com/api/oauth2/authorize` +
                 `?client_id=${config.oauth2.client_id}` +
                 `&redirect_uri=${encodeURIComponent(config.oauth2.redirect_uri)}` +
                 `&response_type=code&scope=${encodeURIComponent(config.oauth2.scopes.join(" "))}`)
});

app.post('/suggest', jsonParser, (req,res) => {
  let b = require('./db/auth.json');
  if (b[req.body.id] != req.body.auth) {
    return res.send("!auth");
  }
  let d = require('./public/suggestions.json');
  let a = {
    "name": req.body.name,
    "user": req.body.user,
    "up": 0,
    "down": 0,
    "whoup": [],
    "whodown": [],
    "i": d.s[d.s.length - 1].i + 1
  }
  if (req.body.link !== '') {
    a.link = req.body.link;
  }
  for (var i = 0; i < d.s.length; i++) {
    if (d.s[i].name.toLowerCase() === a.name.toLowerCase()) {
      return res.send("!name")
    }
  }
  var urlptrn = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if (a.link !== undefined) {
    if (!urlptrn.test(a.link)) {
      return res.send("!url");
    }
    if (!/^(https?:\/\/)/.test(a.link)) {
      a.link = `http://${a.link}`
    }
  }
  d.s.push(a);
  fs.writeFile('./public/suggestions.json',JSON.stringify(d),function(err) {
    if (err) {
      console.error(err);
      res.send(err);
    }
    res.send("nice");
  });
});

app.post('/up', jsonParser, (req,res) => {
  let a = require('./db/auth.json');
  if (a[req.body.id] != req.body.auth) {
    return res.send("!auth");
  }
  let d = require('./public/suggestions.json');
  if (!d.s[req.body.i].whoup.includes(req.body.id)) {
    if (d.s[req.body.i].whodown.includes(req.body.id)) {
      d.s[req.body.i].whodown.splice(d.s[req.body.i].whodown.indexOf(req.body.id),1);
      d.s[req.body.i].down -= 1;
    }
    d.s[req.body.i].whoup.push(req.body.id);
    d.s[req.body.i].up += 1;
  } else {
    d.s[req.body.i].whoup.splice(d.s[req.body.i].whoup.indexOf(req.body.id),1);
    d.s[req.body.i].up -= 1;
  }
  fs.writeFile('./public/suggestions.json',JSON.stringify(d),function(err) {
    if (err) {
      console.error(err);
      res.send(err);
    }
    res.send("nice");
  });
});

app.post('/down', jsonParser, (req,res) => {
  let a = require('./db/auth.json');
  if (a[req.body.id] != req.body.auth) {
    return res.send("!auth");
  }
  let d = require('./public/suggestions.json');
  if (!d.s[req.body.i].whodown.includes(req.body.id)) {
    if (d.s[req.body.i].whoup.includes(req.body.id)) {
      d.s[req.body.i].whoup.splice(d.s[req.body.i].whoup.indexOf(req.body.id),1);
      d.s[req.body.i].up -= 1;
    }
    d.s[req.body.i].whodown.push(req.body.id);
    d.s[req.body.i].down += 1;
  } else {
    d.s[req.body.i].whodown.splice(d.s[req.body.i].whodown.indexOf(req.body.id),1);
    d.s[req.body.i].down -= 1;
  }
  fs.writeFile('./public/suggestions.json',JSON.stringify(d),function(err) {
    if (err) {
      console.error(err);
      res.send(err);
    }
    res.send("nice");
  });
});

function copy(o) {
  let c = {};
  let k;
  for (k in o) {
    c[k] = o[k];
  }
  return c;
}

app.post('/edit', jsonParser, (req,res) => {
  let b = require('./db/auth.json');
  if (b[req.body.id] != req.body.auth) {
    console.log(req.body.id);
    return res.send("!auth");
  }
  let d = require('./public/suggestions.json');
  let a = {};
  let i = 0;
  for (var j = 0; j < d.s.length; j++) {
    i = j;
    if (d.s[i].i == req.body.i) {
      a = copy(d.s[i]);
      break;
    }
  }
  if (a == {}) {
    return res.send("!gone");
  }
  a.name = req.body.name;
  if (req.body.link !== '') {
    a.link = req.body.link;
  } else {
    a.link = undefined;
  }
  for (var j = 0; j < d.s.length; j++) {
    if ((d.s[j].name.toLowerCase() === a.name.toLowerCase()) && (i !== j)) {
      return res.send("!name");
    }
  }
  var urlptrn = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if (a.link !== undefined) {
    if (!urlptrn.test(a.link)) {
      return res.send("!url");
    }
    if (!/^(https?:\/\/)/.test(a.link)) {
      a.link = `http://${a.link}`
    }
  }
  d.s[i] = a;
  fs.writeFile('./public/suggestions.json',JSON.stringify(d),function(err) {
    if (err) {
      console.error(err);
      res.send(err);
    }
    res.send("nice");
  });
});

app.post('/remove', jsonParser, (req,res) => {
  let a = require('./db/auth.json');
  if (a[req.body.id] != req.body.auth) {
    return res.send("!auth");
  }
  let d = require('./public/suggestions.json');
  const i = d.s.indexOf(d.s[req.body.i]);
  d.s.splice(i,1);
  fs.writeFile('./public/suggestions.json',JSON.stringify(d),function(err) {
    if (err) {
      console.error(err);
      res.send(err);
    }
    res.send("nice");
  });
});

// Starting our application
app.listen(config.port || 80, () => {
    console.log(`Listening on port ${config.port || 80}`)
});