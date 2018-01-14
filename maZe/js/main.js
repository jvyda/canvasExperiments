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
        safetyOffset: 5,
        colorDistance: 40000
    }
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
};

var leftTileCircle = function (startPoint, ctx) {
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, config.maZe.tileSize / 2, 2 * Math.PI * 0.5, 0, 2 * Math.PI * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(startPoint.x + config.maZe.tileSize, startPoint.y + config.maZe.tileSize, config.maZe.tileSize / 2, 2 * Math.PI * 0.5, 2 * Math.PI * 0.75);
    ctx.stroke();
};

var rightTileCircle = function (startPoint, ctx) {
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y + config.maZe.tileSize, config.maZe.tileSize / 2, 2 * Math.PI * 0.75, 0, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(startPoint.x + config.maZe.tileSize, startPoint.y, config.maZe.tileSize / 2, 2 * Math.PI * 0.25, 2 * Math.PI * 0.5);
    ctx.stroke();
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
};


var tileGroups = [[leftTileCircle, rightTileCircle], [leftTile, rightTile]];

function setupWithThisTiles(tiles) {
    ctx.clearRect(0, 0, config.size.height, config.size.width);
    for (var x = 0; x < config.size.width; x += config.maZe.tileSize) {
        for (var y = 0; y < config.size.height; y += config.maZe.tileSize) {
            randomElement(tiles)({x: x, y: y}, ctx);
        }
    }
    var probablePoints = [];
    for (var x = 1; x < config.size.width; x += config.maZe.tileSize) {
        for (var y = 1; y < config.size.height; y += config.maZe.tileSize) {
            checkBoundsAndAdd(probablePoints, {x: x, y: y}); // top left
            checkBoundsAndAdd(probablePoints, {x: x + config.maZe.tileSize - config.maZe.safetyOffset, y: y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom right
            checkBoundsAndAdd(probablePoints, {x: x + config.maZe.tileSize - config.maZe.safetyOffset, y: y}); // top right
            checkBoundsAndAdd(probablePoints, {x: x, y: y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom left

            checkBoundsAndAdd(probablePoints, {x: x + config.maZe.tileSize / 2 - config.maZe.safetyOffset, y: y + config.maZe.tileSize / 2 + config.maZe.safetyOffset}); // center

            checkBoundsAndAdd(probablePoints, {x: x + config.maZe.tileSize / 2 + config.maZe.safetyOffset, y: y + config.maZe.safetyOffset}); // top middle
            checkBoundsAndAdd(probablePoints, {x: x + config.maZe.tileSize - config.maZe.safetyOffset, y: y + config.maZe.tileSize / 2 + config.maZe.safetyOffset}); // right middle
            checkBoundsAndAdd(probablePoints, {x: x + 5, y: y + config.maZe.tileSize / 2 + config.maZe.safetyOffset}); // left middle
            checkBoundsAndAdd(probablePoints, {x: x + config.maZe.tileSize / 2 - config.maZe.safetyOffset, y: y + config.maZe.tileSize - config.maZe.safetyOffset}); // bottom middle
        }
    }

    fillPointsWithColorWithTimeout(probablePoints)
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

function fillPointsWithColorWithTimeout(points) {
    // random
    var pointToDo = spliceRandomElement(points);
    // left
   // var pointToDo = points.splice(0, 1)[0];
    // right
   // var pointToDo = points.splice(points.length - 1, 1)[0];
    var imageData = ctx.getImageData(pointToDo.x, pointToDo.y, 1, 1).data;
    // if it is white (just checked for red color channel) we need to paint it
    if (imageData[0] === 0) {
        var distance = Math.sqrt(pointToDo.x * pointToDo.x + pointToDo.y * pointToDo.y);
        var index = ((startOffset + distance / max * 100) << 0) % rainbow.length;
        var color = rainbow[index];
        color.a = 255;
        floodfill(pointToDo.x, pointToDo.y, color, ctx, config.size.width, config.size.height, config.maZe.colorDistance);
    }

    if (points.length > 0) {
        requestAnimationFrame(function () {
            fillPointsWithColorWithTimeout(points)
        });
    }
}




$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;


    canvas.height = config.size.height;
    setupWithThisTiles(randomElement(tileGroups));
});


