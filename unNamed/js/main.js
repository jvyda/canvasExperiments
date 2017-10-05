var imageData = {};
var imageData_default;
var ctx = {};
var canvas = {};


var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    unNamed: {
        edges: 8,
        spawnInterval: 1,
        rangeCheckInterval: 4,
        shuffleInterval: 200,
        colorAmount: 8,
        headSize: 2,
        speed: 3,
        generateNew: true,
        trailLength: 3,
        minLumen: 120
    },
    general: {
        fps: 120,
        paused: false
    }
};

var cnt = 0;

var particles = [];
var mouseP = {
    x: config.size.width / 2, y: config.size.height / 2
};

var center = {
    x: mouseP.x, y: mouseP.y
};

var colors = [];

function setupColors() {
    colors = [];
    for (var i = 0; i < config.unNamed.edges; i++) {
        var col = randomColorWithAtLeastLumen(config.unNamed.minLumen);
        col.alpha = 1;
        colors.push(col);
    }
}

$(document).ready(function () {
    setupColors();
    canvas = $("#canvas")[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');

    canvas.addEventListener("mousedown", mouseClick, false);
    imageData_default = ctx.getImageData(0, 0, config.size.width, config.size.height);
    imageData = ctx.getImageData(0, 0, config.size.width, config.size.height);

    canvas.onmousemove = setMousePos;
    // attach it to document, because of focus errors...
    document.onkeypress = keyPressed;


    requestAnimationFrame(updateCanvas)
});

var planeCorrection = toRad(90);
var cosMap = {};
var sinMap = {};

function getSin(theta){
    if(!(theta in sinMap)){
        sinMap[theta] = Math.sin(theta);
    }
    return sinMap[theta];
}

function getCos(theta){
    if(!(theta in cosMap)){
        cosMap[theta] = Math.cos(theta);
    }
    return cosMap[theta];
}

function updateCanvas() {
    if (!config.general.paused) {
        var increment = 2 * Math.PI / config.unNamed.edges;
        var mouseToCenter = createNormalizedVector(mouseP, center);
        var top = {
            x: center.x, y: center.y - 1
        };
        var topToCenter = createNormalizedVector(top, center);
        var theta = angleBetweenTwoVectors(mouseToCenter, topToCenter);
        if(!isNaN(theta)) {
            if (mouseP.x < center.x) {
                theta *= -1;
            }
            theta -= planeCorrection;
            cnt++;
            var addParticle = cnt % config.unNamed.spawnInterval == 0;
            var distance = pointDistance(center, mouseP);
            for (var index = 0; index < config.unNamed.edges; index++) {
                var newX2 = center.x + distance * getCos(theta);
                var newY2 = center.y + distance * getSin(theta);
                theta = theta + increment;
                //ctx.rect(newX2, newY2, 1, 1);
                if (addParticle && config.unNamed.generateNew) {
                    var col = colors[index];
                    particles.push(
                        {
                            x: newX2,
                            y: newY2,
                            vec: createNormalizedVector({x: newX2, y: newY2}, center),
                            col: {r: col.r, g: col.g, b: col.b, styleRGB: col.styleRGB, alpha: col.alpha},
                            speed: config.unNamed.speed
                        }
                    );
                }
            }
            if (doPerformShuffle()) {
                shuffleColors();
            }
            particlesAct();
        }
    }


    drawParticles();

    ctx.putImageData(imageData, 0, 0);
    imageData.data.set(imageData_default.data);

    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.general.fps)
}

function particlesAct() {
    var performRangeCheck = doPerformRangeCheck();
    for (var particleI = 0; particleI < particles.length; particleI++) {
        var particle = particles[particleI];
        particle.x += particle.vec.x * particle.speed;
        particle.y += particle.vec.y * particle.speed;
        if (performRangeCheck) {
            if (isOutSideArea(particle)) {
                particles.splice(particleI--, 1);
            }
        }
    }
}

function doPerformRangeCheck() {
    return (cnt % config.unNamed.rangeCheckInterval) == 0;
}

function doPerformShuffle() {
    return (cnt % config.unNamed.shuffleInterval) == 0;
}

function isOutSideArea(particle) {
    return particle.x < 0 || particle.x > config.size.width || particle.y < 0 || particle.y > config.size.height;
}

function drawParticles() {
    particles.forEach(drawParticle);
}


function drawHead(particle) {
    for (var x_off = 0; x_off < config.unNamed.headSize; x_off++) {
        for (var y_off = 0; y_off < config.unNamed.headSize; y_off++) {
            setCoordinateToColor(particle.x + x_off << 0, particle.y + y_off << 0, particle.col);
        }
    }
}

function drawTail(particle){
    for (var lengthI = 0; lengthI < config.unNamed.trailLength; lengthI++) {
        setCoordinateToColor((particle.x + particle.vec.x * lengthI) << 0, (particle.y + particle.vec.y * lengthI) << 0, particle.col);
    }
}

function drawParticle(particle) {
    //setCoordinateToColor(particle.x, particle.y, {r: particle.col.r, g: particle.col.g, b: particle.col.b, alpha: 1});
    drawHead(particle);
}

function setMousePos(e) {
    mouseP = getMousePos(canvas, e);
}

function shuffleColors() {
    var temp, j;
    for (var i = 0; i < colors.length; i++) {
        j = (Math.random() * i) << 0;
        temp = colors[i];
        colors[i] = colors[j];
        colors[j] = temp;
    }
}

function keyPressed(event) {
    // a
    if (eventIsKey(event, 97)) {
        if (config.unNamed.edges > 0) {
            config.unNamed.edges--;
            setupColors();
        }
    }
    // d
    else if (eventIsKey(event, 100)) {
        config.unNamed.edges++;
        setupColors();
    } // e
    else if (eventIsKey(event, 101)) {
        config.general.paused = !config.general.paused;
    } // r
    else if (eventIsKey(event, 114)) {
        setupColors();
    } // l
    else if (eventIsKey(event, 108)) {
    } // w
    else if (eventIsKey(event, 115)) {
        if (config.unNamed.speed > 1) {
            config.unNamed.speed--;
        }
    } // s
    else if (eventIsKey(event, 119)) {
        config.unNamed.speed++;
    } // m
    else if (eventIsKey(event, 109)) {

    } // v
    else if (eventIsKey(event, 118)) {

    } // b
    else if (eventIsKey(event, 98)) {
    } // i
    else if (eventIsKey(event, 105)) {
        // c
    } else if(eventIsKey(event, 99)){
        particles = [];
    }
}

function mouseClick() {
    config.unNamed.generateNew = !config.unNamed.generateNew;
}
