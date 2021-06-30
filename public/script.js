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
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
  return false;
};
function sort() {
  let p = "";
  if (getUrlParameter('admin') == false) {
    p = $.param({'sort':$("#sort :selected").val()});
  } else {
    p = $.param({'sort':$("#sort :selected").val(),'admin':getUrlParameter('admin')});
  }
  window.location.href = window.location.pathname + "?" + p;
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
function editshow(i,id,auth) {
  if ($(`#${i}`).children(`#edit-${i}`).length == 0) {
    var e = `
      <div id="edit-${i}">
        <input type="text" id="s-${i}-name" placeholder="Name"></input>
        <input type="text" id="s-${i}-link" placeholder="Link (optional)"></input>
        <input type="button" onclick="edit('${i}','${id}','${auth}')" value="Go!"></input>
      </div>
    `;
    $(`#${i}`).append(e);
  } else {
    $(`#edit-${i}`).remove();
  }
}
function edit(i,id,auth) {
  var data = "";
  if ($(`s-${i}-link`).val == "") {
    data = `{"i":"${i}","name":"${clean($(`#s-${i}-name`).val())}","id":"${id}","auth":"${auth}"}`
  } else {
    data = `{"i":"${i}","name":"${clean($(`#s-${i}-name`).val())}","link":"${clean($(`#s-${i}-link`).val())}","id":"${id}","auth":"${auth}"}`
  }
  $.ajax({
    type: "POST",
    url: "/edit",
    contentType: "application/json",
    data: data,
    success: data => {
      if (data == "nice") {
        location.reload();
      } else if (data == "!auth") {
        alert("Can't authenticate. Try reloading.");
      } else if (data == "!gone") {
        alert("The item you're trying to edit has been removed. Try reloading.");
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
function remove(i,id,auth) {
  if ($(`#remove-${i}`).css("visibility") == "hidden") {
    $(`#remove-${i}`).css("visibility","visible");
    setTimeout(() => {
      $(`#remove-${i}`).css("visibility","hidden");
    },10000);
    return;
  }
  $.ajax({
    type: "POST",
    url: "/remove",
    contentType: "application/json",
    data: `{"i":"${i}","id":"${id}","auth":"${auth}"}`,
    success: data => {
      if (data == "nice") {
        location.reload();
      } else if (data == "!auth") {
        alert("Can't authenticate. Try reloading.");
      } else {
        console.error(data);
        alert("Error. Check console for details.");
      }
    }
  });
}