var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    maZe: {
        tileSize: 40
    }
};

// upper left corder is startpoint
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

var tiles = [[leftTileCircle, rightTileCircle], [leftTile, rightTile]];

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;


    canvas.height = config.size.height;
    setupWithThisTiles(randomElement(tiles));
});

function setupWithThisTiles(tiles){
    ctx.clearRect(0, 0, config.size.height, config.size.width);
    for (var x = 0; x < config.size.width; x += config.maZe.tileSize) {
        for (var y = 0; y < config.size.height; y += config.maZe.tileSize) {
            randomElement(tiles)({x: x, y: y}, ctx);
        }
    }
    var probablePoints = [];
    for (var x = 0; x < config.size.width; x += config.maZe.tileSize) {
        for (var y = 0; y < config.size.height; y += config.maZe.tileSize) {
            probablePoints.push({x: x, y:y}); // top left
            probablePoints.push({x: x + config.maZe.tileSize - 1, y:y + config.maZe.tileSize - 1}); // bottom right
            probablePoints.push({x: x + config.maZe.tileSize - 1, y:y}); // top right
            probablePoints.push({x: x, y:y + config.maZe.tileSize - 1}); // bottom left

            probablePoints.push({x: x + config.maZe.tileSize / 2 - 5, y:y + config.maZe.tileSize / 2 + 5}); // center

            probablePoints.push({x: x + config.maZe.tileSize / 2 + 5, y:y + 5}); // top middle
            probablePoints.push({x: x + config.maZe.tileSize - 5, y:y + config.maZe.tileSize / 2 + 5}); // right middle
            probablePoints.push({x: x + 5, y:y + config.maZe.tileSize / 2 + 5}); // left middle
            probablePoints.push({x: x + config.maZe.tileSize / 2 - 5, y:y + config.maZe.tileSize - 5}); // bottom middle
        }
    }

    fillPointsWithColorWithTimeout(probablePoints)
}


var rainbow = createRainbowColors(1/16);
var max = Math.sqrt(config.size.width * config.size.width + config.size.height * config.size.height);
function fillPointsWithColorWithTimeout(points){
    var pointToDo = spliceRandomElement(points);
    var imageData = ctx.getImageData(pointToDo.x, pointToDo.y, 1, 1).data;
    if (imageData[0] == 0) {
        var index = Math.sqrt(pointToDo.x * pointToDo.x + pointToDo.y * pointToDo.y);
        var color = rainbow[(index / max * 100) << 0];
        color.a = 255;
        floodfill(pointToDo.x, pointToDo.y, color, ctx, config.size.width, config.size.height, -1);
    }

    if(points.length > 0){
        requestAnimationFrame(function(){
            fillPointsWithColorWithTimeout(points)
        });
    }
}


// taken from here https://gist.github.com/binarymax/4071852
function floodfill(x, y, fillcolor, ctx, width, height, tolerance) {
    var img = ctx.getImageData(0, 0, width, height);
    var data = img.data;
    var length = data.length;
    var Q = [];
    var currentIndex = (x + y * width) * 4;
    var rightColorBorder = currentIndex, leftColorBorder = currentIndex, currentRowRightBorder, currentRowLeftBorder, rowWidth = width * 4;
    var targetcolor = [data[currentIndex], data[currentIndex + 1], data[currentIndex + 2], data[currentIndex + 3]];

    if (!pixelCompare(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
        return false;
    }
    Q.push(currentIndex);
    while (Q.length) {
        currentIndex = Q.pop();
        if (pixelCompareAndSet(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
            rightColorBorder = currentIndex;
            leftColorBorder = currentIndex;
            currentRowLeftBorder = ((currentIndex / rowWidth)<<0)  * rowWidth; //left bound
            currentRowRightBorder = currentRowLeftBorder + rowWidth;	//right bound
            while (currentRowLeftBorder < (leftColorBorder -= 4) && pixelCompareAndSet(leftColorBorder, targetcolor, fillcolor, data, length, tolerance)) ; //go left until edge hit
            while (currentRowRightBorder > (rightColorBorder += 4) && pixelCompareAndSet(rightColorBorder, targetcolor, fillcolor, data, length, tolerance)) ; //go right until edge hit
            for (var currentCell = leftColorBorder + 4; currentCell < rightColorBorder; currentCell += 4) {
                if (currentCell - rowWidth >= 0 && pixelCompare(currentCell - rowWidth, targetcolor, fillcolor, data, length, tolerance)) Q.push(currentCell - rowWidth); //queue y-1
                if (currentCell + rowWidth < length && pixelCompare(currentCell + rowWidth, targetcolor, fillcolor, data, length, tolerance)) Q.push(currentCell + rowWidth); //queue y+1
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}

function pixelCompare(i, targetcolor, fillcolor, data, length, tolerance) {
    if (i < 0 || i >= length) return false; //out of bounds
    if (data[i + 3] === 0) return true;  //surface is invisible

    if (
        (targetcolor[3] === fillcolor.a) &&
        (targetcolor[0] === fillcolor.r) &&
        (targetcolor[1] === fillcolor.g) &&
        (targetcolor[2] === fillcolor.b)
    ) return false; //target is same as fill

    if (
        (targetcolor[3] === data[i + 3]) &&
        (targetcolor[0] === data[i]) &&
        (targetcolor[1] === data[i + 1]) &&
        (targetcolor[2] === data[i + 2])
    ) return true; //target matches surface

    if (
        Math.abs(targetcolor[3] - data[i + 3]) <= (255 - tolerance) &&
        Math.abs(targetcolor[0] - data[i]) <= tolerance &&
        Math.abs(targetcolor[1] - data[i + 1]) <= tolerance &&
        Math.abs(targetcolor[2] - data[i + 2]) <= tolerance
    ) return true; //target to surface within tolerance

    return false; //no match
}

function pixelCompareAndSet(i, targetcolor, fillcolor, data, length, tolerance) {
    if (pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
        //fill the color
        data[i] = fillcolor.r;
        data[i + 1] = fillcolor.g;
        data[i + 2] = fillcolor.b;
        data[i + 3] = fillcolor.a;
        return true;
    }
    return false;
}

