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
        sequences: 15,
        sequenceLength: 15,
        digits: [1,2]
    }
};

var sequence = [];
sequence.push([1, 2, 2]);

function generateSequence(){
    var seq = sequence[0];
    var cnt = 0;
    for(var i = 2; cnt < config.kolakoski.sequenceLength; i++, cnt++){
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
    console.log(JSON.stringify(newSequence))
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

function renderSequence(sequence, radius, width){
    var totalArc = 2 * Math.PI * 0.75;
    var arcPerDigit = totalArc / (getSum(sequence));

    var startArc = - 2 * Math.PI * 0.66;
    for(var i = 0; i < sequence.length; i++){
        ctx.beginPath();
        ctx.strokeStyle = color[sequence[i]];
        ctx.arc(config.kolakoski.center.x, config.kolakoski.center.y, radius, startArc, startArc + arcPerDigit * sequence[i]);
        ctx.lineWidth = width;
        ctx.lineCap = 'butt';
        startArc += arcPerDigit * sequence[i];
        ctx.stroke();
    }
}

var color = ['', 'red', 'green', 'yellow', 'blue', 'orange', 'black', 'brown'];

function getSum(sequence){
    var sum = 0;
    sequence.forEach(function(element){
        sum += element;
    });
    return sum;
}


function generateBasedOnSequence(part, existing){
    var newly = [];
    part.forEach(function(digit){
        var newValue = getInsertValue();
        for(var i = 0; i < digit; i++){
            newly.push(newValue)
        }
    });

    return newly;
}

var newValueCounter = -1;

function getInsertValue(){
    newValueCounter++;
    newValueCounter %= config.kolakoski.digits.length;
    return config.kolakoski.digits[newValueCounter];
}

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    generateSequence();
    console.log(sequence[0])

    for(var s = 0; s < sequence.length; s++){
        renderSequence(sequence[s], sequence.length * config.kolakoski.width - s * config.kolakoski.width, config.kolakoski.width);
    }
});
