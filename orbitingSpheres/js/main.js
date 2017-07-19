var ctx = {};
var canvas = {};

var animationId;

var mousePos = {};
var painted = [];

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    orbitingSpheres: {
        fps: 60,
        gravitationalConstant: 6.67428e-11,
        timestep: 1 * 3600,
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

var currentTime = new Date() / 1000 - 18 * 24 * 3600 - 25 * 24 * 3600 - 20 * 3600;
currentTime = Math.floor(currentTime / config.orbitingSpheres.timestep) * config.orbitingSpheres.timestep;

config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;
config.orbitingSpheres.labelOffset = config.orbitingSpheres.AU / 10;


// 6. june 0:00
var pastTime = 1496707200;

var spheres = [];

function generateBasicPlanet() {
    var basePlanet = {};
    basePlanet.mass = 0;
    basePlanet.name = '';
    basePlanet.x = 0;
    basePlanet.y = 0;
    basePlanet.z = 0;
    basePlanet.vx = 0;
    basePlanet.vy = 0;
    basePlanet.vz = 0;
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
    // used is data from 6.6.2017 0:00
    // commented out is data of 1.1.1970 00:00

    var sun = generateBasicPlanet();
    sun.name = 'sun';
    sun.color = {
        r: 0xfc, g: 0x92, b: 0x01
    };
    sun.radius = 696342 * 1000;
    sun.mass = 1.98892 * Math.pow(10, 30);
    sun.x = 2.850766546470957E-03 * config.orbitingSpheres.AU;
    sun.y = 4.956963665727667E-03 * config.orbitingSpheres.AU;
    sun.z = -1.444369038454740E-04 * config.orbitingSpheres.AU;
    sun.vx = auPerDayToMPerSecond(-4.226964281155967E-06);
    sun.vy = auPerDayToMPerSecond(6.171203031582879E-06);
    sun.vz = auPerDayToMPerSecond(9.439081475650780E-08);

    var merkur = generateBasicPlanet();
    merkur.name = 'mercury';
    merkur.color = {
        r: 0x8c, g: 0x86, b: 0x88
    };
    merkur.radius = 4879.4 * 1000;
    merkur.mass = 3.3011 * Math.pow(10, 23);
    merkur.x = 3.563920740763323E-01 * config.orbitingSpheres.AU;
    merkur.y = 5.717187678804200E-03 * config.orbitingSpheres.AU;
    merkur.z = -3.251628630906487E-02 * config.orbitingSpheres.AU;
    merkur.vx = auPerDayToMPerSecond(-5.498625279495372E-03);
    merkur.vy = auPerDayToMPerSecond(2.939907891055230E-02);
    merkur.vz = auPerDayToMPerSecond(2.905916882777411E-03);

    var venus = generateBasicPlanet();
    venus.name = 'venus';
    venus.color = {
        r: 0xde, g: 0xde, b: 0xd6
    };
    venus.radius = 12103.6 * 1000;
    venus.mass = 4.8675 * Math.pow(10, 24);
    venus.x = 3.714287363667594E-01 * config.orbitingSpheres.AU;
    venus.y = -6.223065873025234E-01 * config.orbitingSpheres.AU;
    venus.z = -3.001784089847719E-02 * config.orbitingSpheres.AU;
    venus.vx = auPerDayToMPerSecond(1.729787164697147E-02);
    venus.vy = auPerDayToMPerSecond(1.018360946690303E-02);
    venus.vz = auPerDayToMPerSecond(-8.587441076085737E-04);

    var earth = generateBasicPlanet();
    earth.name = 'earth';
    earth.color = {
        r: 0x37, g: 0x43, b: 0x5d
    };
    earth.radius = 12756.32 * 1000;
    earth.mass = 5.97237 * Math.pow(10, 24);
    earth.x = -2.553538585508089E-01 * config.orbitingSpheres.AU;
    earth.y = -9.763411304535361E-01 * config.orbitingSpheres.AU;
    earth.z = -1.052513783569142E-04 * config.orbitingSpheres.AU;
    earth.vx = auPerDayToMPerSecond(1.635001487036944E-02);
    earth.vy = auPerDayToMPerSecond(-4.430797621704561E-03);
    earth.vz = auPerDayToMPerSecond(-2.101776519643229E-08);

    var mars = generateBasicPlanet();
    mars.name = 'mars';
    mars.color = {
        r: 0x8d, g: 0x5f, b: 0x3b
    };
    mars.radius = 6792.4 * 1000;
    mars.mass = 6.4171 * Math.pow(10, 23);
    mars.x = -2.841551665529732E-01 * config.orbitingSpheres.AU;
    mars.y = 1.572607284356505E+00 * config.orbitingSpheres.AU;
    mars.z = 3.975013478435811E-02 * config.orbitingSpheres.AU;
    mars.vx = auPerDayToMPerSecond(-1.323899118392277E-02);
    mars.vy = auPerDayToMPerSecond(-1.324079074777860E-03);
    mars.vz = auPerDayToMPerSecond(2.970233768304195E-04);

    var jupiter = generateBasicPlanet();
    jupiter.name = 'jupiter';
    jupiter.color = {
        r: 0xa7, g: 0x8c, b: 0x77
    };
    jupiter.radius = 142984 * 1000;
    jupiter.mass = 1.8986 * Math.pow(10, 27);
    jupiter.x = -5.035296751383366E+00 * config.orbitingSpheres.AU;
    jupiter.y = -2.079389405758550E+00 * config.orbitingSpheres.AU;
    jupiter.z = 1.212458388046286E-01 * config.orbitingSpheres.AU;
    jupiter.vx = auPerDayToMPerSecond(2.792948935544964E-03);
    jupiter.vy = auPerDayToMPerSecond(-6.616959801585691E-03);
    jupiter.vz = auPerDayToMPerSecond(-3.497144769094454E-05);

    var saturn = generateBasicPlanet();
    saturn.name = 'saturn';
    saturn.color = {
        r: 0xbf, g: 0xaa, b: 0x8d
    };
    saturn.radius = 120536 * 1000;
    saturn.mass = 568.34 * Math.pow(10, 24);
    saturn.x = -1.052026933700409E+00 * config.orbitingSpheres.AU;
    saturn.y = -9.994978492278472E+00 * config.orbitingSpheres.AU;
    saturn.z = 2.156536677039137E-01 * config.orbitingSpheres.AU;
    saturn.vx = auPerDayToMPerSecond(5.241668381800872E-03);
    saturn.vy = auPerDayToMPerSecond(-6.012163316021670E-04);
    saturn.vz = auPerDayToMPerSecond(-1.984428527740341E-04);

    var uranus = generateBasicPlanet();
    uranus.name = 'uranus';
    uranus.color = {
        r: 0xaf, g: 0xd6, b: 0xdb
    };
    uranus.radius = 26000 * 1000;
    uranus.mass = 8.6810 * Math.pow(10, 25);
    uranus.x = 1.808894256948102E+01 * config.orbitingSpheres.AU;
    uranus.y = 8.362208575257883E+00 * config.orbitingSpheres.AU;
    uranus.z = -2.032877227125995E-01 * config.orbitingSpheres.AU;
    uranus.vx = auPerDayToMPerSecond(-1.679096933165243E-03);
    uranus.vy = auPerDayToMPerSecond(3.386709085903006E-03);
    uranus.vz = auPerDayToMPerSecond(3.424044542155598E-05);

    var neptune = generateBasicPlanet();
    neptune.name = 'neptune';
    neptune.color = {
        r: 0x49, g: 0x79, b: 0xfd
    };
    neptune.radius = 49528 * 1000;
    neptune.mass = 1.0243 * Math.pow(10, 26);
    neptune.x = 2.849083024398218E+01 * config.orbitingSpheres.AU;
    neptune.y = -9.221924603790701E+00 * config.orbitingSpheres.AU;
    neptune.z = -4.666923015623424E-01 * config.orbitingSpheres.AU;
    neptune.vx = auPerDayToMPerSecond(9.453663134275120E-04);
    neptune.vy = auPerDayToMPerSecond(3.005146529509257E-03);
    neptune.vz = auPerDayToMPerSecond(-8.341370560621744E-05);

    var moon = generateBasicPlanet();
    moon.name = 'moon';
    moon.color = {
        r: 0x51, g: 0x4d, b: 0x4a
    };
    moon.radius = 1738 * 1000;
    moon.mass = 7.342 * Math.pow(10, 22);
    moon.labelPosition = -1;
    moon.isMoon = true;
    moon.x = -2.575166907126450E-01 * config.orbitingSpheres.AU;
    moon.y = -9.779348173678579E-01 * config.orbitingSpheres.AU;
    moon.z = 1.160472013440968E-04 * config.orbitingSpheres.AU;
    moon.vx = auPerDayToMPerSecond(1.667315603093720E-02);
    moon.vy = auPerDayToMPerSecond(-4.891796261925801E-03);
    moon.vz = auPerDayToMPerSecond(1.856253978047449E-05);

    var halley = generateBasicPlanet();
    halley.name = 'halley';
    halley.radius = 15.3 * 1000;
    halley.mass = 2.2 * Math.pow(10, 14);
    halley.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    halley.x = -2.045192296457553E+01 * config.orbitingSpheres.AU;
    halley.y = 2.596711161357241E+01 * config.orbitingSpheres.AU;
    halley.z = -9.905915924770314E+00 * config.orbitingSpheres.AU;
    halley.vx = auPerDayToMPerSecond(8.168960874672513E-05);
    halley.vy = auPerDayToMPerSecond(7.556015133006348E-04);
    halley.vz = auPerDayToMPerSecond(-1.028407459053017E-04);

    var hale = generateBasicPlanet();
    hale.name = 'hale-bopp';
    hale.radius = 60 * 1000;
    hale.mass = 1.3 * Math.pow(10, 16);
    hale.color = {
        r: 0xff, g: 0xff, b: 0xff
    };
    hale.x = 3.147734450822550E+00 * config.orbitingSpheres.AU;
    hale.y = -1.599685285595860E+01 * config.orbitingSpheres.AU;
    hale.z = -3.631228356343570E+01 * config.orbitingSpheres.AU;
    hale.vx = auPerDayToMPerSecond(4.025449982019777E-04);
    hale.vy = auPerDayToMPerSecond(-1.963599893518909E-03);
    hale.vz = auPerDayToMPerSecond(-3.035345413770859E-03);
    hale.start = 844819200;

    var pluto = generateBasicPlanet();
    pluto.name = 'pluto';
    pluto.radius = 60 * 1000;
    pluto.mass = 1.303 * Math.pow(10, 22);
    pluto.color = {
        r: 0xb2, g: 0xaa, b: 0x9d
    };
    pluto.x = 1.014124003514971E+01 * config.orbitingSpheres.AU;
    pluto.y = -3.175483419042463E+01 * config.orbitingSpheres.AU;
    pluto.z = 4.645108131789219E-01 * config.orbitingSpheres.AU;
    pluto.vx = auPerDayToMPerSecond(3.051988326221818E-03);
    pluto.vy = auPerDayToMPerSecond(3.040012335837204E-04);
    pluto.vz = auPerDayToMPerSecond(-9.034090662794829E-04);

    var ganymede = generateBasicPlanet();
    ganymede.name = 'ganymede';
    ganymede.radius = 2410.3 * 1000;
    ganymede.mass = 1.4819 * Math.pow(10, 23);
    ganymede.color = {
        r: 0x8c, g: 0x7c, b: 0x6c
    };
    ganymede.x = -5.038545162105024E+00 * config.orbitingSpheres.AU;
    ganymede.y = -2.073001766415427E+00 * config.orbitingSpheres.AU;
    ganymede.z =  1.214444510403471E-01 * config.orbitingSpheres.AU;
    ganymede.vx = auPerDayToMPerSecond(-2.802399876020957E-03);
    ganymede.vy = auPerDayToMPerSecond(-9.445554901806956E-03);
    ganymede.vz = auPerDayToMPerSecond(-2.158793174958044E-04);
    ganymede.labelPosition = -2;
    ganymede.isMoon = true;

    var callisto = generateBasicPlanet();
    callisto.name = 'callisto';
    callisto.radius = 2410.3 * 1000;
    callisto.mass = 1.075938 * Math.pow(10, 23);
    callisto.color = {
        r: 0xaa, g: 0xa1, b: 0x92
    };
    callisto.x = -5.043546136432461E+00 * config.orbitingSpheres.AU;
    callisto.y = -2.088970248927962E+00 * config.orbitingSpheres.AU;
    callisto.z = 1.208319766139647E-01 * config.orbitingSpheres.AU;
    callisto.vx = auPerDayToMPerSecond(6.380893216887173E-03);
    callisto.vy = auPerDayToMPerSecond(-9.672660525049762E-03);
    callisto.vz = auPerDayToMPerSecond(-8.392504518043012E-05);
    callisto.labelPosition = -1;
    callisto.isMoon = true;

    var io = generateBasicPlanet();
    io.name = 'io';
    io.radius = 1821.6 * 1000;
    io.mass = 8.931938 * Math.pow(10, 22);
    io.color = {
        r: 0xfc, g: 0xfc, b: 0x8c
    };
    io.x = -5.033395021092241E+00 * config.orbitingSpheres.AU;
    io.y = -2.077324466186377E+00 * config.orbitingSpheres.AU;
    io.z = 1.213462690631602E-01 * config.orbitingSpheres.AU;
    io.vx = auPerDayToMPerSecond(-4.588618536023535E-03);
    io.vy = auPerDayToMPerSecond(2.016343119445475E-04);
    io.vz = auPerDayToMPerSecond(1.026701978370372E-04);
    io.labelPosition = 1;
    io.isMoon = true;

    var europa = generateBasicPlanet();
    europa.name = 'europa';
    europa.radius = 1560.8 * 1000;
    europa.mass = 4.799844 * Math.pow(10, 22);
    europa.color = {
        r: 0xbc, g: 0x94, b: 0x61
    };
    europa.x = -5.031515268951983E+00 * config.orbitingSpheres.AU;
    europa.y = -2.076909297177093E+00 * config.orbitingSpheres.AU;
    europa.z = 1.214212115321035E-01 * config.orbitingSpheres.AU;
    europa.vx = auPerDayToMPerSecond(-1.539101640693913E-03);
    europa.vy = auPerDayToMPerSecond(-5.365528961176684E-05);
    europa.vz = auPerDayToMPerSecond(1.724641804134938E-04);
    europa.labelPosition = 2;
    europa.isMoon = true;

    var titan = generateBasicPlanet();
    titan.name = 'titan';
    titan.radius = 2575.5 * 1000;
    titan.mass = 1.3452 * Math.pow(10, 23);
    titan.color = {
        r: 0xe1, g: 0xc4, b: 0x71
    };
    titan.x = -1.059235736139216E+00 * config.orbitingSpheres.AU;
    titan.y = -9.998348099923559E+00 * config.orbitingSpheres.AU;
    titan.z = 2.181058505306635E-01 * config.orbitingSpheres.AU;
    titan.vx = auPerDayToMPerSecond(6.853875311363549E-03);
    titan.vy = auPerDayToMPerSecond(-3.075089450150591E-03);
    titan.vz = auPerDayToMPerSecond(9.166319520668074E-04);
    titan.labelPosition = 1;
    titan.isMoon = true;

    var rhea = generateBasicPlanet();
    rhea.name = 'rhea';
    rhea.radius = 763.8 * 1000;
    rhea.mass = 2.306518 * Math.pow(10, 21);
    rhea.color = {
        r: 0xa0, g: 0xa0, b: 0xa0
    };
    rhea.x = -1.055074560884458E+00 * config.orbitingSpheres.AU;
    rhea.y = -9.996421454730990E+00 * config.orbitingSpheres.AU;
    rhea.z = 2.166812678080307E-01 * config.orbitingSpheres.AU;
    rhea.vx = auPerDayToMPerSecond(7.673546925478059E-03);
    rhea.vy = auPerDayToMPerSecond(-4.462020056778185E-03);
    rhea.vz = auPerDayToMPerSecond(1.581959501854047E-03);
    rhea.labelPosition = -1;
    rhea.isMoon = true;

    var dione = generateBasicPlanet();
    dione.name = 'dione';
    dione.radius = 561.4 * 1000;
    dione.mass = 1.095452 * Math.pow(10, 21);
    dione.color = {
        r: 0x88, g: 0x88, b: 0x88
    };
    dione.x = -1.053520439143635E+00 * config.orbitingSpheres.AU;
    dione.y = -9.996714998865288E+00 * config.orbitingSpheres.AU;
    dione.z = 2.167075374650221E-01 * config.orbitingSpheres.AU;
    dione.vx = auPerDayToMPerSecond(9.877997376464179E-03);
    dione.vy = auPerDayToMPerSecond(-3.845177625540359E-03);
    dione.vz = auPerDayToMPerSecond(1.054513452173930E-03);
    dione.labelPosition = 2;
    dione.isMoon = true;

    var ariel = generateBasicPlanet();
    ariel.name = 'ariel';
    ariel.radius = 578.9;
    ariel.mass = 1.353 * Math.pow(10, 21);
    ariel.color = {
        r: 0x50, g: 0x50, b: 0x50
    };
    ariel.x = 1.808831648922740E+01 * config.orbitingSpheres.AU;
    ariel.y = 8.362494656383751E+00 * config.orbitingSpheres.AU;
    ariel.z = -2.022127758948894E-01 * config.orbitingSpheres.AU;
    ariel.vx = auPerDayToMPerSecond(1.010872487068684E-03);
    ariel.vy = auPerDayToMPerSecond(3.027332203470256E-03);
    ariel.vz = auPerDayToMPerSecond(1.694227127778885E-03);
    ariel.labelPosition = -1;
    ariel.isMoon = true;

    var umbriel = generateBasicPlanet();
    umbriel.name = 'umbriel';
    umbriel.radius = 584.7;
    umbriel.mass = 1.172 * Math.pow(10, 21);
    umbriel.color = {
        r: 0x4f, g: 0x4f, b: 0x4f
    };
    umbriel.x = 1.808949676684078E+01 * config.orbitingSpheres.AU;
    umbriel.y = 8.361857990316176E+00 * config.orbitingSpheres.AU;
    umbriel.z = -2.049473517530728E-01 * config.orbitingSpheres.AU;
    umbriel.vx = auPerDayToMPerSecond(-4.169953929379627E-03);
    umbriel.vy = auPerDayToMPerSecond(3.804026654898817E-03);
    umbriel.vz = auPerDayToMPerSecond(-8.792604644083235E-04);
    umbriel.labelPosition = 1;
    umbriel.isMoon = true;

    var titania = generateBasicPlanet();
    titania.name = 'titania';
    titania.radius = 788.4;
    titania.mass = 3.527 * Math.pow(10, 21);
    titania.color = {
        r: 0xa8, g: 0x8c, b: 0x74
    };
    titania.x = 1.808624856063241E+01 * config.orbitingSpheres.AU;
    titania.y = 8.362655567513061E+00 * config.orbitingSpheres.AU;
    titania.z = -2.043179982156845E-01 * config.orbitingSpheres.AU;
    titania.vx = auPerDayToMPerSecond(-2.356911137729173E-03);
    titania.vy = auPerDayToMPerSecond(3.807804255730864E-03);
    titania.vz = auPerDayToMPerSecond(1.980010647572579E-03);
    titania.labelPosition = 2;
    titania.isMoon = true;

    var oberon = generateBasicPlanet();
    oberon.name = 'oberon';
    oberon.radius = 761.4;
    oberon.mass = 3.014 * Math.pow(10, 21);
    oberon.color = {
        r: 0x82, g: 0x6f, b: 0x72
    };
    oberon.x = 1.808831342811963E+01 * config.orbitingSpheres.AU;
    oberon.y = 8.361801527957326E+00 * config.orbitingSpheres.AU;
    oberon.z = -2.071134351399648E-01 * config.orbitingSpheres.AU;
    oberon.vx = auPerDayToMPerSecond(-3.435128721007176E-03);
    oberon.vy = auPerDayToMPerSecond(3.803281925853312E-03);
    oberon.vz = auPerDayToMPerSecond(2.773607861591100E-04);
    oberon.labelPosition = -2;
    oberon.isMoon = true;

    var miranda = generateBasicPlanet();
    miranda.name = 'miranda';
    miranda.radius = 761.4;
    miranda.mass = 6.59 * Math.pow(10, 19);
    miranda.color = {
        r: 0xd3, g: 0xd3, b: 0xd3
    };
    miranda.x = 1.808936919466282E+01 * config.orbitingSpheres.AU;
    miranda.y = 8.362238476399092E+00 * config.orbitingSpheres.AU;
    miranda.z = -2.025317713000837E-01 * config.orbitingSpheres.AU;
    miranda.vx = auPerDayToMPerSecond(1.634329599010024E-03);
    miranda.vy = auPerDayToMPerSecond(2.699427288374493E-03);
    miranda.vz = auPerDayToMPerSecond(-1.814058428868515E-03);
    miranda.labelPosition = -3;
    miranda.isMoon = true;

    var triton = generateBasicPlanet();
    triton.name = 'triton';
    triton.radius = 1353.4;
    triton.mass = 2.14 * Math.pow(10, 22);
    triton.color = {
        r: 0xaf, g: 0xab, b: 0xe3
    };
    triton.x = 2.849129239336669E+01 * config.orbitingSpheres.AU;
    triton.y = -9.220048242622250E+00 * config.orbitingSpheres.AU;
    triton.z = -4.653178012067880E-01 * config.orbitingSpheres.AU;
    triton.vx = auPerDayToMPerSecond(3.083992998882498E-03);
    triton.vy = auPerDayToMPerSecond(3.426928820254996E-03);
    triton.vz = auPerDayToMPerSecond(-1.378249499923859E-03);
    triton.labelPosition = -1;
    triton.isMoon = true;

    var nereid = generateBasicPlanet();
    nereid.name = 'nereid';
    nereid.radius = 340;
    nereid.mass = 3.1 * Math.pow(10, 19);
    nereid.color = {
        r: 0x9e, g: 0x9e, b: 0x9e
    };
    nereid.x = 2.852086320067444E+01 * config.orbitingSpheres.AU;
    nereid.y = -9.176009765312331E+00 * config.orbitingSpheres.AU;
    nereid.z = -4.618798644280574E-01 * config.orbitingSpheres.AU;
    nereid.vx = auPerDayToMPerSecond(8.366386632931686E-04);
    nereid.vy = auPerDayToMPerSecond(3.362641681679426E-03);
    nereid.vz = auPerDayToMPerSecond(-6.593772982006257E-05);
    nereid.labelPosition = 1;
    nereid.isMoon = true;


    var charon = generateBasicPlanet();
    charon.name = 'charon';
    charon.radius = 604;
    charon.mass = 1.586 * Math.pow(10, 21);
    charon.color = {
        r: 0xc2, g: 0xb3, b: 0xbb
    };
    charon.x = 1.014132655226556E+01 * config.orbitingSpheres.AU;
    charon.y = -3.175473606652909E+01 * config.orbitingSpheres.AU;
    charon.z = 4.645172733977511E-01 * config.orbitingSpheres.AU;
    charon.vx = auPerDayToMPerSecond(3.093514414021587E-03);
    charon.vy = auPerDayToMPerSecond(2.751871734440477E-04);
    charon.vz = auPerDayToMPerSecond(-1.021966349205112E-03);
    charon.labelPosition = -1;
    charon.isMoon = true;

    spheres.push(sun);
    spheres.push(merkur);
    spheres.push(venus);
    spheres.push(earth);
    spheres.push(moon);
    spheres.push(mars);

    spheres.push(jupiter);
    spheres.push(callisto);
    spheres.push(ganymede);
    spheres.push(io);
    spheres.push(europa);

    spheres.push(saturn);
    spheres.push(titan);
    spheres.push(rhea);
    spheres.push(dione);

    spheres.push(uranus);
    spheres.push(ariel);
    spheres.push(umbriel);
    spheres.push(titania);
    spheres.push(oberon);
    spheres.push(miranda);

    spheres.push(neptune);
    spheres.push(triton);
    spheres.push(nereid);

    spheres.push(pluto);
    spheres.push(charon);
    //
    spheres.push(halley);
    // hale-bopp moves inwards...
    //spheres.push(hale);
}

function attraction(sphere1, sphere2) {
    var dx = sphere1.x - sphere2.x;
    var dy = sphere1.y - sphere2.y;
    var dz = sphere1.z - sphere2.z;
    var direction = {
        dx:  sphere1.x - sphere2.x,
        dy : sphere1.y - sphere2.y,
        dz : sphere1.z - sphere2.z
    };
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist == 0) {
        return;
    }
    var force = config.orbitingSpheres.gravitationalConstant * sphere2.mass * sphere1.mass / (dist * dist * dist);
    //var theta = Math.atan2(dy, dx);
    return {fx: direction.dx * force, fy: direction.dy * force, fz: direction.dz * force}
}

function sphereAct(sphere, parentIndex) {
    var totalForce = {
        fx: 0, fy: 0, fz: 0
    };
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        if (sphereI == parentIndex) {
            continue;
        }
        var forces = attraction(spheres[sphereI], sphere);
        if (forces) {
            totalForce.fx += forces.fx;
            totalForce.fy += forces.fy;
            totalForce.fz += forces.fz;
        }
    }
    sphere.force = totalForce;
}

function spheresAct(addPointToTrail) {
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        sphereAct(spheres[sphereI], sphereI);
    }
    for (var sphere2I = 0; sphere2I < spheres.length; sphere2I++) {
        var sphere = spheres[sphere2I];
        sphere.vx += sphere.force.fx / sphere.mass * config.orbitingSpheres.timestep;
        sphere.vy += sphere.force.fy / sphere.mass * config.orbitingSpheres.timestep;
        sphere.vz += sphere.force.fz / sphere.mass * config.orbitingSpheres.timestep;

        sphere.x += sphere.vx * config.orbitingSpheres.timestep;
        sphere.y += sphere.vy * config.orbitingSpheres.timestep;
        sphere.z += sphere.vz * config.orbitingSpheres.timestep;
        if(addPointToTrail) {
            sphere.trail[pastTime] = {y: sphere.y, x: sphere.x, z: sphere.z, vx: sphere.vx, vy: sphere.vy, vz: sphere.vz};
        }
    }
}

function drawSpherePoint(trailPoint, sphere) {
    if (!trailPoint) return;
    var xCoord = trailPoint.x * config.orbitingSpheres.scale_factor;
    var yCoord = trailPoint.y * config.orbitingSpheres.scale_factor;
    if (xCoord > ctx.transformedPoint(config.size.width, 0).x ||
        yCoord > ctx.transformedPoint(0, config.size.height).y ||
        xCoord < ctx.transformedPoint(0, 0).x ||
        yCoord < ctx.transformedPoint(0, 0).y) return;
    if (painted.indexOf({x: xCoord, y: yCoord}) == -1) {
        ctx.beginPath();
        painted.push({x: xCoord, y: yCoord});
        var size = sphere.isMoon ? 1 : 2;
        ctx.arc(trailPoint.x * config.orbitingSpheres.scale_factor, trailPoint.y * config.orbitingSpheres.scale_factor, size / config.orbitingSpheres.scala, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawSpheres() {
    painted = [];
    for (var sphereI = 0; sphereI < spheres.length; sphereI++) {
        ctx.font = ~~(config.orbitingSpheres.baseTextSize / config.orbitingSpheres.scala + 1) + "px Arial";
        ctx.beginPath();
        var sphere = spheres[sphereI];
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
                    drawSpherePoint(sphere.trail[trailIndexForward], sphere);
                }
            } else {
                for (var trailIndexBackward = pastTime; trailIndexBackward < config.orbitingSpheres.trailStart; trailIndexBackward -= config.orbitingSpheres.timestep) {
                    drawSpherePoint(sphere.trail[trailIndexBackward], sphere);
                }
            }
        }
        if (pastTime in sphere.trail) {
            drawSpherePoint(sphere.trail[pastTime], sphere);
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
    ctx.fillText('sadly it laggs, if you keep using trails', leftTopX, leftTopY += fontOffset);
}

function updateCanvas() {
    ctx.beginPath();
    ctx.translate(toMove.x, toMove.y);
    toMove.x = 0;
    toMove.y = 0;
    ctx.fillStyle = 'yellow';
    var topLeft = ctx.transformedPoint(0,0);
    var bottomRight = ctx.transformedPoint(canvas.width,canvas.height);
    ctx.clearRect(topLeft.x,topLeft.y,bottomRight.x-topLeft.x,bottomRight.y-topLeft.y);
    ctx.fillText('Current time ' + formatDateTime(~~pastTime), -config.size.width / 2, -config.size.height / 2 + 50);
    ctx.fill();
    if(config.orbitingSpheres.showHelp){
        printHelp();
    }
    if (!everyBodyActed()) {
        spheresAct(true);
    } else {
        // the x values are used for the new calculation, they need to be reset (using the trail points for calculation led to bugs...)
        for (var i = 0; i < spheres.length; i++) {
            var sphere = spheres[i];
            var newCoord = sphere.trail[pastTime];
            if (!newCoord) continue;
            sphere.x = newCoord.x;
            sphere.y = newCoord.y;
            sphere.z = newCoord.z;
            sphere.vy = newCoord.vy;
            sphere.vx = newCoord.vx;
            sphere.vz = newCoord.vz;
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
        spheresAct(false);
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
    trackTransforms(ctx);
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
    newPlanet.trail[pastTime] = {y: newPlanet.y, x: newPlanet.x, vx: newPlanet.vx, vy: newPlanet.vy, vz: newPlanet.vz, z: newPlanet.z};
    convertColorToRgb(newPlanet);
    spheres.push(newPlanet)
}

function mouseWheelEvent(event) {
    //config.orbitingSpheres.scale_factor_factor *= event.originalEvent.deltaY < 0 ? 1.1 : 0.9;
    //config.orbitingSpheres.scale_factor = config.orbitingSpheres.scale_factor_factor / config.orbitingSpheres.AU;
    scalePoint = getMousePos(canvas, event);
    scalePoint = ctx.transformedPoint(scalePoint.x,scalePoint.y);
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
