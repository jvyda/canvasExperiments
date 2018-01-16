var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    maZe: {
        tileSize: 20,
        safetyOffset: 1,
        colorDistance: 40000
    }
};

var states = {
    initDone: false
};

// upper left corner is startpoint
var leftTile = function (startPoint, ctx) {
    ctx.beginPath();
    var leftLower = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.moveTo(leftLower.x, leftLower.y);
    var leftUpper = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y};
    ctx.lineTo(leftUpper.x, leftUpper.y);

    var rightLower = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize};
    ctx.moveTo(rightLower.x, rightLower.y);
    var rightUpper = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightUpper.x, rightUpper.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // left top
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2}); // center
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom right
    return paintablePoints;
};

var rightTile = function (startPoint, ctx) {
    ctx.beginPath();
    var leftLower = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.moveTo(leftLower.x, leftLower.y);
    var rightLower = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(rightLower.x, rightLower.y);

    var leftUpper = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y};
    ctx.moveTo(leftUpper.x, leftUpper.y);
    var rightUpper = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightUpper.x, rightUpper.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top right
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2}); // center
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom left

    return paintablePoints;
};

var leftTileCircle = function (startPoint, ctx) {
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, config.maZe.tileSize / 2, 2 * Math.PI * 0.5, 0, 2 * Math.PI * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(startPoint.x + config.maZe.tileSize, startPoint.y + config.maZe.tileSize, config.maZe.tileSize / 2, 2 * Math.PI * 0.5, 2 * Math.PI * 0.75);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2}); // center
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom right
    return paintablePoints;
};

var rightTileCircle = function (startPoint, ctx) {
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y + config.maZe.tileSize, config.maZe.tileSize / 2, 2 * Math.PI * 0.75, 0, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(startPoint.x + config.maZe.tileSize, startPoint.y, config.maZe.tileSize / 2, 2 * Math.PI * 0.25, 2 * Math.PI * 0.5);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2}); // center
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top right
    return paintablePoints;
};

var boxTile = function (startPoint, ctx) {
    ctx.beginPath();
    var leftUpper = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y};
    ctx.moveTo(leftUpper.x, leftUpper.y);
    var leftLower = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(leftLower.x, leftLower.y);
    ctx.stroke();

    ctx.beginPath();
    var leftCenter = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.moveTo(leftCenter.x, leftCenter.y);
    var rightLower = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightLower.x, rightLower.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top right
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom right
    return paintablePoints;
};

var upSideSplitX = function (startPoint, ctx) {
    ctx.beginPath();
    var leftUpper = {x: startPoint.x, y: startPoint.y};
    ctx.moveTo(leftUpper.x, leftUpper.y);
    var leftMiddle = {x: startPoint.x + config.maZe.tileSize * 0.25, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(leftMiddle.x, leftMiddle.y);
    var leftLower = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(leftLower.x, leftLower.y);
    ctx.stroke();

    ctx.beginPath();
    var rightUpper = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.moveTo(rightUpper.x, rightUpper.y);
    var rightMiddle = {x: startPoint.x + config.maZe.tileSize * 0.75, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightMiddle.x, rightMiddle.y);
    var rightLower = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(rightLower.x, rightLower.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2});
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2});
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2});
    return paintablePoints;
};

var upSideSplitXL = function (startPoint, ctx) {
    ctx.beginPath();
    var leftUpper = {x: startPoint.x, y: startPoint.y};
    ctx.moveTo(leftUpper.x, leftUpper.y);
    var leftMiddle = {x: startPoint.x + config.maZe.tileSize * 0.25, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(leftMiddle.x, leftMiddle.y);
    var leftLower = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(leftLower.x, leftLower.y);
    ctx.stroke();


    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2});
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2});
    return paintablePoints;
};

var upSideSplitXR = function (startPoint, ctx) {
    ctx.beginPath();
    var rightUpper = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.moveTo(rightUpper.x, rightUpper.y);
    var rightMiddle = {x: startPoint.x + config.maZe.tileSize * 0.75, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightMiddle.x, rightMiddle.y);
    var rightLower = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(rightLower.x, rightLower.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2});
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2});
    return paintablePoints;
};


var lyingSplitX = function (startPoint, ctx) {
    ctx.beginPath();
    var upperLeft = {x: startPoint.x, y: startPoint.y};
    ctx.moveTo(upperLeft.x, upperLeft.y);
    var upperMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize * 0.25};
    ctx.lineTo(upperMiddle.x, upperMiddle.y);
    var upperRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.lineTo(upperRight.x, upperRight.y);
    ctx.stroke();

    ctx.beginPath();
    var lowerLeft = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.moveTo(lowerLeft.x, lowerLeft.y);
    var lowerMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize * 0.75};
    ctx.lineTo(lowerMiddle.x, lowerMiddle.y);
    var lowerRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(lowerRight.x, lowerRight.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.safetyOffset});
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2});
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset});
    return paintablePoints;
};

var leftToRightUpwards = function(startPoint, ctx){
    ctx.beginPath();
    var leftBottom = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.moveTo(leftBottom.x, leftBottom.y);
    var topRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.lineTo(topRight.x, topRight.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2 - config.maZe.safetyOffset}); // right center
    return paintablePoints;
};

var leftToRightDownwards = function(startPoint, ctx){
    ctx.beginPath();
    var leftBottom = {x: startPoint.x, y: startPoint.y};
    ctx.moveTo(leftBottom.x, leftBottom.y);
    var topRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(topRight.x, topRight.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2 - config.maZe.safetyOffset}); // left middle
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // top right
    return paintablePoints;
};

var fullX = function(startPoint, ctx){
    ctx.beginPath();
    var leftUpper = {x: startPoint.x, y: startPoint.y};
    ctx.moveTo(leftUpper.x, leftUpper.y);
    var leftMiddle = {x: startPoint.x + config.maZe.tileSize * 0.5, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(leftMiddle.x, leftMiddle.y);
    var leftLower = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(leftLower.x, leftLower.y);
    ctx.stroke();

    ctx.beginPath();
    var rightUpper = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.moveTo(rightUpper.x, rightUpper.y);
    var rightMiddle = {x: startPoint.x + config.maZe.tileSize * 0.5, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightMiddle.x, rightMiddle.y);
    var rightLower = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(rightLower.x, rightLower.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.safetyOffset}); // top middle
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2 - config.maZe.safetyOffset}); // center left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2 - config.maZe.safetyOffset}); // center right
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2 - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom middle

    return paintablePoints;
};

var normalY = function(startPoint, ctx){
    ctx.beginPath();
    var upperLeft = {x: startPoint.x, y: startPoint.y};
    ctx.moveTo(upperLeft.x, upperLeft.y);
    var upperMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(upperMiddle.x, upperMiddle.y);
    var upperRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.lineTo(upperRight.x, upperRight.y);

    ctx.moveTo(upperMiddle.x, upperMiddle.y);
    var bottomMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(bottomMiddle.x, bottomMiddle.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.safetyOffset}); // top middle
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2}); // center left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2}); // center right
    return paintablePoints;
};


var upsideY = function(startPoint, ctx){
    ctx.beginPath();
    var bottomLeft = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.moveTo(bottomLeft.x, bottomLeft.y);
    var bottomMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(bottomMiddle.x, bottomMiddle.y);
    var bottomRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.lineTo(bottomRight.x, bottomRight.y);

    ctx.moveTo(bottomMiddle.x, bottomMiddle.y);
    var upperMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y};
    ctx.lineTo(upperMiddle.x, upperMiddle.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom middle
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2}); // center left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2}); // center right
    return paintablePoints;
};

var rightY = function(startPoint, ctx){
    ctx.beginPath();
    var bottomLeft = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize};
    ctx.moveTo(bottomLeft.x, bottomLeft.y);
    var bottomMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(bottomMiddle.x, bottomMiddle.y);
    var upperLeft = {x: startPoint.x, y: startPoint.y};
    ctx.lineTo(upperLeft.x, upperLeft.y);

    ctx.moveTo(bottomMiddle.x, bottomMiddle.y);
    var rightMiddle = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(rightMiddle.x, rightMiddle.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2 + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2 + config.maZe.safetyOffset}); // center
    paintablePoints.push({x: startPoint.x + config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2 - config.maZe.safetyOffset}); // center left
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2 + config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // upper middle
    return paintablePoints;
};

var leftY = function(startPoint, ctx){
    ctx.beginPath();
    var bottomRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y + config.maZe.tileSize};
    ctx.moveTo(bottomRight.x, bottomRight.y);
    var bottomMiddle = {x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(bottomMiddle.x, bottomMiddle.y);
    var upperRight = {x: startPoint.x + config.maZe.tileSize, y: startPoint.y};
    ctx.lineTo(upperRight.x, upperRight.y);

    ctx.moveTo(bottomMiddle.x, bottomMiddle.y);
    var leftMiddle = {x: startPoint.x, y: startPoint.y + config.maZe.tileSize / 2};
    ctx.lineTo(leftMiddle.x, leftMiddle.y);
    ctx.stroke();

    var paintablePoints = [];
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2, y: startPoint.y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom middle
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize - config.maZe.safetyOffset, y: startPoint.y + config.maZe.tileSize / 2}); // center right
    paintablePoints.push({x: startPoint.x + config.maZe.tileSize / 2 + config.maZe.safetyOffset, y: startPoint.y + config.maZe.safetyOffset}); // upper middle
    return paintablePoints;
};

function setupWithThisTiles(tiles) {
    ctx.clearRect(0, 0, config.size.height, config.size.width);
    //randomElement(tiles)({x: 0, y: 0}, ctx);
    //return;
    var tileCoordinates = [];
    for (var x = 0; x < config.size.width; x += config.maZe.tileSize) {
        for (var y = 0; y < config.size.height; y += config.maZe.tileSize) {
           tileCoordinates.push({x: x, y: y});
        }
    }
    drawTile(tileCoordinates, tiles, []);
}

function drawTile(tileCoordinatesLeft, tiles, probablePoints){
    for(var i = 0; i < 10 && tileCoordinatesLeft.length > 0; i++){
        var coordinateToDraw = spliceRandomElement(tileCoordinatesLeft);
        var interestingPoints = randomElement(tiles)({x: coordinateToDraw.x, y: coordinateToDraw.y}, ctx);
        probablePoints = probablePoints.concat(interestingPoints);
    }
    if(tileCoordinatesLeft.length === 0){
        probablePoints = probablePoints.map(function(point){
            point.x = Math.min(point.x, config.size.width - 1);
            point.y = Math.min(point.y, config.size.height - 1);
            return point;
        });
        states.initDone = true;
        fillPointsWithColorWithTimeout(probablePoints)
    } else {
        requestAnimationFrame(function () {
            drawTile(tileCoordinatesLeft, tiles, probablePoints);
        });
    }
}

function checkBoundsAndAdd(list, point){
    if(point.x < config.size.width && point.x > 0 && point.y < config.size.height && point.y > 0){
        list.push(point)
    }
}


// results in 101 different colors
var rainbow = createRainbowColors(1/16);
// max distance from top left corner
var max = Math.sqrt(Math.pow(config.size.width + config.maZe.tileSize, 2) + Math.pow(config.size.height + config.maZe.tileSize, 2));
var startOffset = (rainbow.length * Math.random()) << 0;

function fillForPoint(pointToDo) {
    var imageData = ctx.getImageData(pointToDo.x, pointToDo.y, 1, 1).data;
    // if it is white (just checked for red color channel) we need to paint it
    if (imageData[0] === 0) {
        var distance = Math.sqrt(pointToDo.x * pointToDo.x + pointToDo.y * pointToDo.y);
        var index = ((startOffset + distance / max * 100) << 0) % rainbow.length;
        var color = rainbow[index];
        color.a = 255;
        floodfill(pointToDo.x, pointToDo.y, color, ctx, config.size.width, config.size.height, config.maZe.colorDistance);
    }
}

function fillPointsWithColorWithTimeout(points) {
    // random
    var pointToDo = spliceRandomElement(points);
    // left
   // var pointToDo = points.splice(0, 1)[0];
    // right
   // var pointToDo = points.splice(points.length - 1, 1)[0];
    fillForPoint(pointToDo);

    if (points.length > 0) {
        requestAnimationFrame(function () {
            fillPointsWithColorWithTimeout(points);
        });
    }
}


function mouseClick(event){
    if(!states.initDone){
        return;
    }
    var mousePos = getMousePos(canvas, event);
    var data = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    // only for black space, which has alpha = 0
    if(data[3] === 0) {
        fillForPoint(mousePos);
    }
}


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;

    canvas.addEventListener("mousedown", mouseClick, false);

    canvas.height = config.size.height;

    var tileGroups = [
        [leftTileCircle, rightTileCircle],
        [leftTile, rightTile],
        [upSideSplitX, lyingSplitX],
        [leftToRightDownwards, leftToRightUpwards, fullX, normalY, upsideY, leftY, rightY]
    ];

    setupWithThisTiles(randomElement(tileGroups));
});


