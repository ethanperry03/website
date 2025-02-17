// Function to set a session cookie
function set_session_cookie(name, value) {
  document.cookie = name + "=" + (value || "") + "; path=/";
}

// Function to get a cookie
function get_cookie(name) {
  var nameEQ = name + "=";
  var splicedCookie = document.cookie.split(";");
  for (var i = 0; i < splicedCookie.length; i++) {
    var cook = splicedCookie[i];
    while (cook.charAt(0) == " ") cook = cook.substring(1, cook.length);
    if (cook.indexOf(nameEQ) == 0)
      return cook.substring(nameEQ.length, cook.length);
  }
  return null;
}

// Function to check and set the session visit cookie
function check_session_visit() {
  isVisit = get_cookie("sessionVisited");

  if (!isVisit) {
    $('input[type="checkbox"]').prop("checked", true);
    load_default_page();
    // Set the session visit cookie
    set_session_cookie("sessionVisited", "true");
  } else {
    // Perform actions for subsequent visits in this session
    load_page();
  }
}

function load_default_page() {
  // reset the global variables
  set_globals();
  // clear surface plot div
  $("#surfacePlot").html("");
  // show loader
  add_spinner();
  // Perform actions for the first visit in this session
  var defaultFile = "dems/mtWashington.grd";
  // var defaultFile = 'dems/exampleFiles/sparse/washington0.1.grd';
  OGfilename = defaultFile;

  // First time visit in this session
  // Fetch the file content from the server
  $.get(defaultFile, function (data) {
    parse_file(data, defaultFile);
  }).fail(function () {
    alert("failure");
    $(".loader").remove();
  });
}
