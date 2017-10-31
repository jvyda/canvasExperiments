var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    kolakoski: {
        width: Math.min(15, window.innerWidth / (20 * 2)),
        center: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        },
        sequences: 12,
        sequenceLength: 20,
        piePart: 0.75,
        pieStartingPoint: 0.66,
        rainbowFrequency: 0.1,
        digits: [1, 2],
        paintDigits: [1, 2, 3, 4],
        fullSizeBlocks: false,
        paintAll: false
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
    if(!config.kolakoski.fullSizeBlocks){
        width -= 1;
    }
    for(var i = 0; i < sequence.length; i++){
        if(config.kolakoski.paintAll || config.kolakoski.paintDigits.indexOf(sequence[i]) > -1) {
            ctx.beginPath();
            ctx.strokeStyle = getNextRainbowColor().styleRGB;
            var arcTargetToPaint = startArc + arcPerDigit * sequence[i];
            if(!config.kolakoski.fullSizeBlocks){
                arcTargetToPaint -= 0.01;
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

var color = ['', 'red', 'green', 'yellow', 'blue', 'orange', 'black', 'brown'];

function getSum(sequence){
    var sum = 0;
    sequence.forEach(function(element){
        sum += element;
    });
    return sum;
}

var newValueCounter = -1;

function createRainbowColors(){
    var frequency = config.kolakoski.rainbowFrequency;
    var colors = [];
    var most = 2 * Math.PI / frequency;
    for (var i = 0; i < most; ++i) {
        var red   = Math.sin(frequency * i + 0) * 127 + 128;
        var green = Math.sin(frequency * i + 2) * 127 + 128;
        var blue  = Math.sin(frequency * i + 4) * 127 + 128;
        var color = {r: red << 0, g: green << 0, b: blue << 0};
        addRGBStyle(color);
        colors.push(color)
    }
    return colors;
}


function getInsertValue(){
    newValueCounter++;
    newValueCounter %= config.kolakoski.digits.length;
    return config.kolakoski.digits[newValueCounter];
}

var globalCounter = 0;
var rainbowColors = [];

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;

    fillWithSpecialStartBecauseThisSucks();
    generateSequence();
    rainbowColors = createRainbowColors();

    for(var s = 0; s < sequence.length; s++){
        renderSequence(sequence[s], sequence.length * config.kolakoski.width - s * config.kolakoski.width, config.kolakoski.width, s);
    }
});
