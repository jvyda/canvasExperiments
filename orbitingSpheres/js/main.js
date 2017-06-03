var ctx = {};
var canvas = {};

var animationId;

var mousePos = {};

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    orbitingSpheres: {
        fps: 60,
        gravitationalConstant: 6.67428e-11,
        timestep: 24 * 3600,
        AU: 149.6e6 * 1000,
        scale_factor_factor: 20,
        showNames: false
    }
};

config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;

var spheres = [];

function generateBasicPlanet() {
    var basePlanet = {};
    basePlanet.mass = 0;
    basePlanet.name = '';
    basePlanet.x = 0;
    basePlanet.y = 0;
    basePlanet.vx = 0;
    basePlanet.vy = 0;
    return basePlanet;
}

function createSpheres() {
    //var increment = 2 * Math.PI / config.orbitingSpheres.amount;
    //var currentArc = 0;
    //for (var i = 0; i < config.orbitingSpheres.amount; i++) {
    //    var sphere = {};
    //    sphere.arc = currentArc;
    //    sphere.mass = 100;
    //    sphere.vx = 0;
    //    sphere.vy = 0;
    //    sphere.x = mousePos.x + config.orbitingSpheres.spread * Math.cos(sphere.arc);
    //    sphere.y = mousePos.y + config.orbitingSpheres.spread * Math.sin(sphere.arc);
    //    spheres.push(sphere);
    //    currentArc += increment;
    //}
    mousePos.x = 0;
    mousePos.y = 0;

    var sun = generateBasicPlanet();
    sun.name = 'sun';
    sun.color = {
        r: 0xfc, g: 0x92, b: 0x01
    };
    sun.radius = 696342 * 1000;
    sun.mass = 1.98892 * Math.pow(10, 30);

    var merkur = generateBasicPlanet();
    merkur.name = 'mercury';
    merkur.color = {
        r: 0x8c, g: 0x86, b: 0x88
    };
    merkur.radius = 4879.4 * 1000;
    merkur.mass = 0.33011 * Math.pow(10, 24);
    merkur.x = 0.387 * config.orbitingSpheres.AU;
    merkur.vy = 47.36 * 1000;

    var venus = generateBasicPlanet();
    venus.name = 'venus';
    venus.color = {
        r: 0xde, g: 0xde, b: 0xd6
    };
    venus.radius = 12103.6 * 1000;
    venus.mass = 4.8685 * Math.pow(10, 24);
    venus.x = 0.723 * config.orbitingSpheres.AU;
    venus.vy = -35.02 * 1000;

    var earth = generateBasicPlanet();
    earth.name = 'earth';
    earth.color = {
        r: 0x37, g: 0x43, b: 0x5d
    };
    earth.radius = 12756.32 * 1000;
    earth.mass = 5.9742 * Math.pow(10, 24);
    earth.x = -1 * config.orbitingSpheres.AU;
    earth.vy = 29.783 * 1000;

    var mars = generateBasicPlanet();
    mars.name = 'mars';
    mars.color = {
        r: 0x8d, g: 0x5f, b: 0x3b
    };
    mars.radius = 6792.4 * 1000;
    mars.mass = 0.64171 * Math.pow(10, 24);
    mars.x = 1.524 * config.orbitingSpheres.AU;
    mars.vy = 24.07 * 1000;

    var jupiter = generateBasicPlanet();
    jupiter.name = 'jupiter';
    jupiter.color = {
        r: 0xa7, g: 0x8c, b: 0x77
    };
    jupiter.radius = 142984 * 1000;
    jupiter.mass = 1898.19 * Math.pow(10, 24);
    jupiter.x = 5.204 * config.orbitingSpheres.AU;
    jupiter.vy = 13.06 * 1000;

    var saturn = generateBasicPlanet();
    saturn.name = 'saturn';
    saturn.color = {
        r: 0xbf, g: 0xaa, b: 0x8d
    };
    saturn.radius = 120536 * 1000;
    saturn.mass = 568.34 * Math.pow(10, 24);
    saturn.x = 9.582 * config.orbitingSpheres.AU;
    saturn.vy = 9.68 * 1000;

    var uranus = generateBasicPlanet();
    uranus.name = 'uranus';
    uranus.color = {
        r: 0xaf, g: 0xd6, b: 0xdb
    };
    uranus.radius = 51118 * 1000;
    uranus.mass = 86.813 * Math.pow(10, 24);
    uranus.x = 19.201 * config.orbitingSpheres.AU;
    uranus.vy = 6.80 * 1000;

    var neptune = generateBasicPlanet();
    neptune.name = 'neptune';
    neptune.color = {
        r: 0x49, g: 0x79, b: 0xfd
    };
    neptune.radius = 49528 * 1000;
    neptune.mass = 102.413 * Math.pow(10, 24);
    neptune.x = 30.047 * config.orbitingSpheres.AU;
    neptune.vy = 5.43 * 1000;

    spheres.push(sun);
    spheres.push(merkur);
    spheres.push(venus);
    spheres.push(earth);
    spheres.push(mars);
    spheres.push(jupiter);
    spheres.push(saturn);
    spheres.push(uranus);
    spheres.push(neptune);
}

function attraction(sphere1, sphere2) {
    var dx = sphere1.x - sphere2.x;
    var dy = sphere1.y - sphere2.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist == 0) {
        return;
    }
    var force = config.orbitingSpheres.gravitationalConstant * sphere2.mass * sphere1.mass / (dist * dist);
    var theta = Math.atan2(dy, dx);
    return {fx: Math.cos(theta) * force, fy: Math.sin(theta) * force}
}

function sphereAct(sphere, parentIndex) {
    var totalForce = {
        fx: 0, fy: 0
    };
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        if (sphereI == parentIndex) {
            continue;
        }
        var forces = attraction(spheres[sphereI], sphere);
        if (forces) {
            totalForce.fx += forces.fx;
            totalForce.fy += forces.fy;
        }
    }
    sphere.force = totalForce;
}

function spheresAct() {
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        sphereAct(spheres[sphereI], sphereI);
    }
    for (var sphere2I = 0; sphere2I < spheres.length; sphere2I++) {
        var sphere = spheres[sphere2I];
        sphere.vx += sphere.force.fx / sphere.mass * config.orbitingSpheres.timestep;
        sphere.vy += sphere.force.fy / sphere.mass * config.orbitingSpheres.timestep;

        sphere.x += sphere.vx * config.orbitingSpheres.timestep;
        sphere.y += sphere.vy * config.orbitingSpheres.timestep;
    }
}

function printSphere(sphere) {
    console.log('name: ' + sphere.name + ' x: ' + sphere.x / config.orbitingSpheres.AU + ' y: ' + sphere.y / config.orbitingSpheres.AU + ' vx: ' + sphere.vx + ' vy:' + sphere.vy)
}

function updateCanvas() {
    ctx.clearRect(-config.size.width, -config.size.height, 2 * config.size.width, 2 * config.size.height);
    spheresAct();
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        ctx.beginPath();
        var sphere = spheres[sphereI];
        //printSphere(sphere);
        ctx.fillStyle = sphere.finalColor;
        if (config.orbitingSpheres.showNames) {
            ctx.fillText(sphere.name, sphere.x * config.orbitingSpheres.scale_factor, sphere.y * config.orbitingSpheres.scale_factor);
        }
        ctx.arc(sphere.x * config.orbitingSpheres.scale_factor, sphere.y * config.orbitingSpheres.scale_factor, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.orbitingSpheres.fps)
}

function setMousePos(event) {
    if (event.altKey) {
        addRandomPlanet();
        return;
    }
    mousePos = getMousePos(canvas, event);
    mousePos.x -= config.size.width / 2;
    mousePos.y -= config.size.height / 2;
    mousePos.x /= config.orbitingSpheres.scale_factor;
    mousePos.y /= config.orbitingSpheres.scale_factor;
    spheres[0].x = mousePos.x;
    spheres[0].y = mousePos.y;
}


$(document).ready(function () {
    var canvasJQuery = $("#canvas");
    canvas = canvasJQuery[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    canvasJQuery.css('background-color', 'rgba(0, 0, 0, 1)');
    canvas.addEventListener("click", setMousePos, false);
    ctx.fillStyle = 'red';
    ctx.translate(config.size.width / 2, config.size.height / 2);
    createSpheres();
    for (var i = 0; i < spheres.length; i++) {
        var sphere = spheres[i];
        sphere.finalColor = '#' + d2h(sphere.color.r) + d2h(sphere.color.g) + d2h(sphere.color.b);
    }

    canvasJQuery.on('wheel', mouseWheelEvent);
    // attach it to document, because of focus errors...
    document.onkeypress = keyPressed;
    requestAnimationFrame(updateCanvas);
});

function addRandomPlanet() {
    var newPlanet = generateBasicPlanet();
    newPlanet.name = spheres.length;
    newPlanet.color = {
        r: 255, g: 0, b: 0
    };
    newPlanet.mass = Math.random() * 1000 * Math.pow(10, 24);
    newPlanet.x = Math.random() * 10 * config.orbitingSpheres.AU + config.orbitingSpheres.AU / 2;
    newPlanet.vy = Math.random() * 30 * 1000;
    spheres.push(newPlanet)
}

function mouseWheelEvent(event) {
    if (!event.altKey) return;
    config.orbitingSpheres.scale_factor_factor += event.originalEvent.deltaY < 0 ? 1 : -1;
    config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;
    event.preventDefault()
}

function keyPressed(event) {
    if (event.keyCode == 110 || event.charCode == 110) {
        config.orbitingSpheres.showNames = !config.orbitingSpheres.showNames;
    }
}
