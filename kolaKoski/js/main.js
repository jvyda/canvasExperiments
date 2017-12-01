var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    kolakoski: {
        width: Math.min(25, window.innerWidth / (20 * 2)),
        center: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        },
        sequences: 7,
        sequenceLength: 50,
        piePart: 0.75,
        pieStartingPoint: 0.63,
        rainbowFrequency: 0.01,
        digits: [1, 2],
        paintDigits: [1, 2],
        fullSizing: {
            active: false,
            arc: 0.01,
            width: 1
        },
        paintAll: true
    },
    general: {
        fps: 30,
        scala: 1
    }
};

var sequence = [];
var startPositionWithinSequence = 2;

function fillWithSpecialStartBecauseThisSucks(){
    var firstElement = [];
    firstElement.push(config.kolakoski.digits[0]);
    for(var i = 0; i < config.kolakoski.digits[1]; i++){
        firstElement.push(config.kolakoski.digits[1]);
    }
    for(var i = config.kolakoski.digits[1]; i < config.kolakoski.digits.length; i++){
        for(var f = 0; f < firstElement[startPositionWithinSequence]; f++){
            firstElement.push(config.kolakoski.digits[i]);
        }
        startPositionWithinSequence++;
    }

    sequence.push(firstElement);
}


function generateSequence(){
    var seq = sequence[0];
    var cnt = 0;
    for(var i = startPositionWithinSequence; cnt < config.kolakoski.sequenceLength; i++, cnt++){
        var val = getInsertValue();
        for(var f = 0; f < seq[i]; f++){
            seq.push(val);
        }
    }

    for(var i = 0; i < config.kolakoski.sequences; i++){
        sequence.push(compressSequence(seq));
        seq = sequence[i + 1];
    }
}

function compressSequence(sequence){
    var newSequence = [];
    for(var i = 0; i < sequence.length; ) {
        var same = getAmountOfSameDigits(sequence[i], i, sequence);
        newSequence.push(same);
        i += same;
    }
    //console.log(JSON.stringify(newSequence))
    return newSequence;
}

function getAmountOfSameDigits(digit, index, sequence){
    var cnt = 0;
    for(var i = index; i < sequence.length; i++){
        if(sequence[i] == digit){
            cnt++;
        } else {
            break;
        }
    }
    return cnt;
}

function renderSequence(sequence, radius, width, sequenceLevel){
    var totalArc = 2 * Math.PI * config.kolakoski.piePart;
    var arcPerDigit = totalArc / (getSum(sequence));

    var startArc = - 2 * Math.PI * config.kolakoski.pieStartingPoint;
    if(!config.kolakoski.fullSizing.active){
        width -= config.kolakoski.fullSizing.width;
    }
    for(var i = 0; i < sequence.length; i++){
        if(config.kolakoski.paintAll || config.kolakoski.paintDigits.indexOf(sequence[i]) > -1) {
            ctx.beginPath();
            ctx.strokeStyle = rainbowColors[(i / sequence.length * rainbowColors.length) << 0].styleRGB;
            //ctx.strokeStyle = colors[sequence[i]];
            var arcTargetToPaint = startArc + arcPerDigit * sequence[i];
            if(!config.kolakoski.fullSizing.active){
                arcTargetToPaint -= config.kolakoski.fullSizing.arc;
            }
            ctx.arc(config.kolakoski.center.x, config.kolakoski.center.y, radius, startArc, arcTargetToPaint);
            ctx.lineWidth = width;
            ctx.lineCap = 'butt';
            ctx.stroke();
        }

        startArc += arcPerDigit * sequence[i];
    }
}

function getNextRainbowColor(){
    var color = rainbowColors[globalCounter];
    globalCounter++;
    globalCounter %= rainbowColors.length;
    return color;
}

var colors = ['', 'red', 'green', 'yellow', 'blue', 'orange', 'black', 'brown'];

function getSum(sequence){
    var sum = 0;
    sequence.forEach(function(element){
        sum += element;
    });
    return sum;
}

var newValueCounter = -1;


function getInsertValue(){
    newValueCounter++;
    newValueCounter %= config.kolakoski.digits.length;
    return config.kolakoski.digits[newValueCounter];
}

var globalCounter = 0;
var rainbowColors = [];

function updateCanvas(){
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    ctx.translate(toMove.x, toMove.y);
    toMove.x = 0;
    toMove.y = 0;
    for(var s = 0; s < sequence.length; s++){
        renderSequence(sequence[s], sequence.length * config.kolakoski.width - s * config.kolakoski.width, config.kolakoski.width, s);
    }
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.general.fps)
}

$(document).ready(function () {
    var canvasJQuery = $("#canvas");
    canvas = canvasJQuery[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    canvas.addEventListener("mousedown", mouseClick, false);
    canvas.addEventListener("mouseup", mouseClick, false);
    canvas.addEventListener("mousemove", drag, false);
    canvasJQuery.on('wheel', mouseWheelEvent);
    trackTransforms(ctx);

    fillWithSpecialStartBecauseThisSucks();
    generateSequence();
    rainbowColors = createRainbowColors(config.kolakoski.rainbowFrequency);

    requestAnimationFrame(updateCanvas);


});

var lastDrag = {
    x: 0,
    y: 0
};

var toMove = {
    x: 0,
    y: 0
};

var scalePoint = {
    x: 0,
    y: 0
};


var mouseDown = false;

function mouseClick(event){
    mouseDown = !mouseDown;
    if(mouseDown){
        var mousePos = getMousePos(canvas, event);
        mousePos.x /= config.general.scala;
        mousePos.y /= config.general.scala;
        lastDrag = mousePos;
    }
}

function drag(event){
    if(mouseDown){
        var mousePos = getMousePos(canvas, event);
        mousePos.x /= config.general.scala;
        mousePos.y /= config.general.scala;
        toMove.x += mousePos.x - lastDrag.x;
        toMove.y += mousePos.y - lastDrag.y;
        lastDrag = mousePos;
    }
}

function mouseWheelEvent(event) {
    scalePoint = getMousePos(canvas, event);
    scalePoint = ctx.transformedPoint(scalePoint.x, scalePoint.y);
    var scaleTo = event.originalEvent.deltaY < 0 ? 1.1 : 1/1.1;
    config.general.scala *= scaleTo;
    ctx.translate(scalePoint.x, scalePoint.y);
    ctx.scale(scaleTo, scaleTo);
    ctx.translate(-scalePoint.x, -scalePoint.y);
    event.preventDefault()
}