var ctx = {};
var canvas = {};

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    triangles: {
        maxSideLength: 25,
        minSideLength: 5,
        fps: 50,
        paused: false,
        maxDistance: window.innerWidth / 3,
        deltaX: 1,
        deltaY: 1,
        spawnDist: 10
    }
};

var triangles = [];

var colors = [
    {r: 0xb0, g: 0x56, b: 0x3f},
    {r: 0xb5, g: 0x7a, b: 0x3f},
    {r: 0xba, g: 0xa2, b: 0x3f},
    {r: 0xb2, g: 0xbf, b: 0x3f},
    {r: 0x8e, g: 0xc2, b: 0x41}
];


var base = {
    x: config.size.width / 2, y: config.size.height / 2
};

function generateTriangle() {
    var obj = {};
    obj.points = [];
    var pointA = {
        x: base.x + randomNumber(config.triangles.spawnDist),
        y: base.y + randomNumber(config.triangles.spawnDist)
    };
    var random = function () {
        return randomNumberButAtLeast(config.triangles.maxSideLength, config.triangles.minSideLength);
    };

    var newYOffset = random() * Math.sin(toRad(90));
    var newXOffset = random() * Math.cos(toRad(90));

    var pointB = {
        x: base.x + newYOffset,
        y: base.y + newXOffset
    };

    newYOffset = random() * Math.sin(toRad(180));
    newXOffset = random() * Math.cos(toRad(180));

    var pointC = {
        x: base.x + newYOffset,
        y: base.y + newXOffset
    };

    obj.points.push(pointA);
    obj.points.push(pointB);
    obj.points.push(pointC);
    obj.vect = createNormalizedVector(pointA, base);
    obj.col = colors[roundedRandom(colors.length)];
    obj.origin = {
        x: base.x,
        y: base.y
    };
    return obj;
}


function drawTriangle(obj) {
    obj.dist = pointDistance(obj.points[0], obj.origin);
    if (obj.dist > config.triangles.maxDistance) return false;
    var alpha = 1 - (obj.dist / config.triangles.maxDistance);
    ctx.beginPath();
    ctx.fillStyle = obj.col.style.replace('%alpha', alpha);
    ctx.moveTo(obj.points[0].x, obj.points[0].y);
    obj.points.forEach(function (point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.fill();
    return true;
}

function act(obj) {
    var percentageTraveled = 1 - obj.dist / config.triangles.maxDistance;
    percentageTraveled = Math.max(0.5, percentageTraveled);
    var delta = {
        x: obj.vect.x * (config.triangles.deltaX * percentageTraveled),
        y: obj.vect.y * (config.triangles.deltaY * percentageTraveled)
    };
    obj.points.forEach(function (point) {
        point.x += delta.x;
        point.y += delta.y;

    });
}

function updateCanvas() {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    triangles.push(generateTriangle());
    for (var i = 0; i < triangles.length; i++) {
        var triangle = triangles[i];
        if (!drawTriangle(triangle)) {
            triangles.splice(i--, 1);
        }
        act(triangle);
    }
    setTimeout(function () {
        if (!config.triangles.paused) {
            animationId = requestAnimationFrame(updateCanvas);
        }
    }, 1000 / config.triangles.fps)

}

function setMousePos(e) {
    base = getMousePos(canvas, e);
}

function convertColorsToStyle() {
    colors.forEach(converColorToRgbaWithAlphaPlaceholderStyle)
}


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.height = config.size.height;
    canvas.width = config.size.width;
    canvas.onmousemove = setMousePos;
    ctx.fillStyle = 'red';
    triangles.push(generateTriangle());
    convertColorsToStyle();
    requestAnimationFrame(updateCanvas);
});


