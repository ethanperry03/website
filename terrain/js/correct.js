function correct_read_file(event) {
    // Get the uploaded file
    var file = event.target.files[0];  
    
    // ensure file ends with .grd, .ascii, .txt
    if (file && (file.name.endsWith(".grd")) || file.name.endsWith(".asc") || file.name.endsWith(".txt")) {
        var reader = new FileReader();
        // on load of reading the event...
        reader.onload = function(e) {
            var content = e.target.result;
            var lines = content.split('\n');

            // parse each line from the file
            for(var i = 0; i < lines.length; i++) {
                if(correct_parse_line(lines[i]) == false) {
                    return;
                }
            }
            // display_and_plot(correct);
            calculate_rmse(correct);
        };
        reader.readAsText(file);
    }
    else {
        alert("Please upload a valid .grd file.");
    }
}

// parses the file, storing cols, rows, min, max, cellsize, original into the global vars
function correct_parse_line(line) { 
    ndStr1 = "NODATA_value";
    ndStr2 = "nodata_value";
    ndStr3 = "NODATA value";
    ndStr4 = "nodata value";					
    let parts = line.split(/\s+/);
    
    // if line is empty, ignore it   
    if (!line.trim()) {
        return;
    }
    else if (line.startsWith(ndStr1) || line.startsWith(ndStr2) || 
             line.startsWith(ndStr3) || line.startsWith(ndStr4)) {
        alert("Invalid Correct File");
        return false;
    }  
    else if (!correctIsDataSection && /^\d+/.test(line.trim())) {
        correctIsDataSection = true;
    }
    else if (correctIsDataSection) {
        var values = line.trim().split(/\s+/);
        var rowData = values.map(Number);
        correct.push(rowData);
    }
    else {
        // alert("error in reading file header: " + line);
    }
    return;
}

function calculate_rmse() {
    var n = 0;
    var numerator = 0;

    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            // alert(OGmatrix[r][c] + " " + correct[r][c]);
            numerator += ((OGmatrix[r][c] - correct[r][c]) ** 2);
        }
        n++;
    }
    alert("num: " + numerator + "   N: " + n);
    var rmse = Math.sqrt(numerator/n);
    alert(rmse);
    $("#RMSE").text(rmse);
}