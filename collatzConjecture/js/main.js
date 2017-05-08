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

var startCol = {r: 0, g: 0, b: 0};
var finalCol = {r: 0, g: 0, b: 0};
var colorPoints = [];

function setToPinkishColors() {
    colorPoints.push({r: 38, g: 17, b: 43});
    colorPoints.push({r: 86, g: 37, b: 81});
    colorPoints.push({r: 132, g: 60, b: 107});
    colorPoints.push({r: 171, g: 88, b: 126});
    colorPoints.push({r: 202, g: 122, b: 142});
    colorPoints.push({r: 224, g: 159, b: 161});
    colorPoints.push({r: 238, g: 198, b: 189});
    colorPoints.push({r: 249, g: 237, b: 229});
    finalCol = colorPoints[colorPoints.length - 1];
}


var config = {
    size: {
        size: 1500
    },
    conjectureConfig: {
        firstNumber: 2,
        secondNumber: 3,
        maxDepth: 30,
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

// TODO fix with different amount of colors
function drawElement(input, dir, parentPos, depth) {
    if (depth >= config.conjectureConfig.maxDepth || input in used) return;
    //console.log('__________________')
    ctx.beginPath();
    ctx.moveTo(parentPos.x, parentPos.y);
    var numberOfStepsEachColor = Math.round(config.conjectureConfig.maxDepth / colorPoints.length);
    // often... this returns a higher color, but the ratio is still in above 0.5, so the color changes drastically
    var whereToMoveColorWise = (~~((depth) / config.conjectureConfig.maxDepth * 0.995 * colorPoints.length) + 1);
    var ratio = (depth % (numberOfStepsEachColor)) / ((numberOfStepsEachColor));
    // sometimes a color to high is chosen with a high ratio, this causes the color change to be wrong (and very drastic)
    // we need to go a step back
    if (ratio >= 1) {
        whereToMoveColorWise--;
    }
    else if (ratio > 0.5) {
        whereToMoveColorWise = (~~((depth - 1) / config.conjectureConfig.maxDepth * 0.995 * colorPoints.length) + 1);
    }

    var targetColor = colorPoints[whereToMoveColorWise];
    if (whereToMoveColorWise == colorPoints.length) {
        targetColor = finalCol;
    }
    var whereWeComeColorWise = whereToMoveColorWise - 1;
    //console.log(whereWeComeColorWise + '_' + whereToMoveColorWise)
    //console.log(depth + '_' + numberOfStepsEachColor)
    //console.log(ratio + '_' + depth / config.conjectureConfig.maxDepth)

    var baseColor = colorPoints[whereWeComeColorWise];
    var newColor = {
        r: targetColor.r * ratio + baseColor.r * (1 - ratio),
        g: targetColor.g * ratio + baseColor.g * (1 - ratio),
        b: targetColor.b * ratio + baseColor.b * (1 - ratio)
    };
    ctx.strokeStyle = '#' + d2h(~~newColor.r) + d2h(~~newColor.g) + d2h(~~newColor.b);
    var newXOffset = config.conjectureConfig.heightChange * Math.cos(toRad(dir));
    //console.log(ctx.strokeStyle)
    //console.log(newColor)
    //console.log(baseColor)
    //console.log(targetColor)
    var newYOffset = config.conjectureConfig.heightChange * Math.sin(toRad(dir));
    //ctx.fillText((ctx.strokeStyle) + ' ', parentPos.x, parentPos.y);
    ctx.lineTo(parentPos.x + newXOffset, parentPos.y + newYOffset);
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
        x: parentPos.x + newXOffset,
        y: parentPos.y + newYOffset
    };
    depth++;
    used[input] = 1;
    drawElement(input * config.conjectureConfig.firstNumber, dir + config.conjectureConfig.dirChange, newParentPos, depth);
    var inputSmaller = input - 1;
    var probableNumber = (inputSmaller) / config.conjectureConfig.secondNumber;
    if ((inputSmaller) % config.conjectureConfig.secondNumber == 0 && (probableNumber % config.conjectureConfig.firstNumber != 0)) {
        drawElement(probableNumber, dir - config.conjectureConfig.dirChange, newParentPos, depth);
    }
    else {
        ctx.stroke();
    }
}

function generateColors() {
    colors = [];
    colorPoints = [];
    colorPoints.push(startCol);
    var maxInc = (255 / config.conjectureConfig.maxDepth);
    for (var i = 0; i < 3; i++) {
        var red = ~~(Math.random() * 255);
        var green = ~~(Math.random() * 255);
        var blue = ~~(Math.random() * 255);
        //colors.push('#' + (red).toString(16) + (green).toString(16) + (blue).toString(16));
        colorPoints.push({r: red, g: green, b: blue});
    }
}

function updateCanvasConfig(newValue) {
    config.size.size = parseInt(newValue);
    initCanvas();
    updateCanvas();
}

function updateCanvas() {
    used = {};
    ctx.clearRect(0, 0, config.size.size, config.size.size);
    drawElement(1, -180, config.size, 0);
}

function setNewFirstNumber(newVal) {
    config.conjectureConfig.firstNumber = parseInt(newVal);
    firstValue.text(config.conjectureConfig.firstNumber);
    updateCanvas();
}

function setNewSecondNumber(newVal) {
    config.conjectureConfig.secondNumber = parseInt(newVal);
    secondValue.text(config.conjectureConfig.secondNumber);
    updateCanvas();
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

    ctx.font = "8px Verdana";
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
    setToPinkishColors();
    //generateColors();
    drawElement(1, -180, config.size, 0);
    //initStructure();
});


