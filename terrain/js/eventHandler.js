// globals
let OGmatrix = [];
let matrix = [];
let OGinterp = [];
let interp = [];
let OGsparse = [];
let sparse = [];


var cellsize;
var treelineNum;
var OGtreeline;
var rows, cols;
var OGmax = -Infinity;
var OGmin = Infinity;
var min, max;

var OGfilename;
var scaleNum = 1;
var currentScale = 1;
var nodata = true;
var isDataSection = true;
var isMeters = "m";
var validFile = false;
var isVisit;
var isInterp;
var loadingText = "Loading Default Page";
var gridLines = {
    xaxis: undefined,
    yaxis: undefined,
    zaxis: undefined
};


function checkValidFile() {
    if(!validFile) {
        alert("Please upload a file first");
        return false;
    }
    return true;
}

$(document).ready(function() {
    
    // on upload of a file
    $('#fileInput').change(function(event) {
        loadingText = "Uploading DEM File";
        read_file(event);
    });

    $(window).resize(function(event) {    
        if($("#faqPopup").css('display') == 'block') {
            centerPopup();
        }    
        loadingText = "Resizing Plotting Window";
        add_spinner();
        request_and_plot();
    });

    // scale the entire matrix array when user hits enter in number field
    $('#scaleFactor').keydown(function(event) {
        // check file validity first
        if (event.key === 'Enter' && checkValidFile()) {
            event.preventDefault();
            scaleNum = $('#scaleFactor').val();
            loadingText = "Scaling Plot by a Factor of " + scaleNum;
            add_spinner();
            requestAnimationFrame(function() {
                setTimeout(function() {
                    scale_z(scaleNum);
                    change_outfile_name();
                    display_and_plot();
                }, 0);
            });
        }
    });

    // set treeline 
    $('#treeline').keydown(function(event) {
        // check file validity first
        if(!checkValidFile()) return; 

        // else
        if (event.key === 'Enter') {
            event.preventDefault();
            var val = parseFloat(document.getElementById('treeline').value);
            if (val < max && val > min) {
                loadingText = "Setting Treeline to " + val + " " + isMeters;
                add_spinner();
                treelineNum = val;
                OGtreeline = treelineNum / currentScale;
                request_and_plot();
            }
            else {
                alert(val + " is outside of the range (" + min + ", " + max + ")!");
            }
        }
    });

    // // change the scale, assume meters
    // $('.unitsButton').click(function(event) {
    //     // check file validity first
    //     if(!checkValidFile()) {
    //         $(".unitsButton").prop("checked", false);
    //         return;
    //     } 
        
    //     loadingText = "Converting Units";

    //     //  && isMeters == "ft"
    //     if($('#metersButton').is(":checked")) {
    //         $("#treelineLabel").text("Tree Line (m)");
    //         change_units();
    //         change_outfile_name();
    //         display_and_plot();
    //     }
    //     //  && isMeters == "m"
    //     else if ($('#feetButton').is(":checked")) {
    //         $("#treelineLabel").text("Tree Line (ft)");
    //         change_units();
    //         change_outfile_name();
    //         display_and_plot();
    //     }
    // });

    // change the scale, assume meters
    $('.convertButton').click(function(event) {
        // check file validity first
        if(!checkValidFile()) {
            $(".convertButton").prop("checked", false);
            return;
        } 

        // else if the selection was valid
        if($('#MTF').is(":checked")) {
            isMeters = "meters";
            loadingText = "Converting from Meters to Feet";
            $('#feetButton').prop('checked', true);
            $('input[name="units"]').not('#feetButton').prop('checked', false);
            add_spinner();
            requestAnimationFrame(function() {
                setTimeout(function() {
                    change_units();
                    change_outfile_name();
                    display_and_plot();
                    $("#treelineLabel").text("Tree Line (ft)");
                }, 0);
            });
        }
        if ($('#FTM').is(":checked")) {
            isMeters = "feet";
            loadingText = "Converting from Feet to Meters";
            $('#metersButton').prop('checked', true);
            $('input[name="units"]').not('#metersButton').prop('checked', false);
            add_spinner();
            requestAnimationFrame(function() {
                setTimeout(function() {
                    change_units();
                    change_outfile_name();
                    display_and_plot();
                    $("#treelineLabel").text("Tree Line (m)");
                }, 0);
            });
        }
    });

    // download the current dem that is downloaded given scale and units
    $('#DEMdownload').click(function(event) {
        // check file validity first
        if(!checkValidFile()) return;

        loadingText = "Downloading DEM File";
    
        var outputFile = '';
        var validExtensions = ['.grd', '.asc', '.txt', '.dem'];
    
        while (true) {
            outputFile = prompt("Enter output file name ending in .grd | .asc | .txt");
            if (outputFile == null) {
                return;
            }
            else if (!outputFile) {
                alert("Invalid output file name, please try again");
            } else {
                var isValid = validExtensions.some(function(ext) {
                    return outputFile.endsWith(ext);
                });
                if (isValid) {
                    break;
                }
                else{
                    alert("Invalid output file name, please try again");
                }
            }
        }

        if(matrix.length != 0 && $("#ogPlot").is(":checked")) {
            $('#arrayContainer').append("<br><h3>Output to file: " + outputFile + "</h3>");
            output_to_file(matrix, outputFile);
        }
        else if(interp.length != 0 && $("#idwPlot").is(":checked")) {
            $('#arrayContainer').append("<br><h3>Output to file: " + outputFile + "</h3>");
            output_to_file(interp, outputFile);
        }
        else {
            alert("Cannot download; no file uploaded");
        }
    });

    // event handler to change plots
    $(".showPlot").click(function() {
        // change text

        // check file validity first
        if(!checkValidFile()) {
            $(".showPlot").prop("checked", false);
            return;
        } 
        else if (matrix.length == 0 && OGmatrix.length == 0) {
            $('input[name="interpolate"]').prop('checked', false);
            alert("Error: please upload a valid file first");
        }
        else if (change_outfile_name()) {
            add_spinner();
            request_and_plot();
        }
        else {
            // alert("Selection did not work");
        }
    });
    
    // Event listener for STL download
    $('#downloadSTL').click(function() {
        loadingText = "Downloading STL File";

        // check file validity first
        if(!checkValidFile()) {return;}

        var outputFile = '';
        var validExtensions = ['.stl'];
    
        while (true) {
            outputFile = prompt("Enter output .stl file name");
            if (outputFile == null) {
                return;
            }
            else if (!outputFile) {
                alert("Invalid output file name, remember to include .stl");
            } else {
                var isValid = validExtensions.some(function(ext) {
                    return outputFile.endsWith(ext);
                });
                if (isValid) {
                    break;
                }
                else{
                    alert("Invalid output file name, remember to include .stl");
                }
            }
        }

        if (!isInterp) {
            // generate vertices and faces
            var { vertices, faces } = createMesh(matrix);
        }
        else if (isInterp) {
            // generate vertices and faces
            var { vertices, faces } = createMesh(interp);
        }
        // generate stl content
        const stlData = generateSTL(vertices, faces, cols, rows);

        // Create a Blob and download link for the STL file
        const blob = new Blob([stlData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = outputFile;
        a.click();
        window.URL.revokeObjectURL(url);
    });

    $("#loadDefault").click(function() {
        load_default_page();
    });

    $('.dropdown-menu .dropdown-item').on('click', function(event) {
        event.stopPropagation(); // Prevent the dropdown from closing
    });

    $(".axisCheck").change(function() {
        if(!checkValidFile()) {
            $('input[type="checkbox"]').prop('checked', false);
            return;
        }
        loadingText = "Changing Axis Lines";
        add_spinner();
        request_and_plot();
    });

    $("#addContour").change(function() {
        if(!checkValidFile()) {
            $('input[type="checkbox"]').prop('checked', false);
            return;
        }
        loadingText = "Add/Remove Contour Shadow";
        add_spinner();
        request_and_plot();
    });

    $(".clearAll").click(function() {
        if(!checkValidFile()) {
            $('input[type="checkbox"]').prop('checked', false);
            return;
        }
        loadingText = "Clearing All Plotting Features";
        gridLines.xaxis = false;
        gridLines.yaxis = false;
        gridLines.zaxis = false;
        $('input[type="checkbox"]').prop('checked', false);
        add_spinner();
        request_and_plot();
    });
    $(".checkAll").click(function() {
        if(!checkValidFile()) {
            $('input[type="checkbox"]').prop('checked', false);
            return;
        }
        loadingText = "Adding All Plotting Features";
        gridLines.xaxis = true;
        gridLines.yaxis = true;
        gridLines.zaxis = true;
        $('input[type="checkbox"]').prop('checked', true);
        add_spinner();
        request_and_plot();
    });

    $(".zipDownload").click(function(event) {
        event.preventDefault();

        var result = confirm("Would you like to download this zip file?");
        if (result) {
            window.location.href = $(this).attr('href');
        }
    });

    // $("#sparseProp").keydown(function(event) {
    //     // check file validity first
    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         // change message
    //         loadingText = "Removing " + $("#sparseProp").val() + " of the data";
    //         // add spinner
    //         add_spinner();
            
    //         requestAnimationFrame(function() {
    //             setTimeout(function() {
    //                 // now call the sparse main function
    //                 sparse_driver();
    //             }, 0);
    //         }); 
    //     }
    // });

    $(".logoImage").mouseover(function() {
        $(".logoImage").prop("src", "images/logoGreen.png");
    });
    $(".logoImage").mouseout(function() {
        $(".logoImage").prop("src", "images/logo.png");
    });

    //************************ */ popup menu
     // Open the FAQ popup
     $('.openFAQ').click(function() {
        $('#faqPopup').css('display', 'block');
        centerPopup();
    });

    // Close the FAQ popup
    $('#closeFAQ').click(function() {
        $('#faqPopup').css('display', 'none');
    });
    
    $(window).click(function(event) {
        if ($(event.target).is("#faqPopup")) {
            $("#faqPopup").css("display", "none");
        }
    });

    // Center the FAQ popup
    function centerPopup() {
        var $faqContent = $('.faq-content');
        var top = ($(window).height() - $faqContent.outerHeight()) / 2;
        var left = ($(window).width() - $faqContent.outerWidth()) / 2;
        $faqContent.css({
            'margin-top': top + 'px',
            'margin-left': left + 'px'
        });
    }

});    


// window.addEventListener('load', load_page());
window.addEventListener('load', check_session_visit());
// $(document).ready(load_page);
