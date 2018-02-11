var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    bubbles: {
        tileSize: 100,
        growFactorDivider: 5,
        radiusFactor: 1,
        bubbleChance: 0.5
    }
};

var rainbow = createRainbowColors(1/16);
// max distance from top left corner
var max = Math.sqrt(Math.pow(config.size.width + config.bubbles.tileSize, 2) + Math.pow(config.size.height + config.bubbles.tileSize, 2));
var startOffset = (rainbow.length * Math.random()) << 0;

function getRandomPoint(x, y) {
    var distance = Math.sqrt(x * x + y * y);
    var index = ((startOffset + distance / max * 100) << 0) % rainbow.length;
    var color = rainbow[index];
    color.a = 255;
    return {
        x: x + Math.random() * config.bubbles.tileSize,
        y: y + Math.random() * config.bubbles.tileSize,
        factor: Math.random() / config.bubbles.growFactorDivider,
        radius: Math.random() * config.bubbles.radiusFactor,
        color: color
    };
}

function getTilePoints(){
    var points = [];
    for(var x = 0; x < config.size.width; x += config.bubbles.tileSize){
        for(var y = 0; y < config.size.height; y += config.bubbles.tileSize){
            points.push(getRandomPoint(x, y));
        }
    }
    return points;
}

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;

    var pointsOfInterest = getTilePoints();
    removeIntersecting(pointsOfInterest);
    updateCanvas(pointsOfInterest);
});

function grow(points){
    for(var i = 0; i < points.length; i++){
        var currentPoint = points[i];
        if(!intersectsAnotherPoint(currentPoint, points)){
            currentPoint.radius += currentPoint.factor;
        } else if(!currentPoint.spawnedAnother){
            currentPoint.spawnedAnother = true;
            currentPoint.radius += currentPoint.factor;
            addAnotherRandomPoint(points);
        }
    }

    if(Math.random() < config.bubbles.bubbleChance){
        addAnotherRandomPoint(points);
    }
}

function addAnotherRandomPoint(points){
    var probablePoint = getRandomPoint(randomInteger(config.size.width), randomInteger(config.size.height));
    if(!intersectsAnotherPoint(probablePoint, points)){
        points.push(probablePoint);
    }
}

function intersectsAnotherPoint(point, points){
    var intersects = false;
    points.forEach(function(pointToLookAt){
        if(intersects) return;
        var pointDist = pointDistance(point, pointToLookAt);
        if(pointDist > 0 && pointDist < (point.radius + pointToLookAt.radius)){
            intersects = true;
        }
    });

    return intersects;
}

function updateCanvas(points){
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    grow(points);
    paintPoints(points, function(){
        requestAnimationFrame(function(){
            updateCanvas(points);
        });
    });

}


function removeIntersecting(points){
    for(var i = 0; i < points.length; ){
        if(intersectsAnotherPoint(points[i], points)){
            points.splice(i, 1);
        } else {
            i++;
        }
    }
}


function paintPoints(points, cb){
    for(var i = 0; i < points.length; i++){
        var point = points[i];
        if(point.radius < 0) continue;
        ctx.beginPath();
        ctx.fillStyle = point.color.styleRGB;
        ctx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    cb();
}




