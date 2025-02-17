function process_idw() {
    // make a copy of the original
    interp = OGmatrix.map(sub => sub.slice());

    let coordsNoData = []

    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            if(interp[r][c] == nodata) {
                coordsNoData.push([r,c]);
            }
        }
    }

    var randIndex;
    var idwElevation;
    var tempCoords;

    // loop through all points in the array
    while (coordsNoData.length > 0) {
        // process random data values and 
        randIndex = Math.floor(Math.random() * (coordsNoData.length));
        // get the coorindates of this random point
        tempCoords = coordsNoData[randIndex];
        // get elevation of random coordinate
        idwElevation = calculate_value(tempCoords[0], tempCoords[1]);

        // if this value is not zero (meaning idw did not fail)
        if (idwElevation != 0 && idwElevation != nodata && !isNaN(idwElevation)) {
            // set new value
            interp[tempCoords[0]][tempCoords[1]] = idwElevation;
            // remove processed cord from cord array
            coordsNoData.splice(randIndex, 1);
        }
    }

    OGinterp = interp.map(sub => sub.slice());
    return;
}


function calculate_value(r, c) {
    var p = 2;
    var idwElevation;

    xposObj = xpos(r,c);
    xnegObj = xneg(r,c);
    yposObj = ypos(r,c);
    ynegObj = yneg(r,c);

    var numerator = (xposObj.elevation/(xposObj.distance**p)) + (xnegObj.elevation/(xposObj.distance**p)) +
                    (yposObj.elevation/(xposObj.distance**p)) + (ynegObj.elevation/(xposObj.distance**p)); 

    var denominator = (1/(xposObj.distance**p)) + (1/(xposObj.distance**p)) + 
                      (1/(xposObj.distance**p)) + (1/(xposObj.distance**p));

    return idwElevation = numerator/denominator;
}


// going rigth across
function xpos(r,c) {
    var elev = 0;
    var dist = 0;
    var i = c;

    // loop across the row toward the right
    while (i < cols) {
        // If you found a valid elevation
        if (interp[r][i] != nodata) {
            // Set elevation and distance, then return
            elev = interp[r][i];
            // dist = dist + cellsize;
            break;
        }
        dist = dist + cellsize;
        i++;
    }

    // if you exited the loop and the entire row was nodatas
    if (i == cols) {
        // return values to ignore the row
        dist = 1000;
        elev = 0;
    }

    // return that stuffff
    return {elevation: elev, distance: dist};
}

// going left across
function xneg(r,c) {
    var elev = 0;
    var dist = 0;
    var i = c;

    // loop across the row toward the right
    while (i >= 0) {
        // If you found a valid elevation
        if (interp[r][i] != nodata) {
            // Set elevation and distance, then return
            elev = interp[r][i];
            // dist = dist + cellsize;
            break;
        }
        dist = dist + cellsize;
        i--;
    }

    // if you exited the loop and the entire row was nodatas
    if (i < 0) {
        // return values to ignore the row
        dist = 1000;
        elev = 0;
    }

    // return that stuffff
    return {elevation: elev, distance: dist};
}

// going up the grid
function ypos(r,c) {
    var elev = 0;
    var dist = 0;
    var i = r;

    // loop across the row toward the right
    while (i >= 0) {
        // If you found a valid elevation
        if (interp[i][c] !== nodata) {
            // Set elevation and distance, then return
            elev = interp[i][c];
            // dist = dist + cellsize;
            break;
        }
        dist = dist + cellsize;
        i--;
    }

    // if you exited the loop and the entire row was nodatas
    if (i < 0) {
        // return values to ignore the row
        dist = 1000;
        elev = 0;
    }

    // return that stuffff
    return {elevation: elev, distance: dist};
}

// going down the grid
function yneg(r,c) {
    var elev = 0;
    var dist = 0;
    var i = r;

    // loop across the row toward the right
    while (i < rows) {
        // If you found a valid elevation
        if (interp[i][c] !== nodata) {
            // Set elevation and distance, then return
            elev = interp[i][c];
            // dist = dist + cellsize;
            break;
        }
        dist = dist + cellsize;
        i++;
    }

    // if you exited the loop and the entire row was nodatas
    if (i == rows) {
        // return values to ignore the row
        dist = 1000;
        elev = 0;
    }

    // return that stuffff
    return {elevation: elev, distance: dist};
}

