var ctx = {};
var canvas = {};

var animationId;

var mousePos = {};
var time = 0;

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
        showNames: false,
        trails: false
    }
};

config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;
config.orbitingSpheres.labelOffset = config.orbitingSpheres.AU / 10;

var spheres = [];

function generateBasicPlanet() {
    var basePlanet = {};
    basePlanet.mass = 0;
    basePlanet.name = '';
    basePlanet.x = 0;
    basePlanet.y = 0;
    basePlanet.vx = 0;
    basePlanet.vy = 0;
    basePlanet.labelPosition = 0;
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
    // data of 6. june 2017 00:00

    var sun = generateBasicPlanet();
    sun.name = 'sun';
    sun.color = {
        r: 0xfc, g: 0x92, b: 0x01
    };
    sun.radius = 696342 * 1000;
    sun.mass = 1.98892 * Math.pow(10, 30);
    sun.x = 2.850766546470957E-03 * config.orbitingSpheres.AU;
    sun.y = 4.956963665727667E-03 * config.orbitingSpheres.AU;
    sun.vx = auPerDayToMPerSecond(-4.226964281155967E-06);
    sun.vy = auPerDayToMPerSecond(6.171203031582879E-06);

    var merkur = generateBasicPlanet();
    merkur.name = 'mercury';
    merkur.color = {
        r: 0x8c, g: 0x86, b: 0x88
    };
    merkur.radius = 4879.4 * 1000;
    merkur.mass = 0.33011 * Math.pow(10, 24);
    merkur.x = 3.563920740763323E-01 * config.orbitingSpheres.AU;
    merkur.y = 5.717187678804200E-03 * config.orbitingSpheres.AU;
    merkur.vx = auPerDayToMPerSecond(-5.498625279495372E-03);
    merkur.vy = auPerDayToMPerSecond(2.939907891055230E-02);

    var venus = generateBasicPlanet();
    venus.name = 'venus';
    venus.color = {
        r: 0xde, g: 0xde, b: 0xd6
    };
    venus.radius = 12103.6 * 1000;
    venus.mass = 4.8685 * Math.pow(10, 24);
    venus.x = 3.714287363667594E-01 * config.orbitingSpheres.AU;
    venus.y = -6.223065873025234E-01 * config.orbitingSpheres.AU;
    venus.vx = auPerDayToMPerSecond(1.729787164697147E-02);
    venus.vy = auPerDayToMPerSecond(1.018360946690303E-02);

    var earth = generateBasicPlanet();
    earth.name = 'earth';
    earth.color = {
        r: 0x37, g: 0x43, b: 0x5d
    };
    earth.radius = 12756.32 * 1000;
    earth.mass = 5.9742 * Math.pow(10, 24);
    earth.x = -2.553538585508089E-01 * config.orbitingSpheres.AU;
    earth.y = -9.763411304535361E-01 * config.orbitingSpheres.AU;
    earth.vx = auPerDayToMPerSecond(1.635001487036944E-02);
    earth.vy = auPerDayToMPerSecond(-4.430797621704561E-03);

    var mars = generateBasicPlanet();
    mars.name = 'mars';
    mars.color = {
        r: 0x8d, g: 0x5f, b: 0x3b
    };
    mars.radius = 6792.4 * 1000;
    mars.mass = 0.64171 * Math.pow(10, 24);
    mars.x = -2.841551665529732E-01 * config.orbitingSpheres.AU;
    mars.y = 1.572607284356505E+00 * config.orbitingSpheres.AU;
    mars.vx = auPerDayToMPerSecond(-1.323899118392277E-02);
    mars.vy = auPerDayToMPerSecond(-1.324079074777860E-03);

    var jupiter = generateBasicPlanet();
    jupiter.name = 'jupiter';
    jupiter.color = {
        r: 0xa7, g: 0x8c, b: 0x77
    };
    jupiter.radius = 142984 * 1000;
    jupiter.mass = 1898.19 * Math.pow(10, 24);
    jupiter.x = -5.035296751383366E+00 * config.orbitingSpheres.AU;
    jupiter.y = -2.079389405758550E+00 * config.orbitingSpheres.AU;
    jupiter.vx = auPerDayToMPerSecond(2.792948935544964E-03);
    jupiter.vy = auPerDayToMPerSecond(-6.616959801585691E-03);

    var saturn = generateBasicPlanet();
    saturn.name = 'saturn';
    saturn.color = {
        r: 0xbf, g: 0xaa, b: 0x8d
    };
    saturn.radius = 120536 * 1000;
    saturn.mass = 568.34 * Math.pow(10, 24);
    saturn.x = -1.052026933700409E+00 * config.orbitingSpheres.AU;
    saturn.y = -9.994978492278472E+00 * config.orbitingSpheres.AU;
    saturn.vx = auPerDayToMPerSecond(5.241668381800872E-03);
    saturn.vy = auPerDayToMPerSecond(-6.012163316021670E-04);

    var uranus = generateBasicPlanet();
    uranus.name = 'uranus';
    uranus.color = {
        r: 0xaf, g: 0xd6, b: 0xdb
    };
    uranus.radius = 51118 * 1000;
    uranus.mass = 86.813 * Math.pow(10, 24);
    uranus.x = 1.808894256948102E+01 * config.orbitingSpheres.AU;
    uranus.y = 8.362208575257883E+00 * config.orbitingSpheres.AU;
    uranus.vx = auPerDayToMPerSecond(-1.679096933165243E-03);
    uranus.vy = auPerDayToMPerSecond(3.386709085903006E-03);

    var neptune = generateBasicPlanet();
    neptune.name = 'neptune';
    neptune.color = {
        r: 0x49, g: 0x79, b: 0xfd
    };
    neptune.radius = 49528 * 1000;
    neptune.mass = 102.413 * Math.pow(10, 24);
    neptune.x = 2.849083024398218E+01 * config.orbitingSpheres.AU;
    neptune.y = -9.221924603790701E+00 * config.orbitingSpheres.AU;
    neptune.vx = auPerDayToMPerSecond(9.453663134275120E-04);
    neptune.vy = auPerDayToMPerSecond(3.005146529509257E-03);

    var moon = generateBasicPlanet();
    moon.name = 'moon';
    moon.color = {
        r: 0x51, g: 0x4d, b: 0x4a
    };
    moon.radius = 1738 * 1000;
    moon.mass = 7.349 * Math.pow(10, 22);
    moon.x = -2.575166907126450E-01 * config.orbitingSpheres.AU;
    moon.y = -9.779348173678579E-01 * config.orbitingSpheres.AU;
    moon.vx = auPerDayToMPerSecond(1.667315603093720E-02);
    moon.vy = auPerDayToMPerSecond(-4.891796261925801E-03);
    moon.labelPosition = -1;

    var halley = generateBasicPlanet();
    halley.name = 'halley';
    halley.radius = 15.3 * 1000;
    halley.mass = 2 * Math.pow(10, 14);
    halley.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    halley.x = -2.045192296457553E+01 * config.orbitingSpheres.AU;
    halley.y = 2.596711161357241E+01 * config.orbitingSpheres.AU;
    halley.vx = auPerDayToMPerSecond(8.168960874672513E-05);
    halley.vy = auPerDayToMPerSecond(7.556015133006348E-04);

    var hale = generateBasicPlanet();
    hale.name = 'hale-bopp';
    hale.radius = 60 * 1000;
    hale.mass = 1.3 * Math.pow(10, 16);
    hale.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    hale.x = 3.147734450822550E+00 * config.orbitingSpheres.AU;
    hale.y = -1.599685285595860E+01 * config.orbitingSpheres.AU;
    hale.vx = auPerDayToMPerSecond(4.025449982019777E-04);
    hale.vy = auPerDayToMPerSecond(-1.963599893518909E-03);

    var pluto = generateBasicPlanet();
    pluto.name = 'pluto';
    pluto.radius = 60 * 1000;
    pluto.mass = 1.303 * Math.pow(10, 22);
    pluto.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    pluto.x = 1.014124003514971E+01 * config.orbitingSpheres.AU;
    pluto.y = -3.175483419042463E+01 * config.orbitingSpheres.AU;
    pluto.vx = auPerDayToMPerSecond(3.051988326221818E-03);
    pluto.vy = auPerDayToMPerSecond(3.040012335837204E-04);

    spheres.push(sun);
    spheres.push(merkur);
    spheres.push(venus);
    spheres.push(earth);
    spheres.push(moon);
    spheres.push(mars);
    spheres.push(jupiter);
    spheres.push(saturn);
    spheres.push(uranus);
    spheres.push(neptune);

    spheres.push(pluto);

    spheres.push(halley);
    spheres.push(hale);
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
    if(!config.orbitingSpheres.trails){
        ctx.clearRect(-config.size.width, -config.size.height, 2 * config.size.width, 2 * config.size.height);
    }
    spheresAct();
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        ctx.beginPath();
        var sphere = spheres[sphereI];
        //printSphere(sphere);
        ctx.fillStyle = sphere.finalColor;
        if (config.orbitingSpheres.showNames) {
            ctx.fillText(sphere.name, (sphere.x + config.orbitingSpheres.labelOffset * sphere.labelPosition) * config.orbitingSpheres.scale_factor, (sphere.y + config.orbitingSpheres.AU / 10 * sphere.labelPosition) * config.orbitingSpheres.scale_factor);
        }
        ctx.arc(sphere.x * config.orbitingSpheres.scale_factor, sphere.y * config.orbitingSpheres.scale_factor, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
    setTimeout(function () {
        time += config.orbitingSpheres.timestep;
        console.log(time / (365 * 24 * 3600) + ' years');
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.orbitingSpheres.fps)
}

function setMousePos(event) {
    if (event.altKey) {
        addRandomPlanet();
    } else if(event.ctrlKey) {
        mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.orbitingSpheres.scale_factor;
        mousePos.y /= config.orbitingSpheres.scale_factor;
        spheres[0].x = mousePos.x;
        spheres[0].y = mousePos.y;
    }
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
        convertColorToRgb(spheres[i]);
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
        r: roundedRandom(255), g: roundedRandom(255), b: roundedRandom(255)
    };

    newPlanet.mass = Math.random() * 1000 * Math.pow(10, 24);
    newPlanet.x = Math.random() * 10 * config.orbitingSpheres.AU + config.orbitingSpheres.AU / 2;
    newPlanet.vy = Math.random() * 30 * 1000;
    convertColorToRgb(newPlanet);
    spheres.push(newPlanet)
}

function mouseWheelEvent(event) {
    if (!event.altKey) return;
    config.orbitingSpheres.scale_factor_factor += event.originalEvent.deltaY < 0 ? 1 : -1;
    config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;
    event.preventDefault()
}

function eventIsKey(event, code) {
    return event.keyCode == code || event.charCode == code;
}

function keyPressed(event) {
    if (eventIsKey(event, 110)) {
        config.orbitingSpheres.showNames = !config.orbitingSpheres.showNames;
    } else if (eventIsKey(event, 116)) {
        config.orbitingSpheres.trails = !config.orbitingSpheres.trails;
    }
}
