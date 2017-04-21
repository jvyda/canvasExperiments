var ctx = {};
var canvas = {};

var used = {};
var colors = [];
var collatzTree;

var $heightChange;
var $size;
var $spread;
var heightValue;
var spreadValue;
var firstValue;
var secondValue;

var config = {
    size: {
        size: 1500
    },
    conjectureConfig: {
        firstNumber: 2,
        secondNumber: 3,
        maxDepth: 25,
        heightChange: 25,
        dirChange: 10
    }
};


function buildStructure(input, depth) {
    if (depth > config.conjectureConfig.maxDepth) return undefined;
    if (input in used) {
        return undefined
    }
    depth++;
    used[input] = 1;
    var element = {};
    element.num = input;
    var child1 = buildStructure(input * config.conjectureConfig.firstNumber, depth);
    var child2 = undefined;
    var inputSmaller = input - 1;
    var probableNumber = (inputSmaller) / config.conjectureConfig.secondNumber;
    if ((inputSmaller) % config.conjectureConfig.secondNumber == 0 && (probableNumber % config.conjectureConfig.firstNumber != 0)) {
        child2 = buildStructure(probableNumber, depth);
    }
    element.child1 = child1;
    element.child2 = child2;
    return element;
}

function setNewHeightChange(newValue) {
    config.conjectureConfig.heightChange = parseInt(newValue);
    heightValue.text(config.conjectureConfig.heightChange);
    updateCanvas();
}

function setNewSpread(newValue) {
    config.conjectureConfig.dirChange = parseInt(newValue);
    spreadValue.text(config.conjectureConfig.dirChange);
    updateCanvas();
}

function toRad(angle) {
    return angle / 180 * Math.PI;
}

function drawElement(element, dir, parentPos, depth) {
    ctx.beginPath();

    ctx.moveTo(parentPos.x, parentPos.y);
    ctx.strokeStyle = colors[depth];
    //ctx.fillText((depth % colors.length) + ' ', parentPos.x + config.heightChange * Math.cos(toRad(dir)), parentPos.y + config.heightChange * Math.sin(toRad(dir)));
    ctx.lineTo(parentPos.x + config.conjectureConfig.heightChange * Math.cos(toRad(dir)), parentPos.y + config.conjectureConfig.heightChange * Math.sin(toRad(dir)));
    ctx.stroke();
    // experiment to use two parallel lines represented in the video, doesn't work that well, because the line can cross the other line and then... stuff happens
    // also lines overlay each other
    //ctx.strokeStyle = colors[depth + 1];
    //ctx.moveTo(parentPos.x - Math.cos(toRad(90 - dir)) * config.width / 2, parentPos.y - Math.sin(toRad(90 - dir)) * config.width / 2);
    //ctx.lineTo(parentPos.x + config.heightChange * Math.cos(toRad(dir))  - Math.cos(toRad(90 - dir)) * config.width / 2,
    //    parentPos.y + config.heightChange * Math.sin(toRad(dir)) - Math.sin(toRad(90 - dir)) * config.width / 2);
    //
    //ctx.moveTo(parentPos.x + Math.cos(toRad(90 - dir)) * config.width / 2, parentPos.y + Math.sin(toRad(90 - dir)) * config.width / 2);
    //ctx.lineTo(parentPos.x + config.heightChange * Math.cos(toRad(dir)) + Math.cos(toRad(90 - dir)) * config.width / 2,
    //    parentPos.y + config.heightChange * Math.sin(toRad(dir)) + Math.sin(toRad(90 - dir)) * config.width / 2);
    //ctx.stroke();
    var newParentPos = {
        x: parentPos.x + config.conjectureConfig.heightChange * Math.cos(toRad(dir)),
        y: parentPos.y + config.conjectureConfig.heightChange * Math.sin(toRad(dir))
    };
    depth++;
    if (element.child1 != undefined) {
        drawElement(element.child1, dir + config.conjectureConfig.dirChange, newParentPos, depth);
        ctx.moveTo(parentPos.x, parentPos.y);
    } else {
        ctx.stroke();
    }
    if (element.child2 != undefined) {
        drawElement(element.child2, dir - config.conjectureConfig.dirChange, newParentPos, depth);
        ctx.moveTo(parentPos.x, parentPos.y);
    } else {
        ctx.stroke();
    }
}

function generateColors() {
    colors = [];
    for (var i = 0; i < config.conjectureConfig.maxDepth; i++) {
        var red = ~~(Math.random() * 255);
        var green = ~~(Math.random() * 255);
        var blue = ~~(Math.random() * 255);
        colors.push('#' + (red).toString(16) + (green).toString(16) + (blue).toString(16));
    }
}

function updateCanvasConfig(newValue) {
    config.size.size = parseInt(newValue);
    initCanvas();
    updateCanvas();
}

function updateCanvas() {
    ctx.clearRect(0, 0, config.size.size, config.size.size);
    drawElement(collatzTree, -180, config.size, 0);
}

function initStructure() {
    used = {};
    collatzTree = buildStructure(1, 0);
    updateCanvas();
}
function setNewFirstNumber(newVal) {
    config.conjectureConfig.firstNumber = parseInt(newVal);
    firstValue.text(config.conjectureConfig.firstNumber);
    initStructure();
}

function setNewSecondNumber(newVal) {
    config.conjectureConfig.secondNumber = parseInt(newVal);
    firstValue.text(config.conjectureConfig.secondNumber);
    initStructure();
}

function initCanvas() {
    ctx = canvas.getContext("2d");
    canvas.height = config.size.size;
    canvas.width = config.size.size;
    config.size.x = config.size.size / 2;
    config.size.y = config.size.size / 2;
}
$(document).ready(function () {
    canvas = $("#canvas")[0];
    initCanvas();

    ctx.font = "6px Verdana";
    ctx.lineWidth = 1;
    $size = $('#size');
    $heightChange = $('#heightChange');
    $spread = $('#spread');

    heightValue = $('#heightValue');
    heightValue.text(config.conjectureConfig.heightChange);
    spreadValue = $('#spreadValue');
    spreadValue.text(config.conjectureConfig.dirChange);
    firstValue = $('#firstValue');
    firstValue.text(config.conjectureConfig.firstNumber);
    secondValue = $('#secondValue');
    secondValue.text(config.conjectureConfig.secondNumber);

    $('#size').val(config.size.size);
    $spread.val(config.conjectureConfig.dirChange);
    $heightChange.val(config.conjectureConfig.heightChange);
    generateColors();
    initStructure();
});


