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
        spawnDist: 10
    }
};

var triangles = [];

var redOrangeYellowGreen = {
    name: 'Red to green',
    colors: [
        {r: 0xb0, g: 0x56, b: 0x3f},
        {r: 0xb5, g: 0x7a, b: 0x3f},
        {r: 0xba, g: 0xa2, b: 0x3f},
        {r: 0xb2, g: 0xbf, b: 0x3f},
        {r: 0x8e, g: 0xc2, b: 0x41}]
};

var blackToRed = {
    name: 'Black to red',
    colors: [
        {r: 0x1a, g: 0x1a, b: 0x1a},
        {r: 0x34, g: 0x34, b: 0x34},
        {r: 0x73, g: 0x27, b: 0x27},
        {r: 0x9b, g: 0x33, b: 0x33},
        {r: 0xc1, g: 0x3f, b: 0x3f}
    ]
};

var greyToBlue = {
    name: 'Grey to blue',
    colors: [
        {r: 0x7b, g: 0x7b, b: 0x7b},
        {r: 0x94, g: 0x94, b: 0x94},
        {r: 0x85, g: 0x99, b: 0xd6},
        {r: 0xab, g: 0xb9, b: 0xe3},
        {r: 0xd1, g: 0xd9, b: 0xf0}
    ]
};

var blackToOchre = {
    name: 'Black to ochre',
    colors: [
        {r: 0x0b, g: 0x0b, b: 0x0b},
        {r: 0x25, g: 0x25, b: 0x25},
        {r: 0x5d, g: 0x5a, b: 0x20},
        {r: 0x84, g: 0x80, b: 0x2c},
        {r: 0xac, g: 0xa6, b: 0x37}
    ]
};

var blackToDarkRed = {
    name: 'Black to dark red',
    colors: [
        {r: 0x00, g: 0x00, b: 0x00},
        {r: 0x1a, g: 0x1a, b: 0x1a},
        {r: 0x4c, g: 0x1a, b: 0x31},
        {r: 0x73, g: 0x26, b: 0x4a},
        {r: 0x9b, g: 0x31, b: 0x62}
    ]
};

var greyToPink = {
    name: 'grey to pink',
    colors: [
        {r: 0x00, g: 0x00, b: 0x00},
        {r: 0x99, g: 0x99, b: 0x99},
        {r: 0xd8, g: 0x8d, b: 0xc6},
        {r: 0xe6, g: 0xb2, b: 0xda},
        {r: 0xf3, g: 0xd8, b: 0xec}
    ]
};

var darkColors = {
    name: 'dark colors',
    colors: [
        {r: 0x40, g: 0x17, b: 0x3d},
        {r: 0x44, g: 0x18, b: 0x33},
        {r: 0x48, g: 0x18, b: 0x28},
        {r: 0x4d, g: 0x19, b: 0x1a},
        {r: 0x51, g: 0x29, b: 0x1a}
    ]
};

var purpleToOrange = {
    name: 'purple to orange',
    colors: [
        {r: 0xac, g: 0x44, b: 0xbc},
        {r: 0xbf, g: 0x46, b: 0xac},
        {r: 0xc1, g: 0x49, b: 0x8a},
        {r: 0xc4, g: 0x4c, b: 0x68},
        {r: 0xc6, g: 0x55, b: 0x4e}
    ]
};

var blueish = {
    name: 'blueish',
    colors: [
        {r: 0x28, g: 0x70, b: 0x6c},
        {r: 0x29, g: 0x62, b: 0x75},
        {r: 0x29, g: 0x4e, b: 0x79},
        {r: 0x29, g: 0x37, b: 0x73},
        {r: 0x27, g: 0x2a, b: 0x83}
    ]
};


var greenBlueRedYellow = {
    name: 'green blue red yellow',
    colors: [
        {r: 0x3a, g: 0x95, b: 0x60},
        {r: 0x3b, g: 0x44, b: 0xa4},
        {r: 0xb4, g: 0x3c, b: 0x81},
        {r: 0xc3, g: 0xb8, b: 0x3c}
    ]
};


var colorArray = [];
colorArray.push(blackToRed);
colorArray.push(redOrangeYellowGreen);
colorArray.push(greyToBlue);
colorArray.push(blackToOchre);
colorArray.push(blackToDarkRed);
colorArray.push(greyToPink);
colorArray.push(darkColors);
colorArray.push(purpleToOrange);
colorArray.push(blueish);
colorArray.push(greenBlueRedYellow);


var currentColorScheme = colorArray[0];

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
    colorArray.forEach(function (colorScheme) {
        colorScheme.colors.forEach(converColorToRgbaWithAlphaPlaceholderStyle)
        colorScheme.colors.forEach(convertColorToStyle)
    })
}

function changeColorScheme(newIndex){
    currentColorScheme = colorArray[newIndex];
}


function initDropdownList() {

    var oDropdown = $("#colors").msDropdown({selectedIndex: 0}).data("dd");
    colorArray.forEach(function (colorScheme) {
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = 50;
        tmpCanvas.height = 10;
        var tmpCtx = tmpCanvas.getContext("2d");
        var index = 0;
        colorScheme.colors.forEach(function (color) {
            tmpCtx.beginPath();
            tmpCtx.fillStyle = color.styleRGB;
            tmpCtx.rect(index * 10, 0, 10, 10);
            tmpCtx.fill();
            index++;
        });
        var imageData = tmpCanvas.toDataURL({
            format: 'png',
            multiplier: 4
        });
        var blob = dataURLtoBlob(imageData);

        oDropdown.add({text: colorScheme.name, value: colorScheme.colors[0], image: URL.createObjectURL(blob)});
    })

    oDropdown.set("selectedIndex", 0);
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
    initDropdownList()
});


