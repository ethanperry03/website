var c=document.getElementById("home");
var ctx=c.getContext("2d");

window.onload = startUp;
document.getElementById("squares").addEventListener("click", callSquares);
document.getElementById("lines").addEventListener("click", callLines);
document.getElementById("blank").addEventListener("click", clearAll);

function startUp () {
    animateSquares();
    animateLines();
}

function callSquares(){
    animateSquares();
}

function callLines(){
    animateLines();
}

function clearAll() {
    window.location.reload()
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
    if(opaca < .9) {
        opaca += 0.0001;
    }
    else if (opaca < 1) {
        opaca += 0.000001;
    }


    for (var i = 0; i < 7; i++) {
        drawSet(i*41, 0, opaca);
        drawSet(i*41, 4*(18), opaca);
    }
    window.requestAnimationFrame(animateSquares);
}


function drawSeg(row, stopx) {
    ctx.fillStyle = document.getElementById("lineColor").value;
    ctx.fillRect(0, row, stopx, 1);
}

var sofar = 0;
function animateLines() {
    if (sofar <= 300) {
        for(var j = 0; j < 9; j++) {
            drawSeg(j*18 + 2, sofar);
        }  
        sofar += 3;
    }
    // infinite loop to keep color change effect
    else {
        sofar = 290 - (1/sofar);
    }
    window.requestAnimationFrame(animateLines);
}