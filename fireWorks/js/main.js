var canvas;
var ctx;

var animationId;

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    fireWorks: {
        maxAge: 1000,
        fps: 60,
        flareDist: window.innerWidth / 8,
        flareCount: 10
    }
};

var mouseStart;
var mouseStop;

var flareColors = [
    {r: 0xbc, g: 0x47, b: 0x30},
    {r: 0xfa, g: 0xca, b: 0xc4},
    {r: 0xf3, g: 0xda, b: 0xb6},
    {r: 0xf5, g: 0xa9, b: 0x82}
];

var rocketColors = [
    {r: 255, g: 127, b: 0},
    {r: 255, g: 167, b: 0},
    {r: 255, g: 140, b: 0}
];

function generateDefaultFlare(){
    var defaultFlare = {};
    defaultFlare.vel = 3;
    defaultFlare.age = 0;
    defaultFlare.maxAge = randomNumberButAtLeast(config.size.height / 10, config.size.height / 20);
    defaultFlare.decay = 0.9;
    defaultFlare.alpha = 1;
    defaultFlare.trail = [];
    defaultFlare.color = flareColors[1];
    return defaultFlare;
}



var rockets = [];

function startRocket() {
    //var shaft = {x: 10, y: 0};
    //var tip = {x: 25 + randomNumber(10), y: 20};
    var vec = createVector(mouseStart, mouseStop);
    var rocket = {
        x: mouseStart.x,
        y: mouseStart.y,
        origin: {
            x: mouseStart.x,
            y: mouseStart.y
        },
        movVec: {
            x: vec.x,
            y: vec.y
        },
        nVec: normalizeVector({x: vec.x, y: vec.y}),
        vel: vectorLenght(vec) / config.size.height * (config.size.height / 80),
        fuel: config.size.height / 2,
        distTravelled: 0,
        exploded: false,
        trail: [],
        flares: [],
        alpha: 1,
        color: randomElement(rocketColors)
    };
    converColorToRgbaWithAlphaPlaceholderStyle(rocket.color);
    rockets.push(rocket);
}

function drawRocket(rocket) {
    rocket.trail.forEach(function (trailItem) {
        ctx.beginPath();
        ctx.fillStyle = rocket.color.styleRGBA.replace('%alpha', trailItem.alpha);
        ctx.arc(trailItem.x, trailItem.y, 2, 0, 2* Math.PI);
        ctx.fill();
    });
    rocket.flares.forEach(function (flare) {
        flare.trail.forEach(function (trailItem) {
            ctx.beginPath();
            ctx.fillStyle = flare.color.styleRGBA.replace('%alpha', trailItem.alpha);
            ctx.arc(trailItem.x, trailItem.y, 2, 0, 2* Math.PI);
            ctx.fill();
        })
    });
}

function propellRocket(rocket) {
    if (rocket.fuel > config.size.height / 5) {
        rocket.x -= rocket.nVec.x * rocket.vel;
        rocket.y -= rocket.nVec.y * rocket.vel;
        rocket.fuel -= rocket.vel;
    } else if (rocket.nVec.y > 0) {
        rocket.vel *= 0.99;
        rocket.x -= rocket.nVec.x * rocket.vel;
        rocket.y -= rocket.nVec.y * rocket.vel;
        rocket.movVec.y -= config.size.height / 200;
        // pass by reference
        rocket.nVec = normalizeVector({x: rocket.movVec.x, y: rocket.movVec.y});
        rocket.fuel -= 2;
    } else if (rocket.fuel > 0) {
        rocket.vel *= 1.01;
        rocket.x -= rocket.nVec.x * rocket.vel;
        rocket.y -= rocket.nVec.y * rocket.vel;
        rocket.movVec.y -=  config.size.height / 200;
        // pass by reference
        rocket.nVec = normalizeVector({x: rocket.movVec.x, y: rocket.movVec.y});
        rocket.fuel -= 2;
    } else if (!rocket.exploded) {
        rocket.exploded = true;
        var flareCount = randomNumberButAtLeast(config.fireWorks.flareCount * 2, config.fireWorks.flareCount);
        for (var i = 0; i < 2 * Math.PI; i += 2 * Math.PI / flareCount) {
            var flare = generateDefaultFlare();
            var newXOffset = randomNumberButAtLeast(config.fireWorks.flareDist * 2, config.fireWorks.flareDist)  * Math.cos(i);
            var newYOffset = randomNumberButAtLeast(config.fireWorks.flareDist * 2, config.fireWorks.flareDist) * Math.sin(i);
            var target = {x: rocket.x + newXOffset, y: rocket.y + newYOffset};
            var vec = createVector(target, rocket);
            flare.movVec = {
                x: vec.x,
                y: vec.y
            };
            flare.nVec = normalizeVector(vec);
            flare.x = rocket.x;
            flare.y = rocket.y;
            converColorToRgbaWithAlphaPlaceholderStyle(flare.color);
            rocket.flares.push(flare);
        }
    }
    if(!rocket.exploded) {
        rocket.trail.push({x: rocket.x, y: rocket.y, alpha: rocket.alpha});
    }
    for (var trailIndex = 0; trailIndex < rocket.trail.length; trailIndex++) {
        var trailItem = rocket.trail[trailIndex];
        trailItem.y += 0.02;
        trailItem.age++;
        trailItem.alpha *= 0.95;
        if (trailItem.alpha < 0.01) {
            rocket.trail.splice(trailIndex--, 1);
        }
    }
}

function flareAct(flare) {
    if (flare.age < config.size.width / 150) {
        flare.x -= flare.nVec.x * flare.vel;
        flare.y -= flare.nVec.y * flare.vel;
        flare.age += 1;
    } else if (flare.nVec.y > 0) {
        flare.vel *= 0.95;
        flare.x -= flare.nVec.x * flare.vel;
        flare.y -= flare.nVec.y * flare.vel;
        flare.movVec.y -= config.size.height / 50;
        // pass by reference
        flare.nVec = normalizeVector({x: flare.movVec.x, y: flare.movVec.y});
        flare.age += 2;
    } else if (flare.age < flare.maxAge) {
        flare.vel *= 1.01;
        flare.x -= flare.nVec.x * flare.vel;
        flare.y -= flare.nVec.y * flare.vel;
        flare.movVec.y -= config.size.height / 200;
        flare.movVec.x *= 0.95;
        // pass by reference
        flare.nVec = normalizeVector({x: flare.movVec.x, y: flare.movVec.y});
        flare.age += 2;
    } else {
        flare.dead = true;
    }
    if (!flare.dead) {
        flare.trail.push({x: flare.x, y: flare.y, alpha: flare.alpha});
    }
    for (var i = 0; i < flare.trail.length; i++) {
        var trailItem = flare.trail[i];
        trailItem.y += 0.02;
        trailItem.age += 1;
        trailItem.alpha *= flare.decay;
        if (trailItem.alpha < 0.01) {
            flare.trail.splice(i--, 1);
        }
    }
}

function explodedRocketAct(rocket) {
    for (var i = 0; i < rocket.flares.length; i++) {
        var flare = rocket.flares[i];
        flareAct(flare);
    }
}

function rocketAct(rocket) {
    rocket.alpha *= 0.995;
    propellRocket(rocket);
    explodedRocketAct(rocket);
}

function updateCanvas() {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    for (var i = 0; i < rockets.length; i++) {
        var rocket = rockets[i];
        drawRocket(rocket);
        rocketAct(rocket);
    }
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.fireWorks.fps)

}


function setShaft(event){
    mouseStart = getMousePos(canvas, event);
}

function setTip(event){
    mouseStop = getMousePos(canvas, event);
    startRocket();
}

$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');
    requestAnimationFrame(updateCanvas);
});
