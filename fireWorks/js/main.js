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
        flareCount: 10,
        secondaryFlare: {
            flareAmount: 15
        }
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

function generateDefaultFlare() {
    var defaultFlare = {};
    defaultFlare.vel = 3;
    defaultFlare.age = 0;
    defaultFlare.maxAge = randomNumberButAtLeast(config.size.height / 10, config.size.height / 20);
    defaultFlare.decay = 0.9;
    defaultFlare.alpha = 1;
    defaultFlare.trail = [];
    defaultFlare.parameter = firstFlareParameter;
    defaultFlare.color = flareColors[1];
    defaultFlare.eventFun = 1;
    defaultFlare.radius = 2;
    defaultFlare.postFun = defaultPostSlopeFun;
    converColorToRgbaWithAlphaPlaceholderStyle(defaultFlare.color);
    return defaultFlare;
}


function generateSecondaryFlare() {
    var secondaryFlare = generateDefaultFlare();
    secondaryFlare.maxAge = randomNumberButAtLeast(config.size.height / 10, config.size.height / 20);
    secondaryFlare.vel = 3;
    secondaryFlare.dead = false;
    secondaryFlare.radius = 1;
    secondaryFlare.parameter = firstFlareParameter;
    secondaryFlare.color = flareColors[3];
    secondaryFlare.eventFun = undefined;
    converColorToRgbaWithAlphaPlaceholderStyle(secondaryFlare.color);
    return secondaryFlare;
}

var rockets = [];

function startRocket() {
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
        age: 0,
        maxAge: config.size.height / 4,
        distTravelled: 0,
        trail: [],
        flares: [],
        alpha: 1,
        color: randomElement(rocketColors),
        parameter: rocketSlopeParameter,
        postFun: defaultPostSlopeFun
    };
    converColorToRgbaWithAlphaPlaceholderStyle(rocket.color);
    rockets.push(rocket);
}

function drawRocket(rocket) {
    rocket.trail.forEach(function (trailItem) {
        ctx.beginPath();
        ctx.fillStyle = rocket.color.styleRGBA.replace('%alpha', trailItem.alpha);
        trailItem.x = trailItem.x << 0;
        trailItem.y = trailItem.y << 0;
        ctx.rect(trailItem.x, trailItem.y, 2, 2);
        ctx.fill();
    });
    rocket.flares.forEach(function (flare) {
        flare.trail.forEach(function (trailItem) {
            ctx.beginPath();
            ctx.fillStyle = flare.color.styleRGBA.replace('%alpha', trailItem.alpha);
            trailItem.x = trailItem.x << 0;
            trailItem.y = trailItem.y << 0;
            ctx.rect(trailItem.x, trailItem.y, flare.radius, flare.radius);
            ctx.fill();
        })
    });
}

function slopeAct(object, parentObj) {
    if (object.age < object.parameter.firstPhase.ageLimit) {
        object.x -= object.nVec.x * object.vel;
        object.y -= object.nVec.y * object.vel;
        object.age += object.parameter.firstPhase.ageChange;
    } else if (object.nVec.y > 0) {
        object.vel *= object.parameter.secondPhase.velocityFactor;
        object.x -= object.nVec.x * object.vel;
        object.y -= object.nVec.y * object.vel;
        object.movVec.y -= object.parameter.secondPhase.yVectorChange;
        // pass by reference
        object.nVec = normalizeVector({x: object.movVec.x, y: object.movVec.y});
        object.age += 2;
    } else if (object.age < object.maxAge) {
        object.vel *= 1.01;
        object.x -= object.nVec.x * object.vel;
        object.y -= object.nVec.y * object.vel;
        object.movVec.y -= object.parameter.thirdPhase.yVectorChange;
        object.movVec.x *= object.parameter.thirdPhase.xVectorFactor;
        // pass by reference
        object.nVec = normalizeVector({x: object.movVec.x, y: object.movVec.y});
        object.age += 2;
    } else if (!object.dead) {
        if (object.eventFun != undefined) {
            object.eventFun(object, parentObj);
        }
        object.dead = true;
    }
    object.postFun(object, parentObj);
}

function explodedRocketAct(rocket) {
    for (var i = 0; i < rocket.flares.length; i++) {
        var flare = rocket.flares[i];
        if (flare.eventFun == 1) {
            flare.eventFun = function (flare, rocket) {
                createFlare(flare, rocket, generateSecondaryFlare, config.fireWorks.secondaryFlare.flareAmount);
            }
        }
        slopeAct(flare, rocket)
    }
}

function rocketAct(rocket) {
    rocket.alpha *= 0.995;
    rocketSlopeParameter.firstPhase.ageChange = rocket.vel;
    rocket.eventFun = function (rocket, useless) {
        createFlare(rocket, rocket, generateDefaultFlare, config.fireWorks.flareCount);
    };
    slopeAct(rocket, undefined);
    explodedRocketAct(rocket);
}
var rocketSlopeParameter = {
    firstPhase: {
        ageLimit: config.size.height / 5,
        ageChange: 1
    },
    secondPhase: {
        velocityFactor: 0.99,
        yVectorChange: config.size.height / 200
    },
    thirdPhase: {
        yVectorChange: config.size.height / 200,
        xVectorFactor: 1
    }
};

var firstFlareParameter = {
    firstPhase: {
        ageLimit: config.size.width / 150,
        ageChange: 1
    },
    secondPhase: {
        velocityFactor: 0.95,
        yVectorChange: config.size.height / 50
    },
    thirdPhase: {
        yVectorChange: config.size.height / 200,
        xVectorFactor: 0.95
    }
};

function createFlare(object, parentObj, baseFlare, flareAmount) {
    for (var i = 0; i < 2 * Math.PI; i += 2 * Math.PI / flareAmount) {
        var newFlare = baseFlare();
        var newXOffset = randomNumberButAtLeast(config.fireWorks.flareDist, config.fireWorks.flareDist / 5) * Math.cos(i);
        var newYOffset = randomNumberButAtLeast(config.fireWorks.flareDist, config.fireWorks.flareDist / 5) * Math.sin(i);
        var target = {x: object.x + newXOffset, y: object.y + newYOffset};
        var vec = createVector(target, object);
        newFlare.movVec = {
            x: vec.x,
            y: vec.y
        };
        newFlare.nVec = normalizeVector(vec);
        newFlare.x = object.x;
        newFlare.y = object.y;

        parentObj.flares.push(newFlare);
    }
}

function defaultPostSlopeFun(object) {
    if (!object.dead) {
        object.trail.push({x: object.x, y: object.y, alpha: object.alpha});
    }
    for (var trailIndex = 0; trailIndex < object.trail.length; trailIndex++) {
        var trailItem = object.trail[trailIndex];
        trailItem.y += 0.02;
        trailItem.age++;
        trailItem.alpha *= 0.95;
        if (trailItem.alpha < 0.01) {
            object.trail.splice(trailIndex--, 1);
        }
    }
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


function setShaft(event) {
    mouseStart = getMousePos(canvas, event);
}

function setTip(event) {
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
