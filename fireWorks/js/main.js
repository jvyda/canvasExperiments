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
            flareAmount: 15,
            chance: 0.5,
            colorChangeChance: 0.5
        }
    }
};

var mouseStart;
var mouseStop;

var whiteGoldish = [
    {r: 0xbc, g: 0x47, b: 0x30},
    {r: 0xfa, g: 0xca, b: 0xc4},
    {r: 0xf3, g: 0xda, b: 0xb6},
    {r: 0xf5, g: 0xa9, b: 0x82}
];

var metallicBlueFlare = [
    {r: 0x3a, g: 0x72, b: 0xa1},
    {r: 0x12, g: 0xe3, b: 0xb5},
    {r: 0x2f, g: 0x54, b: 0xb9},
    {r: 0x54, g: 0x56, b: 0xec},
    {r: 0x1a, g: 0x51, b: 0xc7}
];

var green = [
    {r: 0x54, g: 0xca, b: 0x52},
    {r: 0x03, g: 0x5a, b: 0x07},
    {r: 0x17, g: 0x47, b: 0x11},
    {r: 0x7c, g: 0xeb, b: 0x80}
];

var magenta = [
    {r: 0xe6, g: 0x59, b: 0xe0},
    {r: 0x7b, g: 0x08, b: 0x58},
    {r: 0xcb, g: 0x6f, b: 0xa3},
    {r: 0xe3, g: 0xa5, b: 0xd7}
];

var yellow = [
    {r: 0xf3, g: 0xe1, b: 0x6b},
    {r: 0xd5, g: 0x96, b: 0x45},
    {r: 0xff, g: 0xef, b: 0xbe},
    {r: 0xf5, g: 0xf6, b: 0xa9}
];


var red = [
    {r: 0xfd, g: 0x46, b: 0x37},
    {r: 0xfa, g: 0x8c, b: 0x69},
    {r: 0xe3, g: 0x20, b: 0x08},
    {r: 0xff, g: 0x66, b: 0x43}
];

var colorSchemes = [];
colorSchemes.push(whiteGoldish);
colorSchemes.push(metallicBlueFlare);
colorSchemes.push(green);
colorSchemes.push(magenta);
colorSchemes.push(yellow);
colorSchemes.push(red);

colorSchemes.forEach(function(colorScheme){
    colorScheme.forEach(converColorToRgbaWithAlphaPlaceholderStyle)
});

var rocketColors = [
    {r: 255, g: 127, b: 0},
    {r: 255, g: 167, b: 0},
    {r: 255, g: 140, b: 0}
];


rocketColors.forEach(converColorToRgbaWithAlphaPlaceholderStyle);

function generateDefaultFlare() {
    var defaultFlare = {};
    defaultFlare.vel = 3;
    defaultFlare.age = 0;
    defaultFlare.maxAge = randomNumberButAtLeast(config.size.height / 10, config.size.height / 20);
    defaultFlare.decay = 0.9;
    defaultFlare.alpha = 1;
    defaultFlare.trail = [];
    defaultFlare.parameter = firstFlareParameter;
    defaultFlare.colorScheme = randomElement(colorSchemes);
    defaultFlare.eventFun = 1;
    defaultFlare.radius = 2;
    defaultFlare.postFun = defaultPostSlopeFun;
    return defaultFlare;
}


function generateSecondaryFlare() {
    var secondaryFlare = generateDefaultFlare();
    secondaryFlare.maxAge = randomNumberButAtLeast(config.size.height / 10, config.size.height / 20);
    secondaryFlare.vel = 3;
    secondaryFlare.dead = false;
    secondaryFlare.radius = 1;
    secondaryFlare.parameter = firstFlareParameter;
    secondaryFlare.eventFun = undefined;
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
            var color = randomElement(flare.colorScheme);
            ctx.fillStyle = color.styleRGBA.replace('%alpha', trailItem.alpha);
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
    } else if (object.nVec && object.nVec.y > 0) {
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
    var secondFlare = Math.random() < config.fireWorks.secondaryFlare.chance;
    for (var i = 0; i < rocket.flares.length; i++) {
        var flare = rocket.flares[i];
        if (flare.eventFun == 1) {
            var colorSchemeTouse = flare.colorScheme;
            if (Math.random() < config.fireWorks.secondaryFlare.colorChangeChance) {
                // just for eva, no magenta and green combination
                do {
                    colorSchemeTouse = randomElement(colorSchemes);
                    if(colorSchemeTouse[0] == magenta[0] && flare.colorScheme[0] == green[0] || colorSchemeTouse[0] == green[0] && flare.colorScheme[0] == magenta[0]){
                        console.log('illegal... try again...')
                    }
                } while (colorSchemeTouse[0] == magenta[0] && flare.colorScheme[0] == green[0] || colorSchemeTouse[0] == green[0] && flare.colorScheme[0] == magenta[0]);
            }
            if(secondFlare) {
                flare.eventFun = function (flare, rocket) {
                    createFlare(flare, rocket, generateSecondaryFlare, config.fireWorks.secondaryFlare.flareAmount, colorSchemeTouse);
                }
            } else {
                flare.eventFun = undefined;
            }
        }
        slopeAct(flare, rocket)
    }
}

function rocketAct(rocket) {
    rocket.alpha *= 0.995;
    rocketSlopeParameter.firstPhase.ageChange = rocket.vel;
    rocket.eventFun = function (rocket, useless) {
        createFlare(rocket, rocket, generateDefaultFlare, config.fireWorks.flareCount, randomElement(colorSchemes));
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

function createFlare(object, parentObj, baseFlare, flareAmount, colorScheme) {
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
        newFlare.colorScheme = colorScheme;
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
