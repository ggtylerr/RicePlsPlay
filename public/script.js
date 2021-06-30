function clean(a) {
  return a.replace(/\\/g,"\\\\");
}
function s(id,i,auth) {
  var data = "";
  if ($("s-link").val == "") {
    data = `{"name":"${clean($("#s-name").val())}","user":"${clean(id)}","id":"${i}","auth":"${auth}"}`
  } else {
    data = `{"name":"${clean($("#s-name").val())}","link":"${clean($("#s-link").val())}","user":"${clean(id)}","id":"${i}","auth":"${auth}"}`
  }
  $.ajax({
    type: "POST",
    url: "/suggest",
    contentType: 'application/json',
    data: data,
    success: data => {
      if (data == "nice") {
        location.reload();
      } else if (data == "!auth") {
        alert("Can't authenticate. Try reloading.");
      } else if (data == "!url") {
        alert("The URL entered is not valid.");
      } else if (data == "!name") {
        alert("The name entered is the same / similar to one already suggested.");
      } else {
        console.error(data);
        alert("Error. Check console for details.");
      }
    }
  });
}
function sort() {
  window.location.href = `${window.location.pathname}?sort=${$("#sort :selected").val()}`
}
function up(i,id,auth) {
  $.ajax({
    type: "POST",
    url: "/up",
    contentType: 'application/json',
    data: `{"i":"${i}","id":"${id}","auth":"${auth}"}`,
    success: data => {
      if (data == "nice") {
        location.reload();
      } else if (data == "!auth") {
        alert("Can't authenticate. Try reloading.")
      } else {
        console.error(data);
        alert("Error. Check console for details.");
      }
    }
  });
}
function down(i,id,auth) {
  $.ajax({
    type: "POST",
    url: "/down",
    contentType: 'application/json',
    data: `{"i":"${i}","id":"${id}","auth":${auth}}`,
    success: data => {
      if (data == "nice") {
        location.reload();
      } else if (data == "!auth") {
        alert("Can't authenticate. Try reloading.")
      } else {
        console.error(data);
        alert("Error. Check console for details.");
      }
    }
  });
}