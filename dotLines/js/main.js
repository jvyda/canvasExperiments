var canvas;
var ctx;
var drawn = {};
var mousePos = {};

var animationId;

var config = {
    size: {
        width: 1920,
        height: 1080
    },
    dotLines: {
        dotAmount: 500,
        boxWidth: 50,
        boxHeight: 50,
        maxLinks: 10,
        mouseRange: 100,
        numberOfIncrements: 50,
        paused: false,
        showAll: false,
        minOpacity: 0.1,
        fps: 30,
        linkRange: 100
    }
};

var currentNum = 0;

var dots = [];


function createDots() {
    for (var i = 0; i < config.dotLines.dotAmount; i++) {
        var dot = {};
        dot.x = roundedRandom(config.size.width);
        dot.y = roundedRandom(config.size.height);
        dot.origin = {x: dot.x, y: dot.y};
        createTarget(dot);
        startDotMovement(dot);
        dot.num = currentNum++;
        dot.links = [];
        dots.push(dot);
    }
}


function createLines() {
    dots.forEach(function (linkingDot) {
        dots.forEach(function (linkedDot) {
            if (linkingDot.links.length >= config.dotLines.maxLinks || linkedDot.links.length >= config.dotLines.maxLinks) return;
            var dist = pointDistance(linkingDot, linkedDot);
            if (dist < config.dotLines.linkRange && linkedDot.links.indexOf(linkingDot) == -1) {
                linkingDot.links.push(linkedDot);
            }
        })
    })
}

function renderDot(dotToRender) {
    if (dotToRender.num in drawn) return;
    var mouseDistance = pointDistance(dotToRender, mousePos);
    if ((mouseDistance > config.dotLines.mouseRange || mouseDistance == undefined || isNaN(parseInt(mouseDistance))) && !config.dotLines.showAll) return;
    drawn[dotToRender.num] = 1;
    ctx.beginPath();
    ctx.moveTo(dotToRender.x, dotToRender.y);
    var alpha = Math.max(config.dotLines.minOpacity, 1 - (mouseDistance / config.dotLines.mouseRange));
    // in case we want to show everything with full opacity
    //var alpha = Math.max(!config.dotLines.showAll ? config.dotLines.minOpacity : 1, 1 - (mouseDistance / config.dotLines.mouseRange));
    ctx.fillStyle = 'rgba(255, 0, 0, ' + alpha + ')';
    ctx.arc(dotToRender.x, dotToRender.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 0, 0, ' + alpha + ')';
    dotToRender.links.forEach(function (tar) {
        ctx.moveTo(dotToRender.x, dotToRender.y);
        ctx.lineTo(tar.x, tar.y);
    });
    ctx.stroke();
    dotToRender.links.forEach(renderDot)
}

function createTarget(dot) {
    dot.target = {
        x: dot.origin.x - config.dotLines.boxWidth / 2 + roundedRandom(config.dotLines.boxWidth),
        y: dot.origin.y - config.dotLines.boxHeight / 2 + roundedRandom(config.dotLines.boxHeight)
    };
}
function startDotMovement(dot) {
    dot.targetReached = false;
    createTarget(dot);
    var dist = pointDistance(dot, dot.target);
    var vect = {
        x: dot.target.x - dot.x,
        y: dot.target.y - dot.y
    };
    vect.x /= dist;
    vect.y /= dist;
    dot.distRemaining = dist;
    dot.vect = vect;
}

function act(dot) {
    if (dot.targetReached) {
        startDotMovement(dot);
        dot.x += dot.vect.x * (dot.distRemaining / config.dotLines.numberOfIncrements);
        dot.y += dot.vect.y * (dot.distRemaining / config.dotLines.numberOfIncrements);
    } else {
        dot.x += dot.vect.x * (dot.distRemaining / config.dotLines.numberOfIncrements);
        dot.y += dot.vect.y * (dot.distRemaining / config.dotLines.numberOfIncrements);
        if (pointDistance(dot, dot.target) < 10) {
            dot.targetReached = true;
        }
    }

}

function renderDots() {
    drawn = {};
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    dots.forEach(renderDot);
    dots.forEach(act);
    setTimeout(function () {
        if(!config.dotLines.paused) {
            animationId = requestAnimationFrame(renderDots);
        }
    }, 1000 / config.dotLines.fps)
}

function setMousePos(e) {
    mousePos = getMousePos(canvas, e);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function pause() {
    config.dotLines.paused = !config.dotLines.paused;
    if (!config.dotLines.paused) {
        animationId = requestAnimationFrame(renderDots);
    } else {
        cancelAnimationFrame(animationId);
    }
}

function showAll() {
    config.dotLines.showAll = !config.dotLines.showAll;
}


$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    canvas.onmousemove = setMousePos;
    ctx = canvas.getContext("2d");

    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');
    createDots();
    createLines();
    requestAnimationFrame(renderDots);
});



