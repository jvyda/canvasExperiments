import {Planet} from "./Planet";
import {Moon} from "./Moon";
import * as THREE from 'three';
import {Converter} from "./Converter";
import {Constants} from "./Contants";
import {PlanetaryObject} from "./PlanetaryObject";
import {Config} from "./Config";


export class PlanetaryObjectManager {
    private _planets: Array<Planet> = [];
    private _moons: Array<Moon> = [];
    private _objects: Array<PlanetaryObject> = [];

    setupPlanets(){
        let sun = new Planet(1.98892 * Math.pow(10, 30), 'sun', 696000);
        sun.color = new THREE.Color(250.0/255,253.0/255, 112.0/255);
        let sunPosition = new THREE.Vector3();
        sunPosition.x =   2.850766546470957E-03 * Constants.AU;
        sunPosition.y =   4.956963665727667E-03 * Constants.AU;
        sunPosition.z =  -1.444369038454740E-04 * Constants.AU;
        sun.position.copy(sunPosition);

        let sunVelocity = new THREE.Vector3();
        sunVelocity.x = Converter.auPerDayToMPerSecond(  -4.226964281155967E-06);
        sunVelocity.y = Converter.auPerDayToMPerSecond(  6.171203031582879E-06);
        sunVelocity.z = Converter.auPerDayToMPerSecond(  9.439081475650780E-08);
        sun.velocity.copy(sunVelocity);


        let mercury = new Planet(3.3011 * Math.pow(10, 23), 'mercury', 2440);
        mercury.color = new THREE.Color(129/255, 103/255, 95/255);
        let mercuryPosition = new THREE.Vector3();
        mercuryPosition.x =   3.563920740763323E-01 * Constants.AU;
        mercuryPosition.y =   5.717187678804200E-03 * Constants.AU;
        mercuryPosition.z =  -3.251628630906487E-02 * Constants.AU;
        mercury.position.copy(mercuryPosition);

        let mercuryVelocity = new THREE.Vector3();
        mercuryVelocity.x = Converter.auPerDayToMPerSecond( -5.498625279495372E-03);
        mercuryVelocity.y = Converter.auPerDayToMPerSecond(  2.939907891055230E-02);
        mercuryVelocity.z = Converter.auPerDayToMPerSecond(  2.905916882777411E-03);
        mercury.velocity.copy(mercuryVelocity);


        let venus = new Planet(48.685 * Math.pow(10, 23), 'venus', 6051.8);
        venus.color = new THREE.Color(167/255,95/255, 24/255);
        let venusPosition = new THREE.Vector3();
        venusPosition.x =   3.714287363667594E-01 * Constants.AU;
        venusPosition.y =  -6.223065873025234E-01 * Constants.AU;
        venusPosition.z =  -3.001784089847719E-02 * Constants.AU;
        venus.position.copy(venusPosition);

        let venusVelocity = new THREE.Vector3();
        venusVelocity.x = Converter.auPerDayToMPerSecond(  1.729787164697147E-02);
        venusVelocity.y = Converter.auPerDayToMPerSecond(  1.018360946690303E-02);
        venusVelocity.z = Converter.auPerDayToMPerSecond( -8.587441076085737E-04);
        venus.velocity.copy(venusVelocity);


        let earth = new Planet(5.97219 * Math.pow(10, 24), 'earth', 6371.0);
        earth.color = new THREE.Color(56/255, 80/255, 28/255);
        let earthPosition = new THREE.Vector3();
        earthPosition.x =  -2.553538585508089E-01 * Constants.AU;
        earthPosition.y =  -9.763411304535361E-01 * Constants.AU;
        earthPosition.z =  -1.052513783569142E-04 * Constants.AU;
        earth.position.copy(earthPosition);

        let earthVelocity = new THREE.Vector3();
        earthVelocity.x = Converter.auPerDayToMPerSecond(  1.635001487036944E-02);
        earthVelocity.y = Converter.auPerDayToMPerSecond( -4.430797621704561E-03);
        earthVelocity.z = Converter.auPerDayToMPerSecond( -2.101776519643229E-08);
        earth.velocity.copy(earthVelocity);


        let mars = new Planet(6.4171 * Math.pow(10, 23), 'mars', 3389);
        mars.color = new THREE.Color(245/255,128/255, 90/255);
        let marsPosition = new THREE.Vector3();
        marsPosition.x =  -2.841551665529732E-01 * Constants.AU;
        marsPosition.y =   1.572607284356505E+00 * Constants.AU;
        marsPosition.z =   3.975013478435811E-02 * Constants.AU;
        mars.position.copy(marsPosition);

        let marsVelocity = new THREE.Vector3();
        marsVelocity.x = Converter.auPerDayToMPerSecond( -1.323899118392277E-02);
        marsVelocity.y = Converter.auPerDayToMPerSecond( -1.324079074777860E-03);
        marsVelocity.z = Converter.auPerDayToMPerSecond(  2.970233768304195E-04);
        mars.velocity.copy(marsVelocity);


        let jupiter = new Planet(1898.13 * Math.pow(10, 24), 'jupiter', 69911);
        jupiter.color = new THREE.Color(181/255, 158/255, 140/255);
        let jupiterPosition = new THREE.Vector3();
        jupiterPosition.x =  -5.035296751383366E+00 * Constants.AU;
        jupiterPosition.y =  -2.079389405758550E+00 * Constants.AU;
        jupiterPosition.z =   1.212458388046286E-01 * Constants.AU;
        jupiter.position.copy(jupiterPosition);

        let jupiterVelocity = new THREE.Vector3();
        jupiterVelocity.x = Converter.auPerDayToMPerSecond(  2.792948935544964E-03);
        jupiterVelocity.y = Converter.auPerDayToMPerSecond( -6.616959801585691E-03);
        jupiterVelocity.z = Converter.auPerDayToMPerSecond( -3.497144769094454E-05);
        jupiter.velocity.copy(jupiterVelocity);


        let saturn = new Planet(5.6834 * Math.pow(10, 26), 'saturn', 58232);
        saturn.color = new THREE.Color(208/255,174/255, 118/255);
        let saturnPosition = new THREE.Vector3();
        saturnPosition.x =  -1.052026933700409E+00 * Constants.AU;
        saturnPosition.y =  -9.994978492278472E+00 * Constants.AU;
        saturnPosition.z =   2.156536677039137E-01 * Constants.AU;
        saturn.position.copy(saturnPosition);

        let saturnVelocity = new THREE.Vector3();
        saturnVelocity.x = Converter.auPerDayToMPerSecond(  5.241668381800872E-03);
        saturnVelocity.y = Converter.auPerDayToMPerSecond( -6.012163316021670E-04);
        saturnVelocity.z = Converter.auPerDayToMPerSecond( -1.984428527740341E-04);
        saturn.velocity.copy(saturnVelocity);


        let uranus = new Planet(86.813 * Math.pow(10, 24), 'uranus', 25362);
        uranus.color = new THREE.Color(188/255,225/255, 228/255);
        let uranusPosition = new THREE.Vector3();
        uranusPosition.x =   1.808894256948102E+01 * Constants.AU;
        uranusPosition.y =   8.362208575257883E+00 * Constants.AU;
        uranusPosition.z =  -2.032877227125995E-01 * Constants.AU;
        uranus.position.copy(uranusPosition);

        let uranusVelocity = new THREE.Vector3();
        uranusVelocity.x = Converter.auPerDayToMPerSecond( -1.679096933165243E-03);
        uranusVelocity.y = Converter.auPerDayToMPerSecond(  3.386709085903006E-03);
        uranusVelocity.z = Converter.auPerDayToMPerSecond(  3.424044542155598E-05);
        uranus.velocity.copy(uranusVelocity);


        let neptune = new Planet(102.413 * Math.pow(10, 24), 'neptune', 24624);
        neptune.color = new THREE.Color(74/255,123/255, 246/255);
        let neptunePosition = new THREE.Vector3();
        neptunePosition.x =   2.849083024398218E+01 * Constants.AU;
        neptunePosition.y =  -9.221924603790701E+00 * Constants.AU;
        neptunePosition.z =  -4.666923015623424E-01 * Constants.AU;
        neptune.position.copy(neptunePosition);

        let neptuneVelocity = new THREE.Vector3();
        neptuneVelocity.x = Converter.auPerDayToMPerSecond(  9.453663134275120E-04);
        neptuneVelocity.y = Converter.auPerDayToMPerSecond(  3.005146529509257E-03);
        neptuneVelocity.z = Converter.auPerDayToMPerSecond( -8.341370560621744E-05);
        neptune.velocity.copy(neptuneVelocity);


        let pluto = new Planet(1.307 * Math.pow(10, 22), 'pluto', 1188);
        pluto.color = new THREE.Color(168/255,161/255, 145/255);
        let plutoPosition = new THREE.Vector3();
        plutoPosition.x =   1.014124003514971E+01 * Constants.AU;
        plutoPosition.y =  -3.175483419042463E+01 * Constants.AU;
        plutoPosition.z =   4.645108131789219E-01 * Constants.AU;
        pluto.position.copy(plutoPosition);

        let plutoVelocity = new THREE.Vector3();
        plutoVelocity.x = Converter.auPerDayToMPerSecond(  3.051988326221818E-03);
        plutoVelocity.y = Converter.auPerDayToMPerSecond(  3.040012335837204E-04);
        plutoVelocity.z = Converter.auPerDayToMPerSecond( -9.034090662794829E-04);
        pluto.velocity.copy(plutoVelocity);


        this._planets.push(sun);
        this._planets.push(mercury);
        this._planets.push(venus);
        this._planets.push(earth);
        this._planets.push(mars);
        this._planets.push(jupiter);
        this._planets.push(saturn);
        this._planets.push(uranus);
        this._planets.push(neptune);
        this._planets.push(pluto);

    }

    setupMoons(){

        // earth
        let luna = new Moon(7.349 * Math.pow(10, 22), 'luna', 1738.0);
        luna.color = new THREE.Color(71/255,69/255, 66/255);
        let lunaPosition = new THREE.Vector3();
        lunaPosition.x =  -2.575166907126450E-01 * Constants.AU;
        lunaPosition.y =  -9.779348173678579E-01 * Constants.AU;
        lunaPosition.z =   1.160472013440968E-04 * Constants.AU;
        luna.position.copy(lunaPosition);

        let lunaVelocity = new THREE.Vector3();
        lunaVelocity.x = Converter.auPerDayToMPerSecond(  1.667315603093720E-02);
        lunaVelocity.y = Converter.auPerDayToMPerSecond( -4.891796261925801E-03);
        lunaVelocity.z = Converter.auPerDayToMPerSecond(  1.856253978047449E-05);
        luna.velocity.copy(lunaVelocity);


        // jupiter
        let io = new Moon(893.3 * Math.pow(10, 20), 'io', 1821.3);
        io.color = new THREE.Color(248/255,235/255, 131/255);
        let ioPosition = new THREE.Vector3();
        ioPosition.x =  -5.033395021092241E+00 * Constants.AU;
        ioPosition.y =  -2.077324466186377E+00 * Constants.AU;
        ioPosition.z =   1.213462690631602E-01 * Constants.AU;
        io.position.copy(ioPosition);

        let ioVelocity = new THREE.Vector3();
        ioVelocity.x = Converter.auPerDayToMPerSecond( -4.588618536023535E-03);
        ioVelocity.y = Converter.auPerDayToMPerSecond(  2.016343119445475E-04);
        ioVelocity.z = Converter.auPerDayToMPerSecond(  1.026701978370372E-04);
        io.velocity.copy(ioVelocity);

        let europa = new Moon(479.7 * Math.pow(10, 20), 'europa', 1565);
        europa.color = new THREE.Color(186/255,149/255, 107/255);
        let europaPosition = new THREE.Vector3();
        europaPosition.x =  -5.031515268951983E+00 * Constants.AU;
        europaPosition.y =  -2.076909297177093E+00 * Constants.AU;
        europaPosition.z =   1.214212115321035E-01 * Constants.AU;
        europa.position.copy(europaPosition);

        let europaVelocity = new THREE.Vector3();
        europaVelocity.x = Converter.auPerDayToMPerSecond( -1.539101640693913E-03);
        europaVelocity.y = Converter.auPerDayToMPerSecond( -5.365528961176684E-05);
        europaVelocity.z = Converter.auPerDayToMPerSecond(  1.724641804134938E-04);
        europa.velocity.copy(europaVelocity);

        let ganymede = new Moon(1482 * Math.pow(10, 20), 'ganymede', 2634);
        ganymede.color = new THREE.Color(158/255,141/255, 121/255);
        let ganymedePosition = new THREE.Vector3();
        ganymedePosition.x =  -5.038545162105024E+00 * Constants.AU;
        ganymedePosition.y =  -2.073001766415427E+00 * Constants.AU;
        ganymedePosition.z =   1.214444510403471E-01 * Constants.AU;
        ganymede.position.copy(ganymedePosition);

        let ganymedeVelocity = new THREE.Vector3();
        ganymedeVelocity.x = Converter.auPerDayToMPerSecond( -2.802399876020957E-03);
        ganymedeVelocity.y = Converter.auPerDayToMPerSecond( -9.445554901806956E-03);
        ganymedeVelocity.z = Converter.auPerDayToMPerSecond( -2.158793174958044E-04);
        ganymede.velocity.copy(ganymedeVelocity);

        let callisto = new Moon(1076 * Math.pow(10, 20), 'callisto', 2403);
        callisto.color = new THREE.Color(165/255,78/255, 50/255);
        let callistoPosition = new THREE.Vector3();
        callistoPosition.x =  -5.043546136432461E+00 * Constants.AU;
        callistoPosition.y =  -2.088970248927962E+00 * Constants.AU;
        callistoPosition.z =   1.208319766139647E-01 * Constants.AU;
        callisto.position.copy(callistoPosition);

        let callistoVelocity = new THREE.Vector3();
        callistoVelocity.x = Converter.auPerDayToMPerSecond(  6.380893216887173E-03);
        callistoVelocity.y = Converter.auPerDayToMPerSecond( -9.672660525049762E-03);
        callistoVelocity.z = Converter.auPerDayToMPerSecond( -8.392504518043012E-05);
        callisto.velocity.copy(callistoVelocity);

        let amalthea = new Moon(2.07 * Math.pow(10, 18), 'amalthea', 131);
        amalthea.color = new THREE.Color(131/255,131/255, 131/255);
        let amaltheaPosition = new THREE.Vector3();
        amaltheaPosition.x =  -5.035827467478209E+00 * Constants.AU;
        amaltheaPosition.y =  -2.080474247795096E+00 * Constants.AU;
        amaltheaPosition.z =   1.212064605253680E-01 * Constants.AU;
        amalthea.position.copy(amaltheaPosition);

        let amaltheaVelocity = new THREE.Vector3();
        amaltheaVelocity.x = Converter.auPerDayToMPerSecond(  1.657996095034024E-02);
        amaltheaVelocity.y = Converter.auPerDayToMPerSecond( -1.334482721782156E-02);
        amaltheaVelocity.z = Converter.auPerDayToMPerSecond( -3.237861792010454E-05);
        amalthea.velocity.copy(amaltheaVelocity);

        let himalia = new Moon(6.7 * Math.pow(10, 18), 'himalia', 85);
        himalia.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let himaliaPosition = new THREE.Vector3();
        himaliaPosition.x =  -5.072371995431338E+00 * Constants.AU;
        himaliaPosition.y =  -2.156554393560907E+00 * Constants.AU;
        himaliaPosition.z =   1.050266303022453E-01 * Constants.AU;
        himalia.position.copy(himaliaPosition);

        let himaliaVelocity = new THREE.Vector3();
        himaliaVelocity.x = Converter.auPerDayToMPerSecond(  4.193659551801877E-03);
        himaliaVelocity.y = Converter.auPerDayToMPerSecond( -7.097916485160895E-03);
        himaliaVelocity.z = Converter.auPerDayToMPerSecond( -8.080490186851024E-04);
        himalia.velocity.copy(himaliaVelocity);

        let elara = new Moon(8.66 * Math.pow(10, 17), 'elara', 40);
        elara.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let elaraPosition = new THREE.Vector3();
        elaraPosition.x =  -5.007052761256864E+00 * Constants.AU;
        elaraPosition.y =  -1.998136488687612E+00 * Constants.AU;
        elaraPosition.z =   1.033468449223691E-01 * Constants.AU;
        elara.position.copy(elaraPosition);

        let elaraVelocity = new THREE.Vector3();
        elaraVelocity.x = Converter.auPerDayToMPerSecond(  1.505294907800435E-03);
        elaraVelocity.y = Converter.auPerDayToMPerSecond( -5.800729720232586E-03);
        elaraVelocity.z = Converter.auPerDayToMPerSecond(  6.732209276522373E-04);
        elara.velocity.copy(elaraVelocity);


        // saturn
        let mimas = new Moon(3.7 * Math.pow(10, 19), 'mimas', 198.8);
        mimas.color = new THREE.Color(170/255,170/255, 170/255);
        let mimasPosition = new THREE.Vector3();
        mimasPosition.x =  -1.051097107009128E+00 * Constants.AU;
        mimasPosition.y =  -9.994279684827506E+00 * Constants.AU;
        mimasPosition.z =   2.151842585119804E-01 * Constants.AU;
        mimas.position.copy(mimasPosition);

        let mimasVelocity = new THREE.Vector3();
        mimasVelocity.x = Converter.auPerDayToMPerSecond( -2.693303006907917E-04);
        mimasVelocity.y = Converter.auPerDayToMPerSecond(  5.031497985220811E-03);
        mimasVelocity.z = Converter.auPerDayToMPerSecond( -2.375575563589368E-03);
        mimas.velocity.copy(mimasVelocity);

        let enceladus = new Moon(10.8 * Math.pow(10, 19), 'enceladus', 252.3);
        enceladus.color = new THREE.Color(167/255,168/255, 173/255);
        let enceladusPosition = new THREE.Vector3();
        enceladusPosition.x =  -1.053601856116676E+00 * Constants.AU;
        enceladusPosition.y =  -9.994727232204379E+00 * Constants.AU;
        enceladusPosition.z =   2.156744497283566E-01 * Constants.AU;
        enceladus.position.copy(enceladusPosition);

        let enceladusVelocity = new THREE.Vector3();
        enceladusVelocity.x = Converter.auPerDayToMPerSecond(  4.303380416779324E-03);
        enceladusVelocity.y = Converter.auPerDayToMPerSecond( -6.957434636051587E-03);
        enceladusVelocity.z = Converter.auPerDayToMPerSecond(  3.222239838193283E-03);
        enceladus.velocity.copy(enceladusVelocity);

        let tethys = new Moon(61.7 * Math.pow(10, 19), 'tethys', 536.3);
        tethys.color = new THREE.Color(161/255,161/255, 161/255);
        let tethysPosition = new THREE.Vector3();
        tethysPosition.x =  -1.051406934001631E+00 * Constants.AU;
        tethysPosition.y =  -9.996641919346041E+00 * Constants.AU;
        tethysPosition.z =   2.165065614149522E-01 * Constants.AU;
        tethys.position.copy(tethysPosition);

        let tethysVelocity = new THREE.Vector3();
        tethysVelocity.x = Converter.auPerDayToMPerSecond(  1.144549983266607E-02);
        tethysVelocity.y = Converter.auPerDayToMPerSecond(  9.911419147401804E-04);
        tethysVelocity.z = Converter.auPerDayToMPerSecond( -1.602173597088552E-03);
        tethys.velocity.copy(tethysVelocity);

        let dione = new Moon(109.5 * Math.pow(10, 19), 'dione', 562.5);
        dione.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let dionePosition = new THREE.Vector3();
        dionePosition.x =  -1.053520446990857E+00 * Constants.AU;
        dionePosition.y =  -9.996714989908178E+00 * Constants.AU;
        dionePosition.z =   2.167075416038646E-01 * Constants.AU;
        dione.position.copy(dionePosition);

        let dioneVelocity = new THREE.Vector3();
        dioneVelocity.x = Converter.auPerDayToMPerSecond(  9.877980793349971E-03);
        dioneVelocity.y = Converter.auPerDayToMPerSecond( -3.845191621488661E-03);
        dioneVelocity.z = Converter.auPerDayToMPerSecond(  1.054534367388523E-03);
        dione.velocity.copy(dioneVelocity);

        let rhea = new Moon(230.9 * Math.pow(10, 19), 'rhea', 764.5);
        rhea.color = new THREE.Color(165/255,165/255, 165/255);
        let rheaPosition = new THREE.Vector3();
        rheaPosition.x =  -1.055074556851534E+00 * Constants.AU;
        rheaPosition.y =  -9.996421463527444E+00 * Constants.AU;
        rheaPosition.z =   2.166812627757572E-01 * Constants.AU;
        rhea.position.copy(rheaPosition);

        let rheaVelocity = new THREE.Vector3();
        rheaVelocity.x = Converter.auPerDayToMPerSecond(  7.673551266291546E-03);
        rheaVelocity.y = Converter.auPerDayToMPerSecond( -4.462028821189346E-03);
        rheaVelocity.z = Converter.auPerDayToMPerSecond(  1.581935737928945E-03);
        rhea.velocity.copy(rheaVelocity);

        let titan = new Moon(13455.3 * Math.pow(10, 19), 'titan', 2575.5);
        titan.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let titanPosition = new THREE.Vector3();
        titanPosition.x =  -1.059235734404717E+00 * Constants.AU;
        titanPosition.y =  -9.998348100969805E+00 * Constants.AU;
        titanPosition.z =   2.181058513121286E-01 * Constants.AU;
        titan.position.copy(titanPosition);

        let titanVelocity = new THREE.Vector3();
        titanVelocity.x = Converter.auPerDayToMPerSecond(  6.853875199627987E-03);
        titanVelocity.y = Converter.auPerDayToMPerSecond( -3.075089708885117E-03);
        titanVelocity.z = Converter.auPerDayToMPerSecond(  9.166312508262256E-04);
        titan.velocity.copy(titanVelocity);

        let hyperion = new Moon(1.0 * Math.pow(10, 19), 'hyperion', 133);
        hyperion.color = new THREE.Color(235/255,196/255, 101/255);
        let hyperionPosition = new THREE.Vector3();
        hyperionPosition.x =  -1.060513381861248E+00 * Constants.AU;
        hyperionPosition.y =  -9.989423192225543E+00 * Constants.AU;
        hyperionPosition.z =   2.136930536058216E-01 * Constants.AU;
        hyperion.position.copy(hyperionPosition);

        let hyperionVelocity = new THREE.Vector3();
        hyperionVelocity.x = Converter.auPerDayToMPerSecond(  3.416972332770753E-03);
        hyperionVelocity.y = Converter.auPerDayToMPerSecond( -2.425057524612164E-03);
        hyperionVelocity.z = Converter.auPerDayToMPerSecond(  8.905462897201394E-04);
        hyperion.velocity.copy(hyperionVelocity);

        let iapetus = new Moon(180.5 * Math.pow(10, 19), 'iapetus', 734.5);
        iapetus.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let iapetusPosition = new THREE.Vector3();
        iapetusPosition.x =  -1.039798972398382E+00 * Constants.AU;
        iapetusPosition.y =  -1.001499652029319E+01 * Constants.AU;
        iapetusPosition.z =   2.178172262088040E-01 * Constants.AU;
        iapetus.position.copy(iapetusPosition);

        let iapetusVelocity = new THREE.Vector3();
        iapetusVelocity.x = Converter.auPerDayToMPerSecond(  6.801714508286495E-03);
        iapetusVelocity.y = Converter.auPerDayToMPerSecond(  3.515742786439292E-04);
        iapetusVelocity.z = Converter.auPerDayToMPerSecond( -7.338053218800647E-04);
        iapetus.velocity.copy(iapetusVelocity);

        let phoebe = new Moon(0.8 * Math.pow(10, 19), 'phoebe', 106.6);
        phoebe.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let phoebePosition = new THREE.Vector3();
        phoebePosition.x =  -9.670450305055830E-01 * Constants.AU;
        phoebePosition.y =  -9.960191586391110E+00 * Constants.AU;
        phoebePosition.z =   2.055106971748894E-01 * Constants.AU;
        phoebe.position.copy(phoebePosition);

        let phoebeVelocity = new THREE.Vector3();
        phoebeVelocity.x = Converter.auPerDayToMPerSecond(  5.471959499828694E-03);
        phoebeVelocity.y = Converter.auPerDayToMPerSecond( -1.494404483354401E-03);
        phoebeVelocity.z = Converter.auPerDayToMPerSecond( -2.291402604448027E-04);
        phoebe.velocity.copy(phoebeVelocity);

        let janus = new Moon(1.912 * Math.pow(10, 18), 'janus', 97);
        janus.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let janusPosition = new THREE.Vector3();
        janusPosition.x =  -1.052684324871944E+00 * Constants.AU;
        janusPosition.y =  -9.995640228825925E+00 * Constants.AU;
        janusPosition.z =   2.160643756500800E-01 * Constants.AU;
        janus.position.copy(janusPosition);

        let janusVelocity = new THREE.Vector3();
        janusVelocity.x = Converter.auPerDayToMPerSecond(  1.214972037098041E-02);
        janusVelocity.y = Converter.auPerDayToMPerSecond( -6.082106931973498E-03);
        janusVelocity.z = Converter.auPerDayToMPerSecond(  2.033856645041552E-03);
        janus.velocity.copy(janusVelocity);

        let epimetheus = new Moon(5.3 * Math.pow(10, 17), 'epimetheus', 69);
        epimetheus.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let epimetheusPosition = new THREE.Vector3();
        epimetheusPosition.x =  -1.051734349585026E+00 * Constants.AU;
        epimetheusPosition.y =  -9.995852642345202E+00 * Constants.AU;
        epimetheusPosition.z =   2.160861741262368E-01 * Constants.AU;
        epimetheus.position.copy(epimetheusPosition);

        let epimetheusVelocity = new THREE.Vector3();
        epimetheusVelocity.x = Converter.auPerDayToMPerSecond(  1.395440846414611E-02);
        epimetheusVelocity.y = Converter.auPerDayToMPerSecond(  1.339662688179879E-03);
        epimetheusVelocity.z = Converter.auPerDayToMPerSecond( -2.000762440516565E-03);
        epimetheus.velocity.copy(epimetheusVelocity);

        let prometheus = new Moon(1.566 * Math.pow(10, 17), 'prometheus', 74);
        prometheus.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let prometheusPosition = new THREE.Vector3();
        prometheusPosition.x =  -1.051117154629846E+00 * Constants.AU;
        prometheusPosition.y =  -9.995173011082192E+00 * Constants.AU;
        prometheusPosition.z =   2.156676000413650E-01 * Constants.AU;
        prometheus.position.copy(prometheusPosition);

        let prometheusVelocity = new THREE.Vector3();
        prometheusVelocity.x = Converter.auPerDayToMPerSecond(  7.055476985416458E-03);
        prometheusVelocity.y = Converter.auPerDayToMPerSecond(  7.641766838918831E-03);
        prometheusVelocity.z = Converter.auPerDayToMPerSecond( -4.693487247501202E-03);
        prometheus.velocity.copy(prometheusVelocity);

        // uranus
        let ariel = new Moon(13.5 * Math.pow(10, 20), 'ariel', 581.1);
        ariel.color = new THREE.Color(113/255,96/255, 89/255);
        let arielPosition = new THREE.Vector3();
        arielPosition.x =   1.808831648922740E+01 * Constants.AU;
        arielPosition.y =   8.362494656383751E+00 * Constants.AU;
        arielPosition.z =  -2.022127758948894E-01 * Constants.AU;
        ariel.position.copy(arielPosition);

        let arielVelocity = new THREE.Vector3();
        arielVelocity.x = Converter.auPerDayToMPerSecond(  1.010872487068684E-03);
        arielVelocity.y = Converter.auPerDayToMPerSecond(  3.027332203470256E-03);
        arielVelocity.z = Converter.auPerDayToMPerSecond(  1.694227127778885E-03);
        ariel.velocity.copy(arielVelocity);

        let umbriel = new Moon(11.7 * Math.pow(10, 20), 'umbriel', 584.7);
        umbriel.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let umbrielPosition = new THREE.Vector3();
        umbrielPosition.x =   1.808949676684078E+01 * Constants.AU;
        umbrielPosition.y =   8.361857990316176E+00 * Constants.AU;
        umbrielPosition.z =  -2.049473517530728E-01 * Constants.AU;
        umbriel.position.copy(umbrielPosition);

        let umbrielVelocity = new THREE.Vector3();
        umbrielVelocity.x = Converter.auPerDayToMPerSecond( -4.169953929379627E-03);
        umbrielVelocity.y = Converter.auPerDayToMPerSecond(  3.804026654898817E-03);
        umbrielVelocity.z = Converter.auPerDayToMPerSecond( -8.792604644083235E-04);
        umbriel.velocity.copy(umbrielVelocity);

        let titania = new Moon(35.2 * Math.pow(10, 20), 'titania', 788.9);
        titania.color = new THREE.Color(83/255,83/255, 83/255);
        let titaniaPosition = new THREE.Vector3();
        titaniaPosition.x =   1.808624856063241E+01 * Constants.AU;
        titaniaPosition.y =   8.362655567513061E+00 * Constants.AU;
        titaniaPosition.z =  -2.043179982156845E-01 * Constants.AU;
        titania.position.copy(titaniaPosition);

        let titaniaVelocity = new THREE.Vector3();
        titaniaVelocity.x = Converter.auPerDayToMPerSecond( -2.356911137729173E-03);
        titaniaVelocity.y = Converter.auPerDayToMPerSecond(  3.807804255730864E-03);
        titaniaVelocity.z = Converter.auPerDayToMPerSecond(  1.980010647572579E-03);
        titania.velocity.copy(titaniaVelocity);

        let oberon = new Moon(30.1 * Math.pow(10, 20), 'oberon', 761.4);
        oberon.color = new THREE.Color(199/255,180/255, 174/255);
        let oberonPosition = new THREE.Vector3();
        oberonPosition.x =   1.808831342811963E+01 * Constants.AU;
        oberonPosition.y =   8.361801527957326E+00 * Constants.AU;
        oberonPosition.z =  -2.071134351399648E-01 * Constants.AU;
        oberon.position.copy(oberonPosition);

        let oberonVelocity = new THREE.Vector3();
        oberonVelocity.x = Converter.auPerDayToMPerSecond( -3.435128721007176E-03);
        oberonVelocity.y = Converter.auPerDayToMPerSecond(  3.803281925853312E-03);
        oberonVelocity.z = Converter.auPerDayToMPerSecond(  2.773607861591100E-04);
        oberon.velocity.copy(oberonVelocity);

        let miranda = new Moon(6.59 * Math.pow(10, 19), 'miranda', 240);
        miranda.color = new THREE.Color(146/255,146/255, 146/255);
        let mirandaPosition = new THREE.Vector3();
        mirandaPosition.x =   1.808936919466282E+01 * Constants.AU;
        mirandaPosition.y =   8.362238476399092E+00 * Constants.AU;
        mirandaPosition.z =  -2.025317713000837E-01 * Constants.AU;
        miranda.position.copy(mirandaPosition);

        let mirandaVelocity = new THREE.Vector3();
        mirandaVelocity.x = Converter.auPerDayToMPerSecond(  1.634329599010024E-03);
        mirandaVelocity.y = Converter.auPerDayToMPerSecond(  2.699427288374493E-03);
        mirandaVelocity.z = Converter.auPerDayToMPerSecond( -1.814058428868515E-03);
        miranda.velocity.copy(mirandaVelocity);

        let portia = new Moon(1.6815 * Math.pow(10, 18), 'portia', 55);
        portia.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let portiaPosition = new THREE.Vector3();
        portiaPosition.x =   1.808934165455596E+01 * Constants.AU;
        portiaPosition.y =   8.362097681542858E+00 * Constants.AU;
        portiaPosition.z =  -2.034540065554775E-01 * Constants.AU;
        portia.position.copy(portiaPosition);

        let portiaVelocity = new THREE.Vector3();
        portiaVelocity.x = Converter.auPerDayToMPerSecond( -3.740968579934781E-03);
        portiaVelocity.y = Converter.auPerDayToMPerSecond(  3.137859391220525E-03);
        portiaVelocity.z = Converter.auPerDayToMPerSecond( -4.961139296322638E-03);
        portia.velocity.copy(portiaVelocity);

        let puck = new Moon(2.9 * Math.pow(10, 18), 'puck', 77);
        puck.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let puckPosition = new THREE.Vector3();
        puckPosition.x =   1.808889362787234E+01 * Constants.AU;
        puckPosition.y =   8.362296493929728E+00 * Constants.AU;
        puckPosition.z =  -2.027217985017210E-01 * Constants.AU;
        puck.position.copy(puckPosition);

        let puckVelocity = new THREE.Vector3();
        puckVelocity.x = Converter.auPerDayToMPerSecond(  2.932221092639868E-03);
        puckVelocity.y = Converter.auPerDayToMPerSecond(  2.425000072226604E-03);
        puckVelocity.z = Converter.auPerDayToMPerSecond(  5.828152995737249E-04);
        puck.velocity.copy(puckVelocity);

        let sycorax = new Moon(2.3 * Math.pow(10, 18), 'sycorax', 75);
        sycorax.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let sycoraxPosition = new THREE.Vector3();
        sycoraxPosition.x =   1.817163460993754E+01 * Constants.AU;
        sycoraxPosition.y =   8.423724557379055E+00 * Constants.AU;
        sycoraxPosition.z =  -2.378397729538305E-01 * Constants.AU;
        sycorax.position.copy(sycoraxPosition);

        let sycoraxVelocity = new THREE.Vector3();
        sycoraxVelocity.x = Converter.auPerDayToMPerSecond( -1.632185549719217E-03);
        sycoraxVelocity.y = Converter.auPerDayToMPerSecond(  3.112812345066134E-03);
        sycoraxVelocity.z = Converter.auPerDayToMPerSecond( -1.513934846397857E-05);
        sycorax.velocity.copy(sycoraxVelocity);


        // neptune
        let triton = new Moon(214.7 * Math.pow(10, 20), 'triton', 1352.6);
        triton.color = new THREE.Color(203/255,203/255, 215/203);
        let tritonPosition = new THREE.Vector3();
        tritonPosition.x =   2.849129239336669E+01 * Constants.AU;
        tritonPosition.y =  -9.220048242622250E+00 * Constants.AU;
        tritonPosition.z =  -4.653178012067880E-01 * Constants.AU;
        triton.position.copy(tritonPosition);

        let tritonVelocity = new THREE.Vector3();
        tritonVelocity.x = Converter.auPerDayToMPerSecond(  3.083992998882498E-03);
        tritonVelocity.y = Converter.auPerDayToMPerSecond(  3.426928820254996E-03);
        tritonVelocity.z = Converter.auPerDayToMPerSecond( -1.378249499923859E-03);
        triton.velocity.copy(tritonVelocity);

        let nereid = new Moon(3.1 * Math.pow(10, 19), 'nereid', 170);
        nereid.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let nereidPosition = new THREE.Vector3();
        nereidPosition.x =   2.852086320067444E+01 * Constants.AU;
        nereidPosition.y =  -9.176009765312331E+00 * Constants.AU;
        nereidPosition.z =  -4.618798644280574E-01 * Constants.AU;
        nereid.position.copy(nereidPosition);

        let nereidVelocity = new THREE.Vector3();
        nereidVelocity.x = Converter.auPerDayToMPerSecond(  8.366386632931686E-04);
        nereidVelocity.y = Converter.auPerDayToMPerSecond(  3.362641681679426E-03);
        nereidVelocity.z = Converter.auPerDayToMPerSecond( -6.593772982006257E-05);
        nereid.velocity.copy(nereidVelocity);

        let despina = new Moon(2.1 * Math.pow(10, 18), 'despina', 74);
        despina.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let despinaPosition = new THREE.Vector3();
        despinaPosition.x =   2.849051826897423E+01 * Constants.AU;
        despinaPosition.y =  -9.221864195276225E+00 * Constants.AU;
        despinaPosition.z =  -4.665430551804957E-01 * Constants.AU;
        despina.position.copy(despinaPosition);

        let despinaVelocity = new THREE.Vector3();
        despinaVelocity.x = Converter.auPerDayToMPerSecond( -9.313272061117672E-04);
        despinaVelocity.y = Converter.auPerDayToMPerSecond( -3.151554422448465E-03);
        despinaVelocity.z = Converter.auPerDayToMPerSecond( -1.512013981530722E-03);
        despina.velocity.copy(despinaVelocity);

        let galatea = new Moon(2.12 * Math.pow(10, 18), 'galatea', 79);
        galatea.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let galateaPosition = new THREE.Vector3();
        galateaPosition.x =   2.849108387897671E+01 * Constants.AU;
        galateaPosition.y =  -9.221597436980554E+00 * Constants.AU;
        galateaPosition.z =  -4.666798836162322E-01 * Constants.AU;
        galatea.position.copy(galateaPosition);

        let galateaVelocity = new THREE.Vector3();
        galateaVelocity.x = Converter.auPerDayToMPerSecond( -3.323050699691327E-03);
        galateaVelocity.y = Converter.auPerDayToMPerSecond(  6.204830067197430E-03);
        galateaVelocity.z = Converter.auPerDayToMPerSecond(  2.809777100289867E-03);
        galatea.velocity.copy(galateaVelocity);

        let larissa = new Moon(4.20 * Math.pow(10, 18), 'larissa', 104);
        larissa.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let larissaPosition = new THREE.Vector3();
        larissaPosition.x =   2.849046269263223E+01 * Constants.AU;
        larissaPosition.y =  -9.222248388731462E+00 * Constants.AU;
        larissaPosition.z =  -4.666582953137307E-01 * Constants.AU;
        larissa.position.copy(larissaPosition);

        let larissaVelocity = new THREE.Vector3();
        larissaVelocity.x = Converter.auPerDayToMPerSecond(  4.045531340065713E-03);
        larissaVelocity.y = Converter.auPerDayToMPerSecond( -7.971376445715124E-04);
        larissaVelocity.z = Converter.auPerDayToMPerSecond( -2.734583790774436E-03);
        larissa.velocity.copy(larissaVelocity);

        let proteus = new Moon(5 * Math.pow(10, 19), 'proteus', 218);
        proteus.color = new THREE.Color(0xc2,0xb3, 0xbb);
        let proteusPosition = new THREE.Vector3();
        proteusPosition.x =   2.849018707166290E+01 * Constants.AU;
        proteusPosition.y =  -9.222363533798239E+00 * Constants.AU;
        proteusPosition.z =  -4.665845482348466E-01 * Constants.AU;
        proteus.position.copy(proteusPosition);

        let proteusVelocity = new THREE.Vector3();
        proteusVelocity.x = Converter.auPerDayToMPerSecond(  2.902002136722940E-03);
        proteusVelocity.y = Converter.auPerDayToMPerSecond( -3.672610457205283E-04);
        proteusVelocity.z = Converter.auPerDayToMPerSecond( -2.132453046264509E-03);
        proteus.velocity.copy(proteusVelocity);


        // pluto
        let charon = new Moon(1.5 * Math.pow(10, 21), 'charon', 605);
        charon.color = new THREE.Color(174/255,174/255, 171/255);
        let charonPosition = new THREE.Vector3();
        charonPosition.x =   1.014132655226556E+01 * Constants.AU;
        charonPosition.y =  -3.175473606652909E+01 * Constants.AU;
        charonPosition.z =   4.645172733977511E-01 * Constants.AU;
        charon.position.copy(charonPosition);

        let charonVelocity = new THREE.Vector3();
        charonVelocity.x = Converter.auPerDayToMPerSecond(  3.093514414021587E-03);
        charonVelocity.y = Converter.auPerDayToMPerSecond(  2.751871734440477E-04);
        charonVelocity.z = Converter.auPerDayToMPerSecond( -1.021966349205112E-03);
        charon.velocity.copy(charonVelocity);


        this._moons.push(luna);

        this._moons.push(io);
        this._moons.push(europa);
        this._moons.push(ganymede);
        this._moons.push(callisto);
        this._moons.push(amalthea);
        this._moons.push(himalia);
        this._moons.push(elara);

        this._moons.push(mimas);
        this._moons.push(enceladus);
        this._moons.push(tethys);
        this._moons.push(dione);
        this._moons.push(rhea);
        this._moons.push(titan);
        this._moons.push(hyperion);
        this._moons.push(iapetus);
        this._moons.push(phoebe);
        this._moons.push(janus);
        this._moons.push(epimetheus);
        this._moons.push(prometheus);

        this._moons.push(ariel);
        this._moons.push(umbriel);
        this._moons.push(titania);
        this._moons.push(oberon);
        this._moons.push(miranda);
        this._moons.push(portia);
        this._moons.push(puck);
        this._moons.push(sycorax);

        this._moons.push(triton);
        this._moons.push(nereid);
        this._moons.push(despina);
        this._moons.push(galatea);
        this._moons.push(larissa);
        this._moons.push(proteus);

        this._moons.push(charon);

    }


    joinToFullList() {
        this._objects = this._moons.concat(this._planets);
        // for finding the scale
       /* let xMax = Number.MIN_SAFE_INTEGER, xMin = Number.MAX_SAFE_INTEGER, yMax = Number.MIN_SAFE_INTEGER, yMin = Number.MAX_SAFE_INTEGER, zMax = Number.MIN_SAFE_INTEGER, zMin = Number.MAX_SAFE_INTEGER;
        this._objects.forEach(value => {
            xMax = Math.max(value.position.x, xMax);
            yMax = Math.max(value.position.y, yMax);
            zMax = Math.max(value.position.z, zMax);
            xMin = Math.min(value.position.x, xMin);
            yMin = Math.min(value.position.y, yMin);
            zMin = Math.min(value.position.z, zMin);
        });
        let maxValue = Math.max(xMax, yMax, zMax, Math.abs(xMin), Math.abs(yMin), Math.abs(zMin));
        console.log('max value' + maxValue)
        */
    }

    spheresAct(scene: THREE.Scene){
            this._objects.forEach(obj => {
                obj.updateForce(this._objects);

            });
            let timeStep = Config.i().timeStep;
            this._objects.forEach(obj => {
                obj.reactToForce(timeStep, scene);
            })
    }


    get planets(): Array<Planet> {
        return this._planets;
    }

    get moons(): Array<Moon> {
        return this._moons;
    }

    get objects(): Array<PlanetaryObject> {
        return this._objects;
    }
}