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
        maxDistance: window.innerWidth / 4,
        deltaX: 1.5,
        deltaY: 1.5,
        spawnDist: 10,
        previewConfig: {
            dimensions: {width: 10, height: 10}
        }
    }
};

var triangles = [];

var redOrangeYellowGreen = {
    name: '',
    colors: [
        {r: 0xb0, g: 0x56, b: 0x3f},
        {r: 0xb5, g: 0x7a, b: 0x3f},
        {r: 0xba, g: 0xa2, b: 0x3f},
        {r: 0xb2, g: 0xbf, b: 0x3f},
        {r: 0x8e, g: 0xc2, b: 0x41}]
};

var blackToRed = {
    name: '',
    colors: [
        {r: 0x1a, g: 0x1a, b: 0x1a},
        {r: 0x34, g: 0x34, b: 0x34},
        {r: 0x73, g: 0x27, b: 0x27},
        {r: 0x9b, g: 0x33, b: 0x33},
        {r: 0xc1, g: 0x3f, b: 0x3f}
    ]
};

var greyToBlue = {
    name: '',
    colors: [
        {r: 0x7b, g: 0x7b, b: 0x7b},
        {r: 0x94, g: 0x94, b: 0x94},
        {r: 0x85, g: 0x99, b: 0xd6},
        {r: 0xab, g: 0xb9, b: 0xe3},
        {r: 0xd1, g: 0xd9, b: 0xf0}
    ]
};

var blackToOchre = {
    name: '',
    colors: [
        {r: 0x0b, g: 0x0b, b: 0x0b},
        {r: 0x25, g: 0x25, b: 0x25},
        {r: 0x5d, g: 0x5a, b: 0x20},
        {r: 0x84, g: 0x80, b: 0x2c},
        {r: 0xac, g: 0xa6, b: 0x37}
    ]
};

var blackToDarkRed = {
    name: '',
    colors: [
        {r: 0x00, g: 0x00, b: 0x00},
        {r: 0x1a, g: 0x1a, b: 0x1a},
        {r: 0x4c, g: 0x1a, b: 0x31},
        {r: 0x73, g: 0x26, b: 0x4a},
        {r: 0x9b, g: 0x31, b: 0x62}
    ]
};

var greyToPink = {
    name: '',
    colors: [
        {r: 0x00, g: 0x00, b: 0x00},
        {r: 0x99, g: 0x99, b: 0x99},
        {r: 0xd8, g: 0x8d, b: 0xc6},
        {r: 0xe6, g: 0xb2, b: 0xda},
        {r: 0xf3, g: 0xd8, b: 0xec}
    ]
};

var darkColors = {
    name: '',
    colors: [
        {r: 0x40, g: 0x17, b: 0x3d},
        {r: 0x44, g: 0x18, b: 0x33},
        {r: 0x48, g: 0x18, b: 0x28},
        {r: 0x4d, g: 0x19, b: 0x1a},
        {r: 0x51, g: 0x29, b: 0x1a}
    ]
};

var purpleToOrange = {
    name: '',
    colors: [
        {r: 0xac, g: 0x44, b: 0xbc},
        {r: 0xbf, g: 0x46, b: 0xac},
        {r: 0xc1, g: 0x49, b: 0x8a},
        {r: 0xc4, g: 0x4c, b: 0x68},
        {r: 0xc6, g: 0x55, b: 0x4e}
    ]
};

var blueish = {
    name: '',
    colors: [
        {r: 0x28, g: 0x70, b: 0x6c},
        {r: 0x29, g: 0x62, b: 0x75},
        {r: 0x29, g: 0x4e, b: 0x79},
        {r: 0x29, g: 0x37, b: 0x73},
        {r: 0x27, g: 0x2a, b: 0x83}
    ]
};


var greenBlueRedYellow = {
    name: '',
    colors: [
        {r: 0x3a, g: 0x95, b: 0x60},
        {r: 0x3b, g: 0x44, b: 0xa4},
        {r: 0xb4, g: 0x3c, b: 0x81},
        {r: 0xc3, g: 0xb8, b: 0x3c}
    ]
};


var colorSchemes = [];
colorSchemes.push(blackToRed);
colorSchemes.push(redOrangeYellowGreen);
colorSchemes.push(greyToBlue);
colorSchemes.push(blackToOchre);
colorSchemes.push(blackToDarkRed);
colorSchemes.push(greyToPink);
colorSchemes.push(darkColors);
colorSchemes.push(purpleToOrange);
colorSchemes.push(blueish);
colorSchemes.push(greenBlueRedYellow);

var backGroundColors = [];
backGroundColors.push({r: 0xff, g: 0xff, b: 0xff});
backGroundColors.push({r: 0x0, g: 0x0, b: 0x0});
backGroundColors.push({r: 0xc6, g: 0x0, b: 0x0});
backGroundColors.push({r: 0x0, g: 0xc6, b: 0x0});
backGroundColors.push({r: 0x0, g: 0x0, b: 0xc6});


var currentColorScheme = colorSchemes[0];
var currentBackgroundColor = backGroundColors[0];

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
    var sideWith = function () {
        return randomNumberButAtLeast(config.triangles.maxSideLength, config.triangles.minSideLength);
    };

    var newYOffset = sideWith() * Math.sin(toRad(90));
    var newXOffset = sideWith() * Math.cos(toRad(90));

    var pointB = {
        x: base.x + newYOffset,
        y: base.y + newXOffset
    };

    newYOffset = sideWith() * Math.sin(toRad(180));
    newXOffset = sideWith() * Math.cos(toRad(180));

    var pointC = {
        x: base.x + newYOffset,
        y: base.y + newXOffset
    };

    obj.points.push(pointA);
    obj.points.push(pointB);
    obj.points.push(pointC);
    obj.vect = createNormalizedVector(pointA, base);
    obj.col = currentColorScheme.colors[roundedRandom(currentColorScheme.colors.length)];
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
    ctx.fillStyle = obj.col.styleRGBA.replace('%alpha', alpha);
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
    // we need to draw, else the background is not in the download
    ctx.beginPath();
    ctx.fillStyle = currentBackgroundColor.styleRGB;
    ctx.rect(0, 0, config.size.width, config.size.height);
    ctx.fill();
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

function setPreviewDimensionsForColorScheme() {
    this.previewWidth = config.triangles.previewConfig.dimensions.width * this.colors.length;
    this.previewHeight = config.triangles.previewConfig.dimensions.height;
}

function setPreviewDimensionForBackgroundColor(){
    this.previewWidth = config.triangles.previewConfig.dimensions.width;
    this.previewHeight = config.triangles.previewConfig.dimensions.height;
}


function setPreviewFunPtr() {
    colorSchemes.forEach(function (colorScheme) {
        colorScheme.previewDimensionFun = setPreviewDimensionsForColorScheme;
        colorScheme.previewFun = previewColorScheme;
    });
    backGroundColors.forEach(function(backgroundColor){
        backgroundColor.previewDimensionFun = setPreviewDimensionForBackgroundColor;
        backgroundColor.previewFun = previewBackgroundColor;
    })
}
function convertColorsToStyle() {
    colorSchemes.forEach(function (colorScheme) {
        colorScheme.colors.forEach(converColorToRgbaWithAlphaPlaceholderStyle);
        colorScheme.colors.forEach(addRGBStyle)
    });

    backGroundColors.forEach(addRGBStyle);
}

function previewBackgroundColor(context){
    context.beginPath();
    context.fillStyle = this.styleRGB;
    var dimensions = config.triangles.previewConfig.dimensions;
    context.rect(0, 0, dimensions.width, dimensions.height);
    context.fill();
}

function previewColorScheme(ctx) {
    this.colors.forEach(function (color, index) {
        addColorToCanvas(ctx, color, index);
    });
}

function addColorToCanvas(ctx, color, indexInArray) {
    ctx.beginPath();
    ctx.fillStyle = color.styleRGB;
    var dimensions = config.triangles.previewConfig.dimensions;
    ctx.rect(indexInArray * dimensions.width, 0, dimensions.width, dimensions.height);
    ctx.fill();
}

function changeColorScheme(newIndex) {
    currentColorScheme = colorSchemes[newIndex];
}

function changeBackgroundColor(newIndex){
    currentBackgroundColor = backGroundColors[newIndex];
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
    setPreviewFunPtr();
    requestAnimationFrame(updateCanvas);
    addOptionsWithImages('colors', colorSchemes, 0);
    addOptionsWithImages('backgroundColor', backGroundColors, 0);
});


