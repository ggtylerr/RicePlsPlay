# RicePlsPlay
A very scuffed suggestion system for Catdrgn's streams

**_This code is horrible and I'm sorry for anyone that has to try and read it_**

## Installing

1. Make a file called "config.json" like so:
```json
{
    "port": "80",
    "oauth2": {
        "redirect_uri": "http://localhost/login/callback", 
        "client_id": "Your client's id",
        "secret": "Your client's secret",
        "scopes": ["identify"]
    },
    "session": {
        "secret": "youshallnotpass",
        "cookie": {
            "maxAge": 86400000
        },
        "resave": true,
        "saveUninitialized": false
    }
}
```
You can make an O-Auth application [by going here.](https://discord.com/developers/applications)

2. Install [node.js.](https://nodejs.org/en/)

3. Run `npm install` in command prompt / terminal.

4. Run `node index.js`

## API Endpoints

`/up` - Upvotes that suggestion
```
Request:
{
  "i": 1,
  "id": "143117463788191746",
  "auth": "956236140"
}
Response:
nice
```
`/down` - Downvotes that suggestion
```
Request:
{
  "i": 1,
  "id": "143117463788191746",
  "auth": "956236140"
}
Response:
nice
```
`/s` - Suggests that suggestion
```
Request:
{
  "name": "Sakura Clicker",
  "link": "https://store.steampowered.com/app/383080/Sakura_Clicker/",
  "user": "\\\\GGTyler\\\\#4480",
  "id": "143117463788191746",
  "auth": "956236140"
}
Response:
nice
```

## TODO
* **_CLEAN AND COMMENT CODE_**
* Add panel for allowed users
* Add editing

## Licensing
This project is under the WTFPL, which lets you do what the fuck you want to.

This project also used [DorZ23's Express Discord OAuth 2 example,](https://github.com/DorZ23/express-discord-oauth2) and [here's their license.](https://github.com/DorZ23/express-discord-oauth2/blob/master/LICENSE)