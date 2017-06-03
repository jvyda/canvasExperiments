var canvas;
var ctx;
var imageData = {};
var imageData_default;
var pointIndex = 0;

var animationId;

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    }
};

config.fireWorks = {
    fps: 60,
    flareDist: config.size.width / 8,
    minAlpha: 0.02,
    fallingSpeed: 0.1,
    trailAlphaFactor: 0.95,
    secondaryFlare: {
        flareAmount: 10,
        chance: 0.5,
        colorChangeChance: 0.5,
        longerFlareChance: 0.2,
        flareMinAge: config.size.height / 20,
        flareMaxAge: config.size.height / 10,
        initialVel: 3,
        radius: 1,
        // disabled, because not working, eventFun is undefined, so there is no difference between the explosion and it continues flying on
        // and it will stay on screen
        secondExplosionChance: 0
    },
    primaryFlare: {
        flareCount: 7,
        flareHeadChance: 0.4,
        flareHeadFactor: 1.5,
        flareMinAge: config.size.height / 20,
        flareMaxAge: config.size.height / 10,
        longerFlareChance: 0.1,
        initialVel: 3,
        radius: 2,
        // disabled, because lag switch
        secondExplosionChance: 0.0
    },
    rocket: {
        maxAge: config.size.height / 4,
        radius: 2,
        rocketHeadAlphaFactor: 0.995,
        secondExplosionChance: 0.2
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

colorSchemes.forEach(function (colorScheme) {
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
    defaultFlare.vel = config.fireWorks.primaryFlare.initialVel;
    defaultFlare.age = 0;
    defaultFlare.maxAge = randomNumberButAtLeast(config.fireWorks.primaryFlare.flareMinAge, config.fireWorks.primaryFlare.flareMinAge);
    defaultFlare.alpha = 1;
    defaultFlare.trail = [];
    defaultFlare.flares = [];
    defaultFlare.parameter = firstFlareParameter;
    defaultFlare.colorScheme = randomElement(colorSchemes);
    defaultFlare.eventFun = 1;
    defaultFlare.secondExplosion = Math.random() < config.fireWorks.primaryFlare.secondExplosionChance;
    defaultFlare.firstExplosionDone =  false;
    defaultFlare.secondExplosionDone = false;
    defaultFlare.radius = config.fireWorks.primaryFlare.radius;
    defaultFlare.postFun = defaultPostSlopeFun;
    return defaultFlare;
}


function generateSecondaryFlare() {
    var secondaryFlare = generateDefaultFlare();
    secondaryFlare.maxAge = randomNumberButAtLeast(config.fireWorks.secondaryFlare.flareMaxAge, config.fireWorks.secondaryFlare.flareMinAge);
    secondaryFlare.vel = config.fireWorks.secondaryFlare.initialVel;
    secondaryFlare.dead = false;
    secondaryFlare.secondExplosion = false;
    secondaryFlare.radius = config.fireWorks.secondaryFlare.radius;
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
        maxAge: config.fireWorks.rocket.maxAge,
        trail: [],
        flares: [],
        alpha: 1,
        color: randomElement(rocketColors),
        parameter: rocketSlopeParameter,
        postFun: defaultPostSlopeFun,
        colorSchemes: [randomElement(colorSchemes)],
        secondExplosion: Math.random() < config.fireWorks.rocket.secondExplosionChance,
        firstExplosionDone: false,
        secondExplosionDone: false,
        longerFlare: Math.random() < config.fireWorks.primaryFlare.longerFlareChance,
        longerSecondaryFlare: Math.random() < config.fireWorks.secondaryFlare.longerFlareChance
    };
    var colorSchemeToUse = colorSchemes[1];
    var secondColorSchemeToUse = colorSchemes[2];

    var illegal = false;
    if (Math.random() < config.fireWorks.secondaryFlare.colorChangeChance) {
        // just for eva, no magenta/red and green combination
        do {
            colorSchemeToUse = randomElement(colorSchemes);
            secondColorSchemeToUse = randomElement(colorSchemes);
            illegal = isIllegalColorTransition(colorSchemeToUse, rocket.colorSchemes[0]);
            illegal = illegal || isIllegalColorTransition(secondColorSchemeToUse, rocket.colorSchemes[0]);
            illegal = illegal || isIllegalColorTransition(colorSchemeToUse, secondColorSchemeToUse);
        } while (illegal);
    }
    rocket.colorSchemes.push(colorSchemeToUse);
    rocket.colorSchemes.push(secondColorSchemeToUse);
    converColorToRgbaWithAlphaPlaceholderStyle(rocket.color);

    if (Math.random() < config.fireWorks.primaryFlare.flareHeadChance) {
        rocket.drawHead = true;
    }
    rockets.push(rocket);
}

function renderFlareTrailItem(trailItem, flare) {
    if (trailItem.alpha < config.fireWorks.minAlpha)  return;
    var color = randomElement(flare.colorScheme);
    color.alpha = trailItem.alpha;
    setCoordinateToColor(trailItem.x << 0, trailItem.y << 0, color);
}

function setCoordinateToColor(x, y, color) {
    var indexForCoordinate = getIndexForCoordinate(x, y) << 0;
    imageData.data[indexForCoordinate] = color.r;
    imageData.data[indexForCoordinate + 1] = color.g;
    imageData.data[indexForCoordinate + 2] = color.b;
    imageData.data[indexForCoordinate + 3] = color.alpha *  255;
}

function drawRocket(rocket) {
    for(var rocketTailI = 0; rocketTailI < rocket.trail.length; rocketTailI++){
        var tailItem = rocket.trail[rocketTailI];
        if (tailItem.alpha < config.fireWorks.minAlpha)  continue;
        rocket.color.alpha = tailItem.alpha;
        setCoordinateToColor(tailItem.x << 0, tailItem.y << 0, rocket.color);
    }
    for(var mainFlareI = 0; mainFlareI < rocket.flares.length; mainFlareI++){
        var mainFlare = rocket.flares[mainFlareI];
        for(var mainFlareTrailI = 0; mainFlareTrailI < mainFlare.trail.length; mainFlareTrailI++){
            renderFlareTrailItem(mainFlare.trail[mainFlareTrailI], mainFlare)
        }
        for(var subFlareI = 0; subFlareI < mainFlare.flares.length; subFlareI++){
            var subFlare = mainFlare.flares[subFlareI];
            for(var subFlareTrailI = 0; subFlareTrailI < subFlare.trail.length; subFlareTrailI++){
                renderFlareTrailItem(subFlare.trail[subFlareTrailI], subFlare)
            }
        }
        if (!mainFlare.dead && rocket.drawHead) {
            var color = randomElement(mainFlare.colorScheme);
            color.alpha = mainFlare.alpha;
            for(var x_off = 0; x_off < mainFlare.radius * config.fireWorks.primaryFlare.flareHeadFactor; x_off++){
                for(var y_off = 0; y_off < mainFlare.radius * config.fireWorks.primaryFlare.flareHeadFactor; y_off++){
                    setCoordinateToColor( mainFlare.x + x_off << 0,  mainFlare.y + y_off << 0, color);
                }
            }
        }
    }
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
        } else {
            object.dead = true;
        }
        if (object.secondExplosion && !object.firstExplosionDone) {
            object.dead = false;
            object.firstExplosionDone = true;
            object.age = object.parameter.firstPhase.ageLimit;
            object.nVec.y = -Math.abs(object.nVec.y * 0.1);
            object.vel *= 0.5;
        }
        else if (object.secondExplosion && object.firstExplosionDone) {
            object.secondExplosionDone = true;
        }
    }
    object.postFun(object, parentObj);
}


function secondaryFlareEvent(flare, rocket) {
    flare.dead = true;
    var colorSchemeIndex = 1;
    if (rocket.secondExplosionDone) {
        colorSchemeIndex = 2;
    }
    createFlare(flare, generateSecondaryFlare, config.fireWorks.secondaryFlare.flareAmount,
        rocket.colorSchemes[colorSchemeIndex], {longerFlare: rocket.longerSecondaryFlare});
}

function explodedRocketAct(rocket) {
    var secondFlare = Math.random() < config.fireWorks.secondaryFlare.chance;
    for (var i = 0; i < rocket.flares.length; i++) {
        var flare = rocket.flares[i];
        if (flare.eventFun == 1) {
            if (secondFlare && !rocket.longerFlare) {
                flare.eventFun = secondaryFlareEvent;
            } else {
                flare.eventFun = undefined;
            }
        }
        slopeAct(flare, rocket);
        for (var subFlareI = 0; subFlareI < flare.flares.length; subFlareI++) {
            var subFlare = flare.flares[subFlareI];
            slopeAct(subFlare, flare);
            if (subFlare.trail.length == 0) {
                flare.flares.splice(subFlareI--, 1);
            }
        }
        if (flare.trail.length == 0 && flare.flares.length == 0) {
            rocket.flares.splice(i--, 1)
        }
    }
}

function schemesChangeFromTo(choosen, baseScheme, scheme1, scheme2) {
    return choosen[0] == scheme1[0] && baseScheme[0] == scheme2[0] || choosen[0] == scheme2[0] && baseScheme[0] == scheme1[0]
}

function isIllegalColorTransition(chosenScheme, baseScheme) {
    return schemesChangeFromTo(chosenScheme, baseScheme, green, red) || schemesChangeFromTo(chosenScheme, baseScheme, green, magenta);
}

function primaryFlareFunction(rocket, useless) {
    rocket.dead = true;
    var colorSchemeIndex = 0;
    if (rocket.firstExplosionDone) {
        colorSchemeIndex = 1;
    }
    createFlare(rocket, generateDefaultFlare, config.fireWorks.primaryFlare.flareCount,
        rocket.colorSchemes[colorSchemeIndex], {longerFlare: rocket.longerFlare});
}

function rocketAct(rocket) {
    rocket.alpha *= config.fireWorks.rocket.rocketHeadAlphaFactor;
    rocketSlopeParameter.firstPhase.ageChange = rocket.vel;
    rocket.eventFun = primaryFlareFunction;
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

function createFlare(object, baseFlare, flareAmount, colorScheme, parameter) {
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
        if (parameter.longerFlare) {
            newFlare.maxAge = randomNumberButAtLeast(config.size.height, config.size.height / 20);
        }
        newFlare.colorScheme = colorScheme;
        newFlare.nVec = normalizeVector(vec);
        newFlare.x = object.x;
        newFlare.y = object.y;

        object.flares.push(newFlare);
    }
}

function defaultPostSlopeFun(object) {
    if (!object.dead && object.y < config.size.height && object.x < config.size.width) {
        object.trail.push({x: object.x, y: object.y, alpha: object.alpha});
    }
    for (var trailIndex = 0; trailIndex < object.trail.length; trailIndex++) {
        var trailItem = object.trail[trailIndex];
        trailItem.y += config.fireWorks.fallingSpeed;
        trailItem.age++;
        trailItem.alpha *= config.fireWorks.trailAlphaFactor;
        if (trailItem.alpha < config.fireWorks.minAlpha) {
            object.trail.splice(trailIndex--, 1);
        }
    }
}


function updateCanvas() {
    for (var i = 0; i < rockets.length; i++) {
        var rocket = rockets[i];
        drawRocket(rocket);
        rocketAct(rocket);
        if (rocket.flares.length == 0 && rocket.trail.length == 0) {
            rockets.splice(i--, 1);
        }
    }

    ctx.putImageData(imageData, 0, 0);
    imageData.data.set(imageData_default.data);
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.fireWorks.fps)

}

function setPoint(event){
    if(pointIndex == 0){
        pointIndex++;
        setShaft(event)
    } else {
        pointIndex = 0;
        setTip(event);
    }
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
    imageData_default = ctx.getImageData(0, 0, config.size.width, config.size.height);
    imageData = ctx.getImageData(0, 0, config.size.width, config.size.height);
    requestAnimationFrame(updateCanvas);
});
