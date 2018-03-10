var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    recBubbles: {
        maxTries: 5,
        splitMinSize: 2,
        fps: 30
    }
};


config.recBubbles.relevantSize = Math.min(config.size.width, config.size.height);
var rootCircle = {
    x: config.size.width / 2,
    y: config.size.height / 2,
    radius: config.recBubbles.relevantSize / 2,
    circles: []
};

config.recBubbles.maxRadius = rootCircle.radius;
config.recBubbles.minRadius = -1;

// results in 101 different colors
var rainbow = createRainbowColors(1/16);
// max distance from top left corner
var max = Math.sqrt(rootCircle.x * rootCircle.x + rootCircle.y * rootCircle.y) / 2;


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx.strokeStyle = rainbow[rainbow.length - 1].styleRGB;
    paintCircle(rootCircle);
    addCircleInCircle(rootCircle);
    rootCircle.circles.forEach(function(circleToPain){
       paintCircle(circleToPain);
    });
});


function addCircleInCircle(circle){
    var possFound = false;
    var newRandomPoint;
    var tries = 0;
    do {
        newRandomPoint = randomPointInCircle(circle);
        tries++;
        if (collidesWithOtherCircle(newRandomPoint, circle)) {
            console.log('not valid');
        } else {
            console.log('valid!');
            possFound = true;
        }
    } while(!possFound);
    newRandomPoint.radius =  getAvailableRadius(newRandomPoint, circle, 50000);
    if(newRandomPoint.radius > config.recBubbles.minRadius){
        newRandomPoint.circles = [];
        newRandomPoint.parent = circle;
        circle.circles.push(newRandomPoint);
        var localX = newRandomPoint.x - rootCircle.x;
        var localY = newRandomPoint.y - rootCircle.y;
        var distance = Math.sqrt(localX * localX + localY * localY);
        var index = ((distance / max * 100) << 0) % rainbow.length;
        var color = rainbow[index];
        color.a = 255;
        ctx.strokeStyle = color.styleRGB;
        paintCircle(newRandomPoint);
    }
    if(tries < config.recBubbles.maxTries){
        setTimeout(function () {
            requestAnimationFrame(function(){
                addCircleInCircle(circle)
            });
        }, 1000 / config.recBubbles.fps)
    } else {
        setTimeout(function () {
            requestAnimationFrame(function(){
                var filledCircle = false;
                for(var i = 0; i < circle.circles.length; i++){
                    if(circle.circles[i].circles.length === 0 && circle.circles[i].radius > config.recBubbles.splitMinSize){
                        addCircleInCircle(circle.circles[i]);
                        filledCircle = true;
                        break;
                    }
                }
                if(!filledCircle && circle.parent){
                    addCircleInCircle(circle.parent);
                }
            });
        }, 1000 / config.recBubbles.fps)
    }
}

function getAvailableRadius(point, circle, currentMax){
    var distanceToPoint = pointDistance(point, circle);
    var distance = circle.radius - distanceToPoint;
    if(distance < 0){
        distance = distanceToPoint - circle.radius;
    }
    if(distance < currentMax && distance > 0){
        currentMax = Math.min(distance, config.recBubbles.maxRadius);
    }
    for(var i = 0; i < circle.circles.length; i++){
        currentMax = getAvailableRadius(point, circle.circles[i], currentMax);
    }
    return currentMax;
}

function collidesWithOtherCircle(point, superCircle){
    for(var superCircleIndex = 0; superCircleIndex < superCircle.circles.length; superCircleIndex++){
        if(isInCircle(point, superCircle.circles[superCircleIndex])){
            return true;
        }
    }
    return false;
}

function isInCircle(point, circle){
    return pointDistance(point, circle) < circle.radius;
}

function randomPointInCircle(circle){
    var randomDistance = Math.random() * circle.radius;
    var randomArc = 2 * Math.PI * Math.random();
    return {
        x: circle.x + Math.cos(randomArc) * randomDistance,
        y: circle.y + Math.sin(randomArc) * randomDistance
    };
}

function paintCircle(circle){
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
}

