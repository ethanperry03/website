
// incline feet, distance feet
function calculate(incline, dist) {
    var gain = 0;
    gain = dist * Math.sin(Math.atan(incline / 100));
    return gain;
}

$(document).ready(function() {

    // event handling clicking which form to show
    $(".distFormButton").click(() => {
        $(".speedtimeForm").hide();
        $(".distForm").show();
    })

    // event handling clicking which form to show
    $(".speedtimeFormButton").click(() => {
        $(".distForm").hide();
        $(".speedtimeForm").show();
    })


    // if submit is clicked, call calculate function
    $("#submit1").click(function(event) {
        event.preventDefault();

        const incline = $("#incline").val();
        var dist = $("#distance").val() * 5280;

        var gain = calculate(incline, dist);
        $(".retval").text("Gain: " + gain.toFixed(0) + "ft");
    });

    $("#submit2").click(function(event) {
        event.preventDefault();
        // convert from mph to feet / min
        var speed = $("#speed").val() * 5280 / 60;
        var time = $("#time").val();
        const dist = speed * time;
        const incline = $("#incline").val();

        var gain = calculate(incline, dist);
        $(".retval").text("Gain: " + gain.toFixed(0) + "ft");
    });


});


