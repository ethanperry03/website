var c=document.getElementById("home");
var ctx=c.getContext("2d");


document.getElementById("animateLines").addEventListener("click", animateIt);

// var size = alert(document.querySelector("select").value);

var forward = true;
function animateIt () {
    if (forward) {
        lineAnimationForward();
        forward = false;
    }
    else {
        lineAnimationBackward();
        forward = true;
    }
}

function drawLineTop(height) {
    ctx.moveTo(200, height);
    ctx.beginPath();
    ctx.lineTo(200, height);
    ctx.lineTo(500, height);

    ctx.closePath();

    ctx.strokeStyle = document.getElementById("topColor").value;
    ctx.lineWidth = 4;
    ctx.stroke();
}

var topCorn = 200;
function drawCornersTop() {
    ctx.moveTo(175, topCorn-35);
    ctx.beginPath();
    ctx.lineTo(175, topCorn-35);
    ctx.lineTo(200, topCorn);
    ctx.lineTo(175, topCorn+35);

    ctx.strokeStyle="#333";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.moveTo(525, topCorn-35);
    ctx.beginPath();
    ctx.lineTo(525, topCorn-35);
    ctx.lineTo(500, topCorn);
    ctx.lineTo(525, topCorn+35);

    ctx.strokeStyle="#333";
    ctx.lineWidth = 4;
    ctx.stroke();
}

drawLineTop(topCorn);
drawCornersTop();


var botCorn = 300;
function drawCornersBottom() {
    ctx.moveTo(225, botCorn-35);
    ctx.beginPath();
    ctx.lineTo(225, botCorn-35);
    ctx.lineTo(200, botCorn);
    ctx.lineTo(225, botCorn+35);

    ctx.strokeStyle="#333";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.moveTo(475, botCorn-35);
    ctx.beginPath();
    ctx.lineTo(475, botCorn-35);
    ctx.lineTo(500, botCorn);
    ctx.lineTo(475, botCorn+35);

    ctx.strokeStyle="#333";
    ctx.lineWidth = 4;
    ctx.stroke();
}

function drawLineBottom(height) {
    ctx.moveTo(200, height);
    ctx.beginPath();
    ctx.lineTo(200, height);
    ctx.lineTo(500, height);

    ctx.closePath();

    ctx.strokeStyle = document.getElementById("botColor").value;
    ctx.lineWidth = 4;
    ctx.stroke();
}

drawLineBottom(botCorn);
drawCornersBottom();

// add variables for lines heights
// iterate through to 
var row = topCorn;
function lineAnimationForward () {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, 700, 500);
    drawLineBottom(500-row);
    drawLineTop(row);
    drawCornersTop();
    drawCornersBottom();    
    if(row < botCorn){
        row+=1.5;
        window.requestAnimationFrame(lineAnimationForward);
    }
    else {
        row = topCorn;
    }
}

var back = botCorn;
function lineAnimationBackward () {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, 700, 500);
    drawLineBottom(500-back);
    drawLineTop(back);
    drawCornersTop();
    drawCornersBottom();
    if(back > topCorn){
        back-=1.5;
        window.requestAnimationFrame(lineAnimationBackward);
    }
    else {
        back = botCorn;
    }
}