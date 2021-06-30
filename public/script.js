function clean(a) {
  return a.replace(/\\/g,"\\\\");
}
function s(id) {
  var data = "";
  if ($("s-link").val == "") {
    data = `{"name":"${clean($("#s-name").val())}","user":"${clean(id)}"}`
  } else {
    data = `{"name":"${clean($("#s-name").val())}","link":"${clean($("#s-link").val())}","user":"${clean(id)}"}`
  }
  $.ajax({
    type: "POST",
    url: "/suggest",
    contentType: 'application/json',
    data: data,
    success: data => {
      if (data == "nice") {
        location.reload();
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
function up(i,id) {
  $.ajax({
    type: "POST",
    url: "/up",
    contentType: 'application/json',
    data: `{"i":"${i}","id":"${id}"}`,
    success: data => {
      if (data == "nice") {
        location.reload();
      }
      else {
        console.error(data);
        alert("Error. Check console for details.");
      }
    }
  });
}
function down(i,id) {
  $.ajax({
    type: "POST",
    url: "/down",
    contentType: 'application/json',
    data: `{"i":"${i}","id":"${id}"}`,
    success: data => {
      if (data == "nice") {
        location.reload();
      }
      else {
        console.error(data);
        alert("Error. Check console for details.");
      }
    }
  });
}