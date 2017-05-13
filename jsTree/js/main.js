var canvas = {};
var ctx = {};
var imageData = {};
var inputFields = {};

var particles = [];

var mouseDown = false;

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    jsTree: {
        maxAge: 50,
        color: {
            red: 0,
            blue: 0,
            green: 120,
            alpha: 25
        },
        initialX: 10,
        initialY: 10,
        fuzziness: 1,
        noise: 8,
        deltaVel: 0.8,
        spawn: 1,
        fuzzyStart: true,
        showAdvanced: true
    }
};

var movementTypes = [
    {text: 'default', ptr: defaultMovement},
    {text: 'skewed', ptr: skewedMovement},
    {text: 'third', ptr: thirdMovement}
];

var movementPtr = movementTypes[0].ptr;

var FloatArray = window.Float32Array || Array;

var noiseCanvas,
    noise;

var hdrdata;

function tonemap(n) {
    return (1 - Math.pow(2, -n * 0.005 * 0.8)) * 255;
}

function getIndexForCoordinate(x, y) {
    return (y * config.size.width + x) * 4;
}

function setCoordinate(x, y) {
    var indexForCoordinate = getIndexForCoordinate(x, y);
    imageData.data[indexForCoordinate] = tonemap(hdrdata[indexForCoordinate] += config.jsTree.color.red);
    imageData.data[indexForCoordinate + 1] = tonemap(hdrdata[indexForCoordinate + 1] += config.jsTree.color.green);
    imageData.data[indexForCoordinate + 2] = tonemap(hdrdata[indexForCoordinate + 2] += config.jsTree.color.blue);
    imageData.data[indexForCoordinate + 3] = tonemap(hdrdata[indexForCoordinate + 3] += config.jsTree.color.alpha);
}

function updateConfig() {
    config.jsTree.color.alpha = parseInt(inputFields['alpha'].val());
    config.jsTree.initialX = parseInt(inputFields['initialX'].val());
    config.jsTree.initialY = parseInt(inputFields['initialY'].val());
    config.jsTree.fuzziness = parseFloat(inputFields['fuz'].val());
    config.jsTree.noise = parseFloat(inputFields['noise'].val());
    config.jsTree.deltaVel = parseFloat(inputFields['deltaVel'].val());
    config.jsTree.maxAge = parseInt(inputFields['maxAge'].val());
    config.jsTree.spawn = parseInt(inputFields['spawn'].val());
}

function updateConfigEvent(event) {
    updateConfig();
}


function drawParticle(part) {
    setCoordinate(~~part.x, ~~part.y);
}

function fuzzy(range, base) {
    return (base || 0) + (Math.random() - 0.5) * range * 2;
}

function getNoise(part, channel) {
    return noise[(~~part.x + ~~part.y * config.size.width) * 4 + channel] / 127 - 1.0;
}

function defaultMovement(part) {
    for (var j = 0; j < 10; j++) {
        if (part.x < 0 || part.x >= config.size.width || part.y < 0 || part.y >= config.size.height)
            continue;
        part.x += part.deltaX * 0.1;
        part.y += part.deltaY * 0.1;
        drawParticle(part);
    }
}

function skewedMovement(part) {
    for (var j = 0; j < Math.max(part.deltaX, part.deltaY); j++) {
        if (part.x < 0 || part.x >= config.size.width || part.y < 0 || part.y >= config.size.height)
            continue;
        part.x += part.deltaX * (1 / Math.abs(part.deltaX));
        part.y += part.deltaY * (1 / Math.abs(part.deltaY));
        drawParticle(part);
    }
}

function thirdMovement(part) {
    for (var j = 0; j < 25; j++) {
        if (part.x < 0 || part.x >= config.size.width || part.y < 0 || part.y >= config.size.height)
            continue;
        part.x += part.deltaX * (1 / part.deltaY);
        part.y += part.deltaY * (1 / part.deltaX);
        drawParticle(part);
    }
}


function onTickFunction() {
    var alive = [];
    var delta = config.jsTree.deltaVel;
    var fuz = config.jsTree.fuzziness;
    var noise = config.jsTree.noise;
    var maxAge = config.jsTree.maxAge;

    for (var i = 0; i < particles.length; i++) {
        var part = particles[i];
        part.age++;
        part.deltaX = part.deltaX * delta + fuzzy(0.1) * fuz + getNoise(part, 0) * noise * 2;
        part.deltaY = part.deltaY * delta + fuzzy(0.1) * fuz + getNoise(part, 1) * noise * 2;

        movementPtr(part);
        if (part.age < maxAge) {
            alive.push(part);
        }

    }
    particles = alive;
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(onTickFunction)
}

var currentMousePos = {};

function definiteAdd() {
    for (var i = 0; i < config.jsTree.spawn; i++) {
        var particle = {
            x: currentMousePos.x,
            y: currentMousePos.y,
            deltaX: config.jsTree.fuzzyStart ? fuzzy(config.jsTree.initialX) : config.jsTree.initialX,
            deltaY: config.jsTree.fuzzyStart ? fuzzy(config.jsTree.initialY) : config.jsTree.initialY,
            age: 0
        };
        particles.push(particle);
    }
    if (mouseDown) {
        setTimeout(function () {
            definiteAdd();
        }, 1)
    }
}

function addParticle(event) {
    config.jsTree.fuzzyStart = inputFields['fuzzyStart'].is(':checked');
    mouseDown = true;
    event = event || window.event;
    currentMousePos.x = event.pageX - canvas.offsetLeft;
    currentMousePos.y = event.pageY - canvas.offsetTop;

    setTimeout(function () {
        definiteAdd();
    }, 1)
}

function updateMousePos(event) {
    currentMousePos.x = event.pageX - canvas.offsetLeft;
    currentMousePos.y = event.pageY - canvas.offsetTop;
}

function cancelTimer() {
    mouseDown = false;
}

function makeNoise(width, height) {
    var tempCanvas = document.createElement('canvas'),
        noiseCtx = tempCanvas.getContext('2d');

    tempCanvas.width = width;
    tempCanvas.height = height;

    var imgData = noiseCtx.getImageData(0, 0, width, height),
        data = imgData.data,
        pixels = data.length;

    for (var i = 0; i < pixels; i += 4) {
        data[i] = Math.random() * 255;
        data[i + 1] = Math.random() * 255;
        data[i + 2] = Math.random() * 255;
        data[i + 3] = 255;
    }
    noiseCtx.putImageData(imgData, 0, 0);

    return tempCanvas;
}

function makeOctaveNoise(width, height, octaves) {
    var tempCanvas = $("#backgroundNoise")[0],
        noiseCtx = tempCanvas.getContext('2d');

    tempCanvas.width = width;
    tempCanvas.height = height;

    noiseCtx.fillStyle = 'black';
    noiseCtx.fillRect(0, 0, width, height);

    noiseCtx.globalAlpha = 1 / octaves;
    noiseCtx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < octaves; i++) {
        var octave = makeNoise(width >> i, height >> i);
        noiseCtx.drawImage(octave, 0, 0, width, height);
    }

    return tempCanvas;
}

function skewedNoise(width, height, noiseFunction) {
    var tempCanvas = $("#backgroundNoise")[0],
        noiseCtx = tempCanvas.getContext('2d');

    tempCanvas.width = width;
    tempCanvas.height = height;

    noiseCtx.fillStyle = 'black';
    noiseCtx.fillRect(0, 0, width, height);
    var tempData = ctx.createImageData(config.size.width, config.size.height),
        data = tempData.data;
    for (var i = 0; i < data.length; i += 4) {
        var coor = getCoordinates(i);
        var x = coor.x;
        var y = coor.y;
        data[i] = noiseFunction.red(x, y);     // red
        data[i + 1] = noiseFunction.green(x, y); // green
        data[i + 2] = noiseFunction.blue(x, y); // blue
        data[i + 3] = noiseFunction.alpha(x, y);
    }
    noiseCtx.putImageData(tempData, 0, 0);

    return tempCanvas;
}

function toggleBackgroundNoise() {
    var elem = $("#backgroundNoise");
    if (elem.is(":visible")) {
        $("#canvas").css('opacity', '1');
        elem.hide();
    } else {
        $("#canvas").css('opacity', '0.5');
        elem.show();
    }
}

function startDrawingLoop() {
    requestAnimationFrame(onTickFunction);
}

function clearThis() {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    imageData = ctx.createImageData(config.size.width, config.size.height);
    hdrdata = new FloatArray(noise.length);
    for (var i = 0; i < hdrdata.length; i++) {
        hdrdata[i] = 0;
    }
}

function setCurrentImageAsNoise() {
    noiseCanvas = canvas;
    noise = noiseCanvas.getContext('2d').getImageData(0, 0, config.size.width, config.size.height).data;
    var tempCanvas = $("#backgroundNoise")[0];
    var noiseCtx = tempCanvas.getContext('2d');

    tempCanvas.width = config.size.width;
    tempCanvas.height = config.size.height;

    noiseCtx.fillStyle = 'black';
    noiseCtx.fillRect(0, 0, config.size.width, config.size.height);
    noiseCtx.drawImage(noiseCanvas, 0, 0);
}


// currently not bothering to make it better...
function setNewNoise() {
    var selectedNoise = $("#noise_select").val();
    if (selectedNoise == 1) {
        noiseCanvas = makeOctaveNoise(config.size.width, config.size.height, 7);
    } else if (selectedNoise == 2) {
        noiseCanvas = skewedNoise(config.size.width, config.size.height, secondNoise);
    } else if (selectedNoise == 3) {
        noiseCanvas = skewedNoise(config.size.width, config.size.height, thirdNoise);
    } else if (selectedNoise == 4) {
        noiseCanvas = skewedNoise(config.size.width, config.size.height, fourthNoise);
    } else {
        noiseCanvas = skewedNoise(config.size.width, config.size.height, fifthNoise);
    }
    noise = noiseCanvas.getContext('2d').getImageData(0, 0, config.size.width, config.size.height).data;
}

function sqrtxyy(x, y) {
    return (Math.sqrt(x * y * y)) % 255;
}

function sinXY1DivX(x, y) {
    return (Math.sin(x / y) / (1 / x)) % 255;
}

function powXYX(x, y) {
    return (Math.pow(x, y / x)) % 255;
}

function xAndY(x, y) {
    return ((x & y)) % 255;
}

function zero(x, y) {
    return 0;
}

function max(x, y) {
    return 255;
}

var secondNoise = {};
secondNoise.red = sqrtxyy;
secondNoise.green = sqrtxyy;
secondNoise.blue = zero;
secondNoise.alpha = max;

var thirdNoise = {};
thirdNoise.red = zero;
thirdNoise.green = sinXY1DivX;
thirdNoise.blue = zero;
thirdNoise.alpha = max;

var fourthNoise = {};
fourthNoise.red = zero;
fourthNoise.green = powXYX;
fourthNoise.blue = zero;
fourthNoise.alpha = max;

var fifthNoise = {};
fifthNoise.red = zero;
fifthNoise.green = xAndY;
fifthNoise.blue = zero;
fifthNoise.alpha = max;

var recordBtn;

var recorder;

var recording = false;

function toggleRecording() {
    if (!recording) {
        recordBtn.val('\u25A0');
        recorder.record();
    } else {
        recordBtn.val('\u23FA');
        recorder.stop(function (blob) {
            var url = URL.createObjectURL(blob);
            window.open(url);
            var dowloadWebmEl = $('#downloadVid')[0];
            dowloadWebmEl.style.display = '';
            dowloadWebmEl.href = url;
            dowloadWebmEl.download = 'jstree' + new Date().toISOString() + '.webm';
        });
    }
    recording = !recording;
}


function setNewMovementType() {
    movementPtr = movementTypes[$("#movement_type").val()].ptr;
}

function toggleAdvanced(){
    config.jsTree.showAdvanced = !config.jsTree.showAdvanced;
    if(config.jsTree.showAdvanced){
        inputFields['advanced'].show();
    } else {
        inputFields['advanced'].hide();
    }
}

function reInitCanvas() {
    canvas.height = config.size.height;
    canvas.width = config.size.width;

    imageData = ctx.createImageData(config.size.width, config.size.height);

    noiseCanvas = makeOctaveNoise(config.size.width, config.size.height, 7);
    noise = noiseCanvas.getContext('2d').getImageData(0, 0, config.size.width, config.size.height).data;

    hdrdata = new FloatArray(noise.length);
    for (var i = 0; i < hdrdata.length; i++) {
        hdrdata[i] = 0;
    }
}
$(document).ready(function () {

    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    inputFields['startColor'] = $('#startColor');
    inputFields['alpha'] = $('#alpha');
    inputFields['initialX'] = $('#initialX');
    inputFields['initialY'] = $('#initialY');
    inputFields['noise'] = $('#noise');
    inputFields['deltaVel'] = $('#deltaVel');
    inputFields['fuz'] = $('#fuz');
    inputFields['maxAge'] = $('#maxAge');
    inputFields['spawn'] = $('#spawn');
    inputFields['fuzzyStart'] = $("#fuzzy_start");
    inputFields['advanced'] = $("#advanced");

    recordBtn = $("#record");
    recordBtn.val('\u23FA');

    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');

    inputFields['startColor'].change(function(){
        var value = $(this).val();
        config.jsTree.color.red = parseInt(value.substr(1, 2), 16);
        config.jsTree.color.green = parseInt(value.substr(3, 2), 16);
        config.jsTree.color.blue = parseInt(value.substr(5, 2), 16);
    });
    toggleAdvanced();
    config.size.height = window.innerHeight;
    config.size.width = window.innerWidth;
    console.log(window.innerHeight)
    reInitCanvas();
    initDropdownList('movement_type', movementTypes);

    recorder = new CanvasRecorder(canvas, {
        disableLogs: true
    });

    toggleBackgroundNoise();
    startDrawingLoop();
});
