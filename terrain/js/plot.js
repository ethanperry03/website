// Function to create the 3D surface plot using Plotly.js
function plot_surface(arr) {

    var displayUnits = isMeters;

    var xData = [], yData = [];
    for (var i = 0; i < cols; i++) {
        xData.push(i*cellsize);  // X-axis values, scaling if needed
    }
    for (var j = 0; j < rows; j++) {
        yData.push(j*cellsize);  // Y-axis values, scaling if needed
    }


    var plotMax, plotMin;
    if(scaleNum > 1) {
        plotMax = Math.max(max, OGmax);
        plotMin = Math.max(min, OGmin);
    }
    else if(scaleNum < 1) {
        plotMax = Math.min(max, OGmax);
        plotMin = Math.min(min, OGmin);
    }
    else {
        plotMax = max;
        plotMin = min;
    }

    var aspectRatio = {
        x: (cols * cellsize),
        y: (rows * cellsize), 
        z: (plotMax - plotMin)
    };

    var maxRange = Math.max(aspectRatio.x, aspectRatio.y, aspectRatio.z);
    aspectRatio.x = aspectRatio.x / maxRange;
    aspectRatio.y = aspectRatio.y / maxRange;
    aspectRatio.z = aspectRatio.z / maxRange;
    

    // plot boundaries
    var prop = (treelineNum - plotMin) / (plotMax - plotMin);

    // declare and define color scale
    var colorScale = [
        [0, 'rgb(10, 75, 10)'], 
        [prop*0.33, 'rgb(57, 102, 30)'], 
        [prop*0.7, 'rgb(103, 166, 64)']
    ]
    // check prop
    if (prop == 1) {
        colorScale.push([1, 'rgb(130, 189, 66)']);
    }
    else {
        colorScale.push([prop, 'rgb(90, 141, 36)']);
        colorScale.push([1, 'rgb(105, 96, 96)']);
    }

    var plotRange = (plotMax - plotMin);


    // define data
    var data = [{
        x: xData, 
        y: yData,
        z: arr,
        name: '',
        type: 'surface', 
        hovertemplate: '%{z} ' + displayUnits,
        hoverinfo: 'z',
        contours: {
            x: {highlight: false}, 
            y: {highlight: false},            
            z: {
                highlightwidth: 5,
                highlightcolor: "#81e453",
            }
        },
        colorscale: colorScale,
        cmin: plotMin, 
        cmax: plotMax 
    }];


    // Define the layout for the plot
    var layout = {
        title: {
            text: "Surface Plot of '" + OGfilename + "'",
            font: { size: 27 }
        },
        paper_bgcolor: '#ead8c7',
        margin: {
            l: 10, 
            r: 20, 
            t: 60, 
            b: 20
        },
        scene: {
            camera: {
                eye: {x: 0.90, y: 1, z: 0.6}, 
                center: {x: 0, y: 0, z: 0}, 
                up: {x: 0, y: 0, z: 1}
            },
            xaxis: {
                title: 'x',
                automargin: true,
                fixedrange: true, 
                showspikes: false
                ,showgrid: false
                ,visible: false
            },
            yaxis: {
                title: 'y',
                automargin: true,
                fixedrange: true,
                showspikes: false,
                scaleanchor: 'x',
                scaleratio: 1
                ,showgrid: false
                ,visible: false
            },
            zaxis: {
                title: 'Elevation in ' + displayUnits,
                automargin: true,
                fixedrange: true,
                showspikes: false
                ,showgrid: false
                ,visible: false
                ,max: plotMax
                ,range: [plotMin - (plotRange*0.05), plotMax + (plotRange*0.05)] 
            }, 
            // aspectmode: 'data', 

            aspectmode: 'manual', 
            aspectratio: aspectRatio

        },
        autosize: true
    };

    // Define the config to disable all mode bar buttons except for the surface option
    var config = {
        modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'zoom2d', 'pan2d', 'select2d', 'lasso2d',
                                    'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian',
                                    'hoverCompareCartesian', 'zoom3d', 'pan3d', 'resetCameraDefault3d', 'resetCameraLastSave3d',
                                    'hoverClosest3d', 'orbitRotation', 'tableRotation', 'handleDrag3d'],
        displaylogo: false // Optionally remove the Plotly logo
    };


    layout.width = $("#plot").width();
    layout.height = $("#plot").height();

    set_axis();
    Object.keys(gridLines).forEach(axis => {
        if(gridLines[axis] == true) {
            layout.scene[axis].showgrid = true;
            layout.scene[axis].visible = true;
        }
    });

    var roundRange = (Math.floor(plotMax) - Math.ceil(plotMin));
    var magnitude = Math.pow(10, Math.floor(Math.log10(roundRange)));
    var ringRange = Math.round(roundRange / magnitude) * magnitude;
    var ringSize = ringRange / 10;

    if($("#addContour").is(':checked')) {
        data[0].contours =  {
            x: {highlight: false}, 
            y: {highlight: false},
            z: {
                show: true,
                usecolormap: true,
                highlightwidth: 5,
                highlightcolor: "#81e453",
                project: { z: true }
                ,start: Math.ceil(plotMin)
                ,end: Math.floor(plotMax)
                ,size: ringSize
            }
        };
    }

    Plotly.newPlot('surfacePlot', data, layout, config);
    $(".loader").remove();
    $("form :input").removeAttr('disabled');
}

function set_axis() {
    gridLines.xaxis = $("#xAddPlot").is(':checked');
    gridLines.yaxis = $("#yAddPlot").is(':checked');
    gridLines.zaxis = $("#zAddPlot").is(':checked');
    $("#xAddPlot").prop('checked', gridLines.xaxis);
    $("#yAddPlot").prop('checked', gridLines.yaxis);
    $("#zAddPlot").prop('checked', gridLines.zaxis);
}

function request_and_plot() {
    requestAnimationFrame(function() {
        setTimeout(function(){
            display_and_plot();
        }, 0);
    });
}