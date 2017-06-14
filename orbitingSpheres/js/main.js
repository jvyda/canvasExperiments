var ctx = {};
var canvas = {};

var animationId;

var mousePos = {};
var pastTime = 0;
var painted = [];

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
        // -1 means disabled
        trailStart: -1,
        showMoons: false,
        showHelp: true,
        scala: 1,
        baseTextSize: 12
    }
};

var lastDrag = {
    x: 0,
    y: 0
};

var toMove = {
    x: 0,
    y: 0
};

var scalePoint = {
    x: 0,
    y: 0
};

var currentTime = new Date() / 1000;
currentTime = Math.floor(currentTime / config.orbitingSpheres.timestep) * config.orbitingSpheres.timestep;

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
    basePlanet.trail = {};
    basePlanet.start = 0;
    basePlanet.isMoon = false;
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
    // used is data from 1.1.1970
    // commented out is data of 6. june 2017 00:00

    var sun = generateBasicPlanet();
    sun.name = 'sun';
    sun.color = {
        r: 0xfc, g: 0x92, b: 0x01
    };
    sun.radius = 696342 * 1000;
    sun.mass = 1.98892 * Math.pow(10, 30);
    sun.x = 4.306786483674715E-03 * config.orbitingSpheres.AU;
    sun.y = 1.837535134108785E-03 * config.orbitingSpheres.AU;
    sun.vx = auPerDayToMPerSecond(-1.819961544921342E-06);
    sun.vy = auPerDayToMPerSecond(5.304893809120167E-06);
    //sun.x = 2.850766546470957E-03 * config.orbitingSpheres.AU;
    //sun.y = 4.956963665727667E-03 * config.orbitingSpheres.AU;
    //sun.vx = auPerDayToMPerSecond(-4.226964281155967E-06);
    //sun.vy = auPerDayToMPerSecond(6.171203031582879E-06);

    var merkur = generateBasicPlanet();
    merkur.name = 'mercury';
    merkur.color = {
        r: 0x8c, g: 0x86, b: 0x88
    };
    merkur.radius = 4879.4 * 1000;
    merkur.mass = 0.33011 * Math.pow(10, 24);
    merkur.x = 2.608031036290285E-01 * config.orbitingSpheres.AU;
    merkur.y = 1.941548012009124E-01 * config.orbitingSpheres.AU;
    merkur.vx = auPerDayToMPerSecond(-2.240357151534085E-02);
    merkur.vy = auPerDayToMPerSecond(2.373852851400617E-02);
    //merkur.x = 3.563920740763323E-01 * config.orbitingSpheres.AU;
    //merkur.y = 5.717187678804200E-03 * config.orbitingSpheres.AU;
    //merkur.vx = auPerDayToMPerSecond(-5.498625279495372E-03);
    //merkur.vy = auPerDayToMPerSecond(2.939907891055230E-02);

    var venus = generateBasicPlanet();
    venus.name = 'venus';
    venus.color = {
        r: 0xde, g: 0xde, b: 0xd6
    };
    venus.radius = 12103.6 * 1000;
    venus.mass = 4.8685 * Math.pow(10, 24);
    venus.x = -3.163833272887579E-02 * config.orbitingSpheres.AU;
    venus.y = -7.240794841588817E-01 * config.orbitingSpheres.AU;
    venus.vx = auPerDayToMPerSecond(2.006306534672056E-02);
    venus.vy = auPerDayToMPerSecond(-1.072254244657087E-03);
    //venus.x = 3.714287363667594E-01 * config.orbitingSpheres.AU;
    //venus.y = -6.223065873025234E-01 * config.orbitingSpheres.AU;
    //venus.vx = auPerDayToMPerSecond(1.729787164697147E-02);
    //venus.vy = auPerDayToMPerSecond(1.018360946690303E-02);

    var earth = generateBasicPlanet();
    earth.name = 'earth';
    earth.color = {
        r: 0x37, g: 0x43, b: 0x5d
    };
    earth.radius = 12756.32 * 1000;
    earth.mass = 5.9742 * Math.pow(10, 24);
    earth.x = -1.762267229040138E-01 * config.orbitingSpheres.AU;
    earth.y = 9.684335265498731E-01 * config.orbitingSpheres.AU;
    earth.vx = auPerDayToMPerSecond(-1.719568902488065E-02);
    earth.vy = auPerDayToMPerSecond(-3.210508485900838E-03);
    //earth.x = -2.553538585508089E-01 * config.orbitingSpheres.AU;
    //earth.y = -9.763411304535361E-01 * config.orbitingSpheres.AU;
    //earth.vx = auPerDayToMPerSecond(1.635001487036944E-02);
    //earth.vy = auPerDayToMPerSecond(-4.430797621704561E-03);

    var mars = generateBasicPlanet();
    mars.name = 'mars';
    mars.color = {
        r: 0x8d, g: 0x5f, b: 0x3b
    };
    mars.radius = 6792.4 * 1000;
    mars.mass = 0.64171 * Math.pow(10, 24);
    mars.x = 1.330411585966007E+00 * config.orbitingSpheres.AU;
    mars.y = 4.980293609694482E-01 * config.orbitingSpheres.AU;
    mars.vx = auPerDayToMPerSecond(-4.366714270603195E-03);
    mars.vy = auPerDayToMPerSecond(1.430613222099020E-02);
    //mars.x = -2.841551665529732E-01 * config.orbitingSpheres.AU;
    //mars.y = 1.572607284356505E+00 * config.orbitingSpheres.AU;
    //mars.vx = auPerDayToMPerSecond(-1.323899118392277E-02);
    //mars.vy = auPerDayToMPerSecond(-1.324079074777860E-03);

    var jupiter = generateBasicPlanet();
    jupiter.name = 'jupiter';
    jupiter.color = {
        r: 0xa7, g: 0x8c, b: 0x77
    };
    jupiter.radius = 142984 * 1000;
    jupiter.mass = 1898.19 * Math.pow(10, 24);
    jupiter.x = -5.006795170315146E+00 * config.orbitingSpheres.AU;
    jupiter.y = -2.138374947442059E+00 * config.orbitingSpheres.AU;
    jupiter.vx = auPerDayToMPerSecond(2.875828128497038E-03);
    jupiter.vy = auPerDayToMPerSecond(-6.589043303100441E-03);
    //jupiter.x = -5.035296751383366E+00 * config.orbitingSpheres.AU;
    //jupiter.y = -2.079389405758550E+00 * config.orbitingSpheres.AU;
    //jupiter.vx = auPerDayToMPerSecond(2.792948935544964E-03);
    //jupiter.vy = auPerDayToMPerSecond(-6.616959801585691E-03);

    var saturn = generateBasicPlanet();
    saturn.name = 'saturn';
    saturn.color = {
        r: 0xbf, g: 0xaa, b: 0x8d
    };
    saturn.radius = 120536 * 1000;
    saturn.mass = 568.34 * Math.pow(10, 24);
    saturn.x = 7.242418412985283E+00 * config.orbitingSpheres.AU;
    saturn.y = 5.690983168845070E+00 * config.orbitingSpheres.AU;
    saturn.vx = auPerDayToMPerSecond(-3.748446012560828E-03);
    saturn.vy = auPerDayToMPerSecond(4.375007877712285E-03);
    //saturn.x = -1.052026933700409E+00 * config.orbitingSpheres.AU;
    //saturn.y = -9.994978492278472E+00 * config.orbitingSpheres.AU;
    //saturn.vx = auPerDayToMPerSecond(5.241668381800872E-03);
    //saturn.vy = auPerDayToMPerSecond(-6.012163316021670E-04);

    var uranus = generateBasicPlanet();
    uranus.name = 'uranus';
    uranus.color = {
        r: 0xaf, g: 0xd6, b: 0xdb
    };
    uranus.radius = 51118 * 1000;
    uranus.mass = 86.813 * Math.pow(10, 24);
    uranus.x = -1.820862604496443E+01 * config.orbitingSpheres.AU;
    uranus.y = -1.932694891138334E+00 * config.orbitingSpheres.AU;
    uranus.vx = auPerDayToMPerSecond(3.858506265054555E-04);
    uranus.vy = auPerDayToMPerSecond(-4.094769175075032E-03);
    //uranus.x = 1.808894256948102E+01 * config.orbitingSpheres.AU;
    //uranus.y = 8.362208575257883E+00 * config.orbitingSpheres.AU;
    //uranus.vx = auPerDayToMPerSecond(-1.679096933165243E-03);
    //uranus.vy = auPerDayToMPerSecond(3.386709085903006E-03);

    var neptune = generateBasicPlanet();
    neptune.name = 'neptune';
    neptune.color = {
        r: 0x49, g: 0x79, b: 0xfd
    };
    neptune.radius = 49528 * 1000;
    neptune.mass = 102.413 * Math.pow(10, 24);
    neptune.x = -1.555788564556409E+01 * config.orbitingSpheres.AU;
    neptune.y = -2.600847718335855E+01 * config.orbitingSpheres.AU;
    neptune.vx = auPerDayToMPerSecond(2.674515443607963E-03);
    neptune.vy = auPerDayToMPerSecond(-1.593013793405317E-03);
    //neptune.x = 2.849083024398218E+01 * config.orbitingSpheres.AU;
    //neptune.y = -9.221924603790701E+00 * config.orbitingSpheres.AU;
    //neptune.vx = auPerDayToMPerSecond(9.453663134275120E-04);
    //neptune.vy = auPerDayToMPerSecond(3.005146529509257E-03);

    var moon = generateBasicPlanet();
    moon.name = 'moon';
    moon.color = {
        r: 0x51, g: 0x4d, b: 0x4a
    };
    moon.radius = 1738 * 1000;
    moon.mass = 7.349 * Math.pow(10, 22);
    moon.x = -1.787960981527179E-01 * config.orbitingSpheres.AU;
    moon.y = 9.679289211958966E-01 * config.orbitingSpheres.AU;
    moon.vx = auPerDayToMPerSecond(-1.704844265352481E-02);
    moon.vy = auPerDayToMPerSecond(-3.765966714598013E-03);
    moon.labelPosition = -1;
    moon.isMoon = true;
    //moon.x = -2.575166907126450E-01 * config.orbitingSpheres.AU;
    //moon.y = -9.779348173678579E-01 * config.orbitingSpheres.AU;
    //moon.vx = auPerDayToMPerSecond(1.667315603093720E-02);
    //moon.vy = auPerDayToMPerSecond(-4.891796261925801E-03);

    var halley = generateBasicPlanet();
    halley.name = 'halley';
    halley.radius = 15.3 * 1000;
    halley.mass = 2 * Math.pow(10, 14);
    halley.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    halley.x = -1.225080419980852E+01 * config.orbitingSpheres.AU;
    halley.y = 2.336899481452066E+01 * config.orbitingSpheres.AU;
    halley.vx = auPerDayToMPerSecond(1.544740875115658E-03);
    halley.vy = auPerDayToMPerSecond(-1.511330565920587E-03);
    //halley.x = -2.045192296457553E+01 * config.orbitingSpheres.AU;
    //halley.y = 2.596711161357241E+01 * config.orbitingSpheres.AU;
    //halley.vx = auPerDayToMPerSecond(8.168960874672513E-05);
    //halley.vy = auPerDayToMPerSecond(7.556015133006348E-04);

    var hale = generateBasicPlanet();
    hale.name = 'hale-bopp';
    hale.radius = 60 * 1000;
    hale.mass = 1.3 * Math.pow(10, 16);
    hale.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    hale.x = 5.696327044162280E-01 * config.orbitingSpheres.AU;
    hale.y = -2.550145577199079E+00 * config.orbitingSpheres.AU;
    hale.vx = auPerDayToMPerSecond(-2.999393270108218E-03);
    hale.vy = auPerDayToMPerSecond(1.369574348073783E-02);
    hale.start = 844819200;

    var pluto = generateBasicPlanet();
    pluto.name = 'pluto';
    pluto.radius = 60 * 1000;
    pluto.mass = 1.303 * Math.pow(10, 22);
    pluto.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    pluto.x = -3.041812591647754E+01 * config.orbitingSpheres.AU;
    pluto.y = 2.124458945607829E+00 * config.orbitingSpheres.AU;
    pluto.vx = auPerDayToMPerSecond(3.651488253370403E-04);
    pluto.vy = auPerDayToMPerSecond(-3.322913885520158E-03);
    //pluto.x = 1.014124003514971E+01 * config.orbitingSpheres.AU;
    //pluto.y = -3.175483419042463E+01 * config.orbitingSpheres.AU;
    //pluto.vx = auPerDayToMPerSecond(3.051988326221818E-03);
    //pluto.vy = auPerDayToMPerSecond(3.040012335837204E-04);

    var ganymede = generateBasicPlanet();
    ganymede.name = 'ganymede';
    ganymede.radius = 2410.3 * 1000;
    ganymede.mass = 1.4819 * Math.pow(10, 23);
    ganymede.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    ganymede.x = -5.000294786793547E+00 * config.orbitingSpheres.AU;
    ganymede.y = -2.135368680550264E+00 * config.orbitingSpheres.AU;
    ganymede.vx = auPerDayToMPerSecond(2.383220743647819E-04);
    ganymede.vy = auPerDayToMPerSecond(-8.958091684038715E-04);
    ganymede.labelPosition = -2;
    ganymede.isMoon = true;

    var callisto = generateBasicPlanet();
    callisto.name = 'callisto';
    callisto.radius = 2410.3 * 1000;
    callisto.mass = 1.075938 * Math.pow(10, 22);
    callisto.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    callisto.x = -5.014316341820394E+00 * config.orbitingSpheres.AU;
    callisto.y = -2.148472290539929E+00 * config.orbitingSpheres.AU;
    callisto.vx = auPerDayToMPerSecond(6.692668019644409E-03);
    callisto.vy = auPerDayToMPerSecond(-9.386496662215376E-03);
    callisto.labelPosition = -1;
    callisto.isMoon = true;

    var io = generateBasicPlanet();
    io.name = 'io';
    io.radius = 1821.6 * 1000;
    io.mass = 8.931938 * Math.pow(10, 22);
    io.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    io.x = -5.008511875885199E+00 * config.orbitingSpheres.AU;
    io.y = -2.136136065783460E+00 * config.orbitingSpheres.AU;
    io.vx = auPerDayToMPerSecond(-5.037518522489916E-03);
    io.vy = auPerDayToMPerSecond(-1.269998455542522E-02);
    io.labelPosition = 1;
    io.isMoon = true;

    var europa = generateBasicPlanet();
    europa.name = 'europa';
    europa.radius = 1560.8 * 1000;
    europa.mass = 4.799844 * Math.pow(10, 22);
    europa.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    europa.x = -5.002337203223790E+00 * config.orbitingSpheres.AU;
    europa.y = -2.138506073413210E+00 * config.orbitingSpheres.AU;
    europa.vx = auPerDayToMPerSecond(3.046646081285037E-03);
    europa.vy = auPerDayToMPerSecond(1.387856950399271E-03);
    europa.labelPosition = 2;
    europa.isMoon = true;

    var titan = generateBasicPlanet();
    titan.name = 'titan';
    titan.radius = 2575.5 * 1000;
    titan.mass = 1.3452 * Math.pow(10, 23);
    titan.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    titan.x = 7.244673441696904E+00 * config.orbitingSpheres.AU;
    titan.y = 5.697951699427893E+00 * config.orbitingSpheres.AU;
    titan.vx = auPerDayToMPerSecond(-6.773623303111430E-03);
    titan.vy = auPerDayToMPerSecond(5.340185759944852E-03);
    titan.labelPosition = 1;
    titan.isMoon = true;

    var rhea = generateBasicPlanet();
    rhea.name = 'rhea';
    rhea.radius = 763.8 * 1000;
    rhea.mass = 2.306518 * Math.pow(10, 21);
    rhea.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    rhea.x = 7.245697542065474E+00 * config.orbitingSpheres.AU;
    rhea.y = 5.689741131978745E+00 * config.orbitingSpheres.AU;
    rhea.vx = auPerDayToMPerSecond(-2.019672008534346E-03);
    rhea.vy = auPerDayToMPerSecond(8.372192682197188E-03);
    rhea.labelPosition = -1;
    rhea.isMoon = true;

    var dione = generateBasicPlanet();
    dione.name = 'dione';
    dione.radius = 561.4 * 1000;
    dione.mass = 1.095452 * Math.pow(10, 21);
    dione.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    dione.x = 7.242265752517683E+00 * config.orbitingSpheres.AU;
    dione.y = 5.693216743415823E+00 * config.orbitingSpheres.AU;
    dione.vx = auPerDayToMPerSecond(-9.515946394951506E-03);
    dione.vy = auPerDayToMPerSecond(4.282691266876490E-03);
    dione.labelPosition = -1;
    dione.isMoon = true;


    //removed some spheres ... they go crazy and fly off....
    spheres.push(sun);
    spheres.push(merkur);
    spheres.push(venus);
    spheres.push(earth);
    spheres.push(moon);
    spheres.push(mars);
    spheres.push(jupiter);

    spheres.push(callisto);
    //spheres.push(ganymede);
    //spheres.push(io);
    //spheres.push(europa);

    spheres.push(saturn);

    spheres.push(titan);
    //spheres.push(rhea);
    //spheres.push(dione);

    spheres.push(uranus);
    spheres.push(neptune);

    spheres.push(pluto);

    spheres.push(halley);
    //spheres.push(hale);
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

        sphere.trail[pastTime] = {y: sphere.y, x: sphere.x, vx: sphere.vx, vy: sphere.vy};
    }
}

function drawSpherePoint(trailPoint) {
    if (!trailPoint) return;
    var xCoord = ~~(trailPoint.x * config.orbitingSpheres.scale_factor);
    var yCoord = ~~(trailPoint.y * config.orbitingSpheres.scale_factor);
    if (xCoord > config.size.width / 2 || yCoord > config.size.height / 2 || xCoord < -config.size.width / 2 || yCoord < -config.size.height / 2) return;
    if (painted.indexOf({x: xCoord, y: yCoord}) == -1) {
        ctx.beginPath();
        painted.push({x: xCoord, y: yCoord});
        ctx.arc(trailPoint.x * config.orbitingSpheres.scale_factor, trailPoint.y * config.orbitingSpheres.scale_factor, 1 / config.orbitingSpheres.scala, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawSpheres() {
    painted = [];
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        ctx.font = ~~(config.orbitingSpheres.baseTextSize / config.orbitingSpheres.scala + 1) + "px Arial";
        ctx.beginPath();
        var sphere = spheres[sphereI];
        //printSphere(sphere);
        ctx.fillStyle = sphere.finalColor;
        if (!sphere.trail[pastTime] || (!config.orbitingSpheres.showMoons && sphere.isMoon)) continue;
        if (config.orbitingSpheres.showNames) {
            ctx.fillText(sphere.name, (sphere.trail[pastTime].x + config.orbitingSpheres.labelOffset * sphere.labelPosition) * config.orbitingSpheres.scale_factor,
                (sphere.trail[pastTime].y + config.orbitingSpheres.AU / 10 * sphere.labelPosition) * config.orbitingSpheres.scale_factor);
        }
        ctx.fill();
        if (config.orbitingSpheres.trailStart != -1) {
            if (config.orbitingSpheres.timestep > 0) {
                for (var trailIndexForward = pastTime; trailIndexForward > config.orbitingSpheres.trailStart; trailIndexForward -= config.orbitingSpheres.timestep) {
                    drawSpherePoint(sphere.trail[trailIndexForward]);
                }
            } else {
                for (var trailIndexBackward = pastTime; trailIndexBackward < config.orbitingSpheres.trailStart; trailIndexBackward -= config.orbitingSpheres.timestep) {
                    drawSpherePoint(sphere.trail[trailIndexBackward]);
                }
            }
        }
        if (pastTime in sphere.trail) {
            drawSpherePoint(sphere.trail[pastTime]);
        }
    }
}

function everyBodyActed() {
    for (var index = 0; index < spheres.length; index++) {
        if (!(pastTime in spheres[index].trail)) {
            return false;
        }
    }
    return true;
}

function printHelp() {
    ctx.beginPath();
    var leftTopX = config.size.width / 2 - 150;
    var leftTopY = -config.size.height / 2 + 10;
    var fontOffset = ~~(config.orbitingSpheres.baseTextSize / config.orbitingSpheres.scala + 1);
    ctx.fillText('HELP:', leftTopX, leftTopY);
    ctx.fillText('[t] - show trails', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[n] - show names', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[m] - show moons', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[alt] + click - add planet', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[ctr] + click - set sun position', leftTopX, leftTopY += fontOffset);
    ctx.fillText('click & drag - move around', leftTopX, leftTopY += fontOffset);
    ctx.fillText('mouse wheel - zoom', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[left arrow] - go backward', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[right arrow] - go forward', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[r] - reset to today', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[h] - hide help', leftTopX, leftTopY += fontOffset);
}

function updateCanvas() {
    ctx.beginPath();
    ctx.translate(toMove.x, toMove.y);
    toMove.x = 0;
    toMove.y = 0;
    ctx.fillStyle = 'yellow';
    ctx.clearRect(-config.size.width, -config.size.height, 2 * config.size.width, 2 * config.size.height);
    ctx.fillText('Current time ' + formatDateTime(~~pastTime), -config.size.width / 2, -config.size.height / 2 + 50);
    ctx.fill();
    if(config.orbitingSpheres.showHelp){
        printHelp();
    }
    if (!everyBodyActed()) {
        spheresAct();
    } else {
        // the x values are used for the new calculation, they need to be reset (using the trail points for calculation led to bugs...)
        for (var i = 0; i < spheres.length; i++) {
            var sphere = spheres[i];
            var newCoord = sphere.trail[pastTime];
            if (!newCoord) continue;
            sphere.x = newCoord.x;
            sphere.y = newCoord.y;
            sphere.vy = newCoord.vy;
            sphere.vx = newCoord.vx;
        }
    }
    drawSpheres();
    setTimeout(function () {
        pastTime += config.orbitingSpheres.timestep;
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.orbitingSpheres.fps)
}

function simulatePast() {
    while(pastTime < currentTime) {
        spheresAct();
        pastTime += config.orbitingSpheres.timestep;
    }
    requestAnimationFrame(updateCanvas);
}

function setMousePos(event) {
    if (event.altKey) {
        addRandomPlanet();
    } else if (event.ctrlKey) {
        mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.orbitingSpheres.scale_factor;
        mousePos.y /= config.orbitingSpheres.scale_factor;
        spheres[0].x = mousePos.x;
        spheres[0].y = mousePos.y;
    }
}

var mouseDown = false;

function mouseClick(event){
    console.log('click')
    mouseDown = !mouseDown;
    if(mouseDown){
        var mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.orbitingSpheres.scala;
        mousePos.y /= config.orbitingSpheres.scala;
        lastDrag = mousePos;
    }
}

function drag(event){
    if(mouseDown){
        var mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.orbitingSpheres.scala;
        mousePos.y /= config.orbitingSpheres.scala;
        toMove.x += mousePos.x - lastDrag.x;
        toMove.y += mousePos.y - lastDrag.y;
        lastDrag = mousePos;
        console.log(origin)
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
    canvas.addEventListener("mousedown", mouseClick, false);
    canvas.addEventListener("mouseup", mouseClick, false);
    canvas.addEventListener("mousemove", drag, false);
    ctx.fillStyle = 'red';
    ctx.translate(config.size.width / 2, config.size.height / 2);
    createSpheres();
    for (var i = 0; i < spheres.length; i++) {
        convertColorToRgb(spheres[i]);
    }
    simulatePast();

    canvasJQuery.on('wheel', mouseWheelEvent);
    // attach it to document, because of focus errors...
    document.onkeypress = keyPressed;

    document.keydown = keyPressed;
});

$(document).keydown(keyPressed);

function addRandomPlanet() {
    var newPlanet = generateBasicPlanet();
    newPlanet.name = prompt("Name of the planet?", spheres.length + '');
    if(newPlanet.name == null) return;
    newPlanet.color = {
        r: roundedRandom(255), g: roundedRandom(255), b: roundedRandom(255)
    };

    newPlanet.mass = Math.random() * 1000 * Math.pow(10, 24);
    newPlanet.x = Math.random() * 10 * config.orbitingSpheres.AU + config.orbitingSpheres.AU / 2;
    newPlanet.vy = Math.random() * 30 * 1000;
    newPlanet.trail[pastTime] = {y: newPlanet.y, x: newPlanet.x, vx: newPlanet.vx, vy: newPlanet.vy};
    convertColorToRgb(newPlanet);
    spheres.push(newPlanet)
}

function mouseWheelEvent(event) {
    //config.orbitingSpheres.scale_factor_factor *= event.originalEvent.deltaY < 0 ? 1.1 : 0.9;
    //config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;
    scalePoint = getMousePos(canvas, event);
    scalePoint.x -= config.size.width / 2;
    scalePoint.y -= config.size.height / 2;
    scalePoint.x /= config.orbitingSpheres.scala;
    scalePoint.y /= config.orbitingSpheres.scala;
    var scaleTo = event.originalEvent.deltaY < 0 ? 1.1 : 1/1.1;
    config.orbitingSpheres.scala *= scaleTo;
    ctx.translate(scalePoint.x, scalePoint.y);
    ctx.scale(scaleTo, scaleTo);
    ctx.translate(-scalePoint.x, -scalePoint.y);
    event.preventDefault()
}

function eventIsKey(event, code) {
    return event.keyCode == code || event.charCode == code || event.which == code;
}

function keyPressed(event) {
    // n
    if (eventIsKey(event, 110)) {
        config.orbitingSpheres.showNames = !config.orbitingSpheres.showNames;
        // t
    } else if (eventIsKey(event, 116)) {
        if (config.orbitingSpheres.trailStart != -1) {
            config.orbitingSpheres.trailStart = -1;
        } else {
            config.orbitingSpheres.trailStart = pastTime;
        }
        // left
    } else if (eventIsKey(event, 37)) {
        if (config.orbitingSpheres.timestep > 0) {
            config.orbitingSpheres.timestep *= -1;
            //if trail and reverse, the next step the trail is gone
            if (config.orbitingSpheres.trailStart != -1) {
                config.orbitingSpheres.trailStart = pastTime;
            }
        }
        // right
    } else if (eventIsKey(event, 39)) {
        if (config.orbitingSpheres.timestep < 0) {
            config.orbitingSpheres.timestep *= -1;
            //if trail and reverse, the next step the trail is gone
            if (config.orbitingSpheres.trailStart != -1) {
                config.orbitingSpheres.trailStart = pastTime;
            }
        }
        // m
    } else if (eventIsKey(event, 109)) {
        config.orbitingSpheres.showMoons = !config.orbitingSpheres.showMoons;
        // h
    } else if(eventIsKey(event, 104)){
        config.orbitingSpheres.showHelp = !config.orbitingSpheres.showHelp;
    } else if(eventIsKey(event, 114)){
        pastTime = currentTime;
    }
}

function formatDateTime(input) {
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input));
    var date = epoch.toISOString();
    date = date.replace('T', ' ');
    return date.split('.')[0].split(' ')[0];
}
