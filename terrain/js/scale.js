// scales just the z-coords of the original array by factor, stores it into new
function scale_z(factor) {
    scaleNum = factor;
    max = OGmax * factor;
    min = OGmin * factor;
    treelineNum = OGtreeline * factor;
    currentScale = factor;

    var treelineOutput = Math.round(treelineNum * 1000) / 1000;
    document.getElementById('treeline').value = treelineOutput;

    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            // non iterative scaling bc of original
            matrix[r][c] = (OGmatrix[r][c] * factor);
            // scale a copy of the idw plot
            if(interp.length != 0 && OGinterp.length != 0) {
                interp[r][c] = (OGinterp[r][c] * factor);
            }
        } 
    }
}

// if there are no_data values, substitute with mean
function process_nodata() {
    var mean = (parseFloat(OGmax) + parseFloat(OGmin)) / 2.0;
    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            if (OGmatrix[r][c] == nodata) {
                OGmatrix[r][c] = mean;
            }
        }   
    }
}

// change the units from meter to feet or vice versa
function change_units() {
    // if you are converting from feet to meters
    if (isMeters == "meters") {
        factor = 3.28084;
        isMeters = "feet";
    }
    // meters to feet
    else {
        factor = 0.3048;
        isMeters = "meters";
    }

    // **************************************************
    // change cell size
    cellsize = (cellsize * factor);
    // change tree line
    OGtreeline = OGtreeline * factor;
    treelineNum = treelineNum * factor;
    var treelineOutput = Math.round(treelineNum * 1000) / 1000;
    document.getElementById('treeline').value = treelineOutput;

    // change the min and max
    max = (max * factor);
    OGmax = (OGmax * factor);
    min = (min * factor);
    OGmin = (OGmin * factor);
    
    // loop through and scale all points
    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            matrix[r][c] = (matrix[r][c] * factor);
            OGmatrix[r][c] = (OGmatrix[r][c] * factor);
            if(interp.length != 0) {
                interp[r][c] = (interp[r][c] * factor);
                OGinterp[r][c] = (OGinterp[r][c] * factor);
            }
        } 
    }
}