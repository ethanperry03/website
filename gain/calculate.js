var isDistance = true;

// incline feet, distance feet
function calculate(incline, dist) {
    var gain = 0;
    gain = dist * Math.sin(Math.atan(incline / 100));
    return gain;
}

$(document).ready(function() {

    // event handling clicking which form to show
    $(".distFormButton").click(() => {
        if(isDistance == false) {
            $(".distForm").show();
            $(".speedtimeForm").hide();
            isDistance = true;
        }
    })

    // event handling clicking which form to show
    $(".speedtimeFormButton").click(() => {
        if(isDistance == true) {
            $(".distForm").hide();
            $(".speedtimeForm").show();
            isDistance = false;
        }
    })


    // if submit is clicked, call calculate function
    $("#submit").click(function(event){
        event.preventDefault();
        if(isDistance) {
            var dist = $("#distance").val() * 5280;
        }
        else {
            // convert from mph to feet / min
            var speed = $("#speed").val() * 5280 / 60;
            var time = $("#time").val();
            var dist = speed * time;
        }
        var incline = $("#incline").val();
        var gain = calculate(incline, dist);
        $(".retval").text("Gain: " + gain.toFixed(0) + "ft");
    });


    // $("#submit1").click(function(event) {
    //     event.preventDefault();

    //     const incline = $("#incline").val();
    //     var dist = $("#distance").val() * 5280;

    //     var gain = calculate(incline, dist);
    //     $(".retval").text("Gain: " + gain.toFixed(0) + "ft");
    // });

    // $("#submit2").click(function(event) {
    //     event.preventDefault();
    //     // convert from mph to feet / min
    //     var speed = $("#speed").val() * 5280 / 60;
    //     var time = $("#time").val();
    //     const dist = speed * time;
    //     const incline = $("#incline").val();

    //     var gain = calculate(incline, dist);
    //     $(".retval").text("Gain: " + gain.toFixed(0) + "ft");
    // });


});


