var c=document.getElementById("home");
var ctx=c.getContext("2d");


// document.getElementById("lineColor").defaultValue = "#660";
document.getElementById("fadein").addEventListener("click", FadeIn);
document.getElementById("fadeout").addEventListener("click", FadeOut);

function FadeIn() {
    animateLines();
    animateSquares();
}

function FadeOut() {
    animateBack();
}


function drawSet(shiftx, shifty, opac) {
    var ox = 8;
    var oy = 3;
    var w = 24;
    var h = 17;

    ctx.fillStyle = document.getElementById("squareColor").value;

    ctx.globalAlpha = opac;

    shifty += oy;

    ctx.fillRect(ox + shiftx, shifty, w, h);
    ctx.fillRect(2*ox + shiftx, 1*(h+1) + shifty, w, h);
    ctx.fillRect(3*ox + shiftx, 2*(h+1) + shifty, w, h);
    ctx.fillRect(2*ox + shiftx, 3*(h+1) + shifty, w, h);

    ctx.globalAlpha = 1;
}

var opaca = 0;
function animateSquares() {
    if(opaca < 1) {
        for (var i = 0; i < 7; i++) {
            drawSet(i*41, 0, opaca);
            drawSet(i*41, 4*(18), opaca);
        }
        opaca += 0.01;
        if (opaca > 0.5) {
            opaca = 1;
        }
        window.requestAnimationFrame(animateSquares);
    }
    else {
        opaca = 0;
        return;
    }
}


var opacb = 1;
function animateBack () {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 500, 500);
    drawLines();

    opacb -= 0.05;
    if (opacb > 0) {
        for (var i = 0; i < 7; i++) {
            drawSet(i*41, 0, opacb);
            drawSet(i*41, 4*(18), opacb);
        }   
        window.requestAnimationFrame(animateBack);
    }
    else {
        opacb = 1;
        return;
    }
}


function drawSeg(row, stopx) {
    ctx.fillStyle = document.getElementById("lineColor").value;
    ctx.fillRect(0, row, stopx, 1);
}

function drawLines() {
    ctx.fillStyle = document.getElementById("lineColor").value;
    for(var j = 0; j < 9; j++) {
        drawSeg(j*18 + 2, 350);
    }  
}

var sofar = 0;
function animateLines() {
    if (sofar <= 350) {
        sofar += 3;
    }
    // infinite loop to keep color change effect
    else {
        sofar = 351;
    }
    for(var j = 0; j < 9; j++) {
        drawSeg(j*18 + 2, sofar);
    }  
    window.requestAnimationFrame(animateLines);
}

setTimeout(FadeIn, 1000);