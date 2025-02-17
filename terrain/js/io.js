function read_file(event) {
    // reset the global variables
    set_globals();
    // show loader
    add_spinner();

    // Get the uploaded file
    var file = event.target.files[0];  
    
    // ensure file ends with .grd, .ascii, .txt
    if (file && (file.name.endsWith(".grd")) || file.name.endsWith(".asc") || file.name.endsWith(".txt")) {
        var reader = new FileReader();
        // on load of reading the event...
        reader.onload = function(e) {
            var content = e.target.result;
            parse_file(content, file.name);
        }
        // $("#fileNameDisplay").text(file.name);
        reader.readAsText(file);
        event.target.value = "";
    }
    else {
        alert("Please upload a valid dem file.");
        load_page();
        $(".loader").remove();
    }
}

function parse_file(content, file) {
    onValidFileUpload();

    // parse the file name
    var parts = file.split('/');
    file = parts.pop();
    OGfilename = file;

    // split content lines
    var lines = content.split('\n');

    // parse each line from the file
    for(var i = 0; i < lines.length; i++) {
        parse_line(lines[i]);
    }

    // set treeline original
    if (document.getElementById('treeline').value == 0) {
        OGtreeline = OGmax;
    }
    else {
        OGtreeline = document.getElementById('treeline').value;
    }
    document.getElementById('treeline').value = OGtreeline;

    change_outfile_name();

    // $("#outputFileName").val("new."+isMeters+"."+OGfilename);

    // set min max globals
    treelineNum = OGtreeline;
    min = OGmin;
    max = OGmax;

    // set nodata
    if (nodata != true) {
        process_idw();
        process_nodata();
    }
    // copy matrix and display original
    matrix = OGmatrix.map(sub => sub.slice());
    display_array(matrix);
    plot_surface(matrix);

    // set the file name output text
    $("#fileNameDisplay").text(file);
}

function add_spinner() {
    $("#surfacePlot").html('');
    $("form :input").attr('disabled', true);
    $("#plot").append("<div class='loader d-flex justify-content-center align-items-center flex-column h-100'></div>");
    $(".loader").append("<div class='spiner loader spinnerdiv spinner-border' role='status'></div><br><h3 class='loader loadingText'></h3>");
    $(".spinnerdiv").append("<span class='loader sr-only'></span>");
    $(".loadingText").text(loadingText);
}

function display_and_plot() {
    if($("#ogPlot").is(":checked") && matrix.length != 0) {
        display_array(matrix);
        plot_surface(matrix);
        isInterp = false;
    }
    else if($("#idwPlot").is(":checked") && interp.length != 0) {
        display_array(interp);
        plot_surface(interp);
        isInterp = true;
    }
    else if(sparse.length != 0) {
        display_array(sparse);
        plot_surface(sparse);
        $("#ogPlot").prop('checked', false);
    }
    else {
        $(".loader").remove();
    }
}

// parses the file, storing cols, rows, min, max, cellsize, original into the global vars
function parse_line(line) { 
    ndStr1 = "NODATA_value";
    ndStr2 = "nodata_value";
    ndStr3 = "NODATA value";
    ndStr4 = "nodata value";					
    let parts = line.split(/\s+/);
    // if line is empty, ignore it   
    if (!line.trim()) {
        return;
    }
    else if (line.startsWith('xllcorner')) {
        xcorn = parseInt(parts[1], 10);
    } 
    else if (line.startsWith('yllcorner')) {
        ycorn = parseInt(parts[1], 10);
    } 
    else if (line.startsWith('ncols')) {
        cols = parseInt(parts[1], 10);
    }
    else if (line.startsWith('nrows')) {
        rows = parseInt(parts[1], 10);
    }
    else if (line.startsWith(ndStr1) || line.startsWith(ndStr2)) {
        nodata = parseInt(parts[1], 10);
    }
    else if (line.startsWith(ndStr3) || line.startsWith(ndStr4)) {
        nodata = parseInt(parts[2], 10);
    }
    else if (line.startsWith('cellsize')) {			
        cellsize = parseFloat(parts[1], 10);
    }    
    else if (!isDataSection && /^\d+/.test(line.trim())) {
        alert("data slection: " + line);
        isDataSection = true;
    }
    else if (isDataSection) {
        var values = line.trim().split(/\s+/);
        var rowData = values.map(Number);
        OGmatrix.push(rowData);
        
        let localmax = Math.max(...rowData);
        if(localmax > OGmax) {
            OGmax = localmax;
        }
        let localmin = Math.min(...rowData);
        if(localmin < OGmin && localmin != nodata) {
            OGmin = localmin;
        }
    }
    else {
        alert("error in reading file header: " + line);
    }
    return;
}

function display_array(arr) {

    var $main = $('#arrayContainer');
    var $container = $('<div></div>');
    // Create header row with additional variables
    var $header = $('<div></div>').text(
        'Rows: ' + rows + " Cols: " + cols + ' Max: ' + max + ' Min: ' + min + 
        ' Cellsize: ' + cellsize + " OGmax: " + OGmax + " OGmin: " + OGmin
    );
    $container.append("<br>")
    $container.append($header);
    $main.append($container);

    return;

    var $main = $('#arrayContainer');
    var $container = $('<div></div>');
    var $table = $('<table></table>');
    $table.css('border', '1px solid black'); // Add border for clarity

    // Create header row with additional variables
    var $header = $('<div></div>').text(
        'Rows: ' + rows + " Cols: " + cols + ' Max: ' + max + ' Min: ' + min + 
        ' Cellsize: ' + cellsize + " xcorn  " + xcorn + "  ycorn: " + ycorn
    );
    $container.append("<br>")
    $container.append($header);

    // Add rows and cells to the table
    for (var i = 0; i < arr.length; i++) {
        var $row = $('<tr></tr>');
        for (var j = 0; j < arr[i].length; j++) {
            var $cell = $('<td></td>').text(arr[i][j]);
            $row.append($cell);
        }
        $table.append($row);
    }

    $container.append($table);
    $main.append($container);

}