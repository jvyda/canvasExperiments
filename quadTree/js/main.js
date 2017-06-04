var imageData = {};
var ctx = {};
var canvas = {};
var currentQuadTree = {};

var colorFunctions = [
    {text: 'City lights', fun: cityLights},
    {text: 'Fixed amount', fun: fixedAmount},
    {text: 'Relative to depth', fun: relativeToDetph},
    {text: 'Randomly into one color', fun: randomAmount}
];

var config = {
    size: {
        size: 1000
    },
    quadTree: {
        colorFun: colorFunctions[0]
    }
};

function drawBorder() {
    ctx.beginPath();
    ctx.rect(0, 0, config.size.size, config.size.size);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}
function updateCanvas(recreateQuadTree) {
    drawBorder();
    if (recreateQuadTree) {
        currentQuadTree = buildQuadTree(1);
    }
    drawQuadTreeElement(currentQuadTree, {x: 0, y: 0}, 0, {r: 0, g: 0, b: 0});
}

function fixedAmount(input, x, y, depth) {
    return ~~((input + 25) % 255)
}

function relativeToDetph(input, x, y, depth) {
    return ~~((input + depth * 10) % 255);
}

function randomAmount(input, x, y, depth) {
    return ~~((input + Math.random() * 25) % 255);
}

function cityLights(input, x, y, depth) {
    return ~~((input + x & y & (Math.pow(depth, depth)) ) % 255);
}

function setNewColorFunction() {
    config.quadTree.colorFun = colorFunctions[$("#color_fun").val()];
    reset(false);
}

function drawQuadTreeElement(element, basePos, depth, baseColor) {
    depth++;
    var quadWidth = config.size.size / (Math.pow(2, depth));
    //ctx.beginPath();
    //ctx.rect(basePos.x, basePos.y, quadWidth, quadWidth);
    //ctx.strokeStyle = 'black';
    //ctx.stroke();
    if (element.drawing) {
        ctx.beginPath();
        //var red = ~~(Math.random() * 255 * depth % 255);
        //var blue = ~~(Math.random() * 255 * depth % 255);
        //var green = ~~(Math.random() * 255 * depth % 255);
        ctx.fillStyle = 'rgb(' + baseColor.r + ',' + baseColor.g + ',' + baseColor.b + ')';
        ctx.rect(basePos.x, basePos.y, quadWidth * 2, quadWidth * 2);
        ctx.fill();
        return;
    }
    if (element.first) {
        var newBasePos = {
            x: basePos.x, y: basePos.y
        };
        var newBaseColor = {
            r: config.quadTree.colorFun.fun(baseColor.r, basePos.x, basePos.y, depth),
            g: baseColor.g,
            b: baseColor.b
        };
        drawQuadTreeElement(element.first, newBasePos, depth, newBaseColor)
    }
    if (element.second) {
        var newBasePos = {
            x: basePos.x + quadWidth, y: basePos.y
        };
        var newBaseColor = {
            r: baseColor.r,
            g: baseColor.g,
            b: config.quadTree.colorFun.fun(baseColor.r, basePos.x, basePos.y, depth)
        };
        drawQuadTreeElement(element.second, newBasePos, depth, newBaseColor)
    }
    if (element.third) {
        var newBasePos = {
            x: basePos.x, y: basePos.y + quadWidth
        };
        var newBaseColor = {
            r: baseColor.r,
            g: config.quadTree.colorFun.fun(baseColor.g, basePos.x, basePos.y, depth),
            b: baseColor.b
        };
        drawQuadTreeElement(element.third, newBasePos, depth, newBaseColor)
    }
    if (element.fourth) {
        var newBasePos = {
            x: basePos.x + quadWidth, y: basePos.y + quadWidth
        };
        var newBaseColor = {
            r: config.quadTree.colorFun.fun(baseColor.r, basePos.x, basePos.y, depth),
            g: baseColor.g,
            b: baseColor.b
        };
        drawQuadTreeElement(element.fourth, newBasePos, depth, newBaseColor)
    }
}

function buildQuadTree(depth) {
    // we add an element to the structure
    if (depth > 20) return {drawing: false}
    var element = {};
    var base = 1.04;
    //var base = 2;
    var drawingProb = (1 - Math.pow(base, -depth));
    if (Math.random() < drawingProb) {
        element.drawing = true;
        return element;
    }
    if (Math.random() < (Math.pow(base, -depth))) {
        element.second = buildQuadTree(depth + 1);
    }
    if (Math.random() < (Math.pow(base, -depth))) {
        element.third = buildQuadTree(depth + 1);
    }
    if (Math.random() < (Math.pow(base, -depth))) {
        element.fourth = buildQuadTree(depth + 1);
    }
    if (Math.random() < (Math.pow(base, -depth))) {
        element.first = buildQuadTree(depth + 1);
    }
    return element;
}

function configChanged() {
    config.size.size = $('#size').val();
    canvas.width = config.size.size;
    canvas.height = config.size.size;
    imageData = ctx.createImageData(config.size.size, config.size.size);
    reset(false);
}

function refresh() {
    reset(true);
}

function reset(recreateQuadTree) {
    ctx.clearRect(0, 0, config.size.size, config.size.size);
    updateCanvas(recreateQuadTree);
}
$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.height = config.size.size;
    canvas.width = config.size.size;
    $('#size').val(config.size.size);
    initDropdownList('color_fun', colorFunctions);

    reset(true);
});


