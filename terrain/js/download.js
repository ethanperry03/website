// generate the output file in dem format
function get_output_string(array) {
    // append header
    var outstring = "";
    outstring += "ncols " + cols + "\n";
    outstring += "nrows " + rows + "\n";
    outstring += "xllcorner " + xcorn + "\n";
    outstring += "yllcorner " + ycorn + "\n";
    outstring += "cellsize " + cellsize.toFixed(3) + "\n";
    // append data
    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            outstring += ((array[r][c]).toFixed(3) + " ");
        }
        outstring += "\n";
    }
    return outstring;
}

function output_to_file(array, outfile) {

    // Define the content of the file
    const content = get_output_string(array);

    // Create a Blob from the content
    const blob = new Blob([content], { type: 'application/octet-stream' });

    // Create a link element using jQuery
    const $link = $('<a></a>');

    // Set the URL of the link to the Blob
    $link.attr('href', URL.createObjectURL(blob));

    // Set the download attribute with the desired file name
    $link.attr('download', outfile);

    // Append the link to the body (required for Firefox)
    $('body').append($link);

    // Programmatically click the link to trigger the download
    $link[0].click();

    // Remove the link from the document
    $link.remove();
}

function change_outfile_name() {
    var isScaled = ".scale" + scaleNum.toString() + ".";

    if($("#ogPlot").is(':checked')) {
        $("#outputFileName").val("new.in."+isMeters+isScaled+OGfilename);
        loadingText = "Loading Original Plot";
    }
    else if($("#idwPlot").is(":checked") && interp.length != 0) {
        $("#outputFileName").val("new.interp.in."+isMeters+isScaled+OGfilename);
        loadingText = "Loading Interpolated Plot";
    }
    else if(!isVisit) {
        $("#outputFileName").val("new.in."+isMeters+isScaled+OGfilename);
        loadingText = "Loading Default Plot";
    }
    else {
        $('input[name="interpolate"]').prop('checked', false);
        $('#ogPlot').prop('checked', true);
        alert("Interpolation not possible");
        return false;
    }
    return true;
}