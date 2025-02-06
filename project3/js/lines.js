
var c=document.getElementById("home");
var ctx=c.getContext("2d");

var first = true;
document.getElementById("slider").defaultValue = 1;
window.onload = doStuff;
document.getElementById("slider").addEventListener("mouseup", doStuff);

function doStuff() {
    var slider = document.getElementById("slider").value;

    var divbox = document.getElementById("box");

    document.getElementById("output").value = "The opacity is: " + Math.round(100*slider) + "%";
    // divbox.innerHTML = "The opacity is: " + 100*slider + "%";


    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 500, 700);
    drawLines();
    ctx.globalAlpha = slider;
    ctx.fillStyle = "#000";
    ctx.fillRect(300, 50, 100, 400);
    ctx.globalAlpha = 1;
}

function drawLines() {

    fakecol = document.getElementById("fakeline").value;
    realcol = document.getElementById("realline").value;

    // draw solo line
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.moveTo(225, 55);
    ctx.lineTo(350, 250);
    ctx.lineWidth = "3";
    ctx.stroke();

    // draw matching line on other side
    ctx.beginPath();
    ctx.strokeStyle = realcol;
    ctx.moveTo(350, 250);
    ctx.lineTo(475, 445);
    ctx.lineWidth = "3";
    ctx.stroke();

    // draw decoy path
    ctx.beginPath();
    ctx.strokeStyle = fakecol;
    ctx.moveTo(350, 225);
    ctx.lineTo(475, 420);
    ctx.lineWidth = "3";
    ctx.stroke();

    first = false;

}


doStuff();

