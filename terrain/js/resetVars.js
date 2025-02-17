function set_globals() {
    // reset any important variables
    OGmax =  -Infinity;
    OGmin =  Infinity;
    nodata = true;
    isDataSection = true;
    isInterp = false;

    // empty the output table
    $("#arrayContainer").empty();

    // Ensure metersButton is checked and others are unchecked on page load
    $('#metersButton').prop('checked', true);
    $('input[name="units"]').not('#metersButton').prop('checked', false);

    // unit convertion buttons
    $('input[name="convert"]').prop('checked', false);

    // interp plot
    $('#ogPlot').prop('checked', true);
    $('input[name="interpolate"]').not('#ogPlot').prop('checked', false);
    // $('#ogPlot').prop('checked', true);
    // $('input[name="interpolate"]').not('#ogPlot').prop('checked', false);

    // // fixing the scale
    // if(isMeters == "ft") {
    //     change_units();
    // }
    // scale_z(1);
    // scaleNum = 1;
    document.getElementById('scaleFactor').value = " ";
    
    // treelineNum = 0;
    document.getElementById('treeline').value = " ";

    $("#fileNameDisplay").val("");
    $("#outputFileName").val("");

    // now assume it is in meters
    isMeters = "meters";
    
    // delete / clear the arrays
    OGmatrix.length = 0;
    matrix.length = 0;
    interp.length = 0;
    scaleNum = 1;

}

function onValidFileUpload() {
    // since it is a valid file, open up some functionality
    validFile = true;
    isInterp = false;
    $("#scaleFactor").prop('disabled', false);
    $("#treeline").prop('disabled', false);
    $("#outputFileName").prop('disabled', false);
    document.getElementById('scaleFactor').value = 1;
    document.getElementById('treeline').value = 0;
    scaleNum = 1;
    return;
}

function load_page() {
    loadingText = "Reloading Default Page";
    
    $('input[name="units"]').prop('checked', false);
    $('input[name="convert"]').prop('checked', false);
    $('input[name="interpolate"]').prop('checked', false);

    scaleNum = 1;
    document.getElementById('scaleFactor').value = " ";
    
    treelineNum = 0;
    document.getElementById('treeline').value = " ";

    // now assume it is in meters
    isMeters = "meters";
    scaleNum = 1;
    
    // delete / clear the arrays
    OGmatrix.length = 0;
    matrix.length = 0;
    interp.length = 0;

    validFile = false;
    isInterp = false;

    $("#scaleFactor").prop('disabled', true);
    $("#treeline").prop('disabled', true);

    $("#fileNameDisplay").text("");
    $("#fileInput").text("");

    $("#outputFileName").val("");
    $("#outputFileName").prop('disabled', true);
}

function disable_clicks() {
    var overlay = $('<div id="disableCover"></div>');
    overlay.css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
    });
    $('body').append(overlay);
}