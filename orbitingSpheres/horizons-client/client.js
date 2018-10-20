var https = require("https");

var parameter = [
    { key: 'COMMAND', value: '\'506\''},
    { key: 'CENTER', value: '\'500@0\''},
    { key: 'MAKE_EPHEM', value: '\'YES\''},
    { key: 'TABLE_TYPE', value: '\'VECTORS\''},
    { key: 'START_TIME', value: '\'2017-06-06\''},
    { key: 'STOP_TIME', value: '\'2017-06-07\''},
    { key: 'STEP_SIZE', value: '\'1 d\''},
    { key: 'OUT_UNITS', value: '\'AU-D\''},
    { key: 'REF_PLANE', value: '\'ECLIPTIC\''},
    { key: 'REF_SYSTEM', value: '\'J2000\''},
    { key: 'VECT_CORR', value: '\'NONE\''},
    { key: 'VEC_LABELS', value: '\'YES\''},
    { key: 'VEC_DELTA_T', value: '\'NO\''},
    { key: 'CSV_FORMAT', value: '\'YES\''},
    { key: 'OBJ_DATA', value: '\'YES\''},
    { key: 'VEC_TABLE', value: '\'3\''}
    ];

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}



var planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];


function moonformat(name, index, object){
    var x = 'let {0} = new Moon({2}, \'{0}\', {1});\n \
    {0}.color = new THREE.Color(0xc2,0xb3, 0xbb); \n \
    let {0}Position = new THREE.Vector3(); \n \
    {0}Position.x = {3} * Constants.AU; \n \
    {0}Position.y = {4} * Constants.AU; \n \
    {0}Position.z = {5} * Constants.AU; \n \
    {0}.position.copy({0}Position); \n \
    \n \
    let {0}Velocity = new THREE.Vector3(); \n \
    {0}Velocity.x = Converter.auPerDayToMPerSecond({6}); \n \
    {0}Velocity.y = Converter.auPerDayToMPerSecond({7}); \n \
    {0}Velocity.z = Converter.auPerDayToMPerSecond({8}); \n \
    {0}.velocity.copy({0}Velocity);\n \
    ';
    console.log(x.format(name, object.radius, object.mass, object.x, object.y, object.z, object.vx, object.vy, object.vz));
}

function planetformat(values, planetName){
    var x = 'let {0} = new Planet({2}, \'{0}\', {1});\n \
    {0}.color = new THREE.Color(0xc2,0xb3, 0xbb); \n \
    let {0}Position = new THREE.Vector3(); \n \
    {0}Position.x = {3} * Constants.AU; \n \
    {0}Position.y = {4} * Constants.AU; \n \
    {0}Position.z = {5} * Constants.AU; \n \
    {0}.position.copy({0}Position); \n \
    \n \
    let {0}Velocity = new THREE.Vector3(); \n \
    {0}Velocity.x = Converter.auPerDayToMPerSecond({6}); \n \
    {0}Velocity.y = Converter.auPerDayToMPerSecond({7}); \n \
    {0}Velocity.z = Converter.auPerDayToMPerSecond({8}); \n \
    {0}.velocity.copy({0}Velocity);\n \
    ';
    console.log(x.format(planetName, values.radius, values.mass, values.x, values.y, values.z, values.vx, values.vy, values.vz));
}

function getObjectIndex(planet, moonIndex) {
    return '\'' + (planets.indexOf(planet) + 1) + ((moonIndex > 9) ? '' : '0') + moonIndex + '\'';
}

function getPlanetIndex(planet){
    return '\'' + (planets.indexOf(planet) + 1) + '99' + '\'';
}

function fetchMoonOfPlanet(planetName, moonIndex, moonName, callback){
    parameter[0].value = getObjectIndex(planetName, moonIndex);
    var url = '/horizons_batch.cgi?batch=l';

    parameter.forEach(function(param){
        url += '&' + param.key +  '=' + encodeURIComponent(param.value).replace(/'/g, '%27');
    });

    var options = {
        host: 'ssd.jpl.nasa.gov',
        path: url
    };
    var req = https.get(options, function(res){
        var body = [];
        res.on('data', function(chunk){
            body.push(chunk);
        });
        res.on('end', function(){
            var responseString = Buffer.concat(body).toString('binary');
            var lines = responseString.split(/\r?\n/);
            var vectorLine = '';
            var radiusRegex = /Radius\s*\(km\)\s*=\s*(\d*\.?\d?)/;
            let otherRadiusRegex = /Radius\s*\(gravity\),\s*km\s*=\s*(\d*\.?\d?)/;
            var massRegex = /Mass\s*\(10\^(\d*)\skg\s*\)\s*=\s*(\d*\.?\d?)/;
            var otherMassRegex = /Mass,\s*x10\^(\d*)\skg\s*\s*=\s*(\d*\.?\d*)/;
            var mass = 0;
            var radius = 0;
            lines.forEach(function(line, index, array){
                // moon and planes return two radius, just take the first one
                if(line.indexOf('Radius') !== -1 && radius === 0){
                    var radiusMatch;
                    if(line.indexOf('gravity') !== -1){
                        radiusMatch = otherRadiusRegex.exec(line);
                    } else {
                        radiusMatch = radiusRegex.exec(line);
                    }
                    radius = radiusMatch[1];
                }
                if(line.indexOf('Mass') !== -1 && mass === 0){
                    var massMatch;
                    if(line.indexOf('x10') !== -1){
                        massMatch = otherMassRegex.exec(line);
                    } else {
                        massMatch = massRegex.exec(line);
                    }
                    mass = massMatch[2] + ' * Math.pow(10, ' + massMatch[1] + ')'
                }
                if(line.indexOf('$$SOE') !== -1) {
                    vectorLine = array[index + 1];
                }
            });
            var values = vectorLine.split(',');
            var x = values[2];
            var y = values[3];
            var z = values[4];
            var vx = values[5];
            var vy = values[6];
            var vz = values[7];

            var planet = {
                x: x,
                y: y,
                z: z,
                vx: vx,
                vy: vy,
                vz: vz,
                radius: radius,
                mass: mass
            };
            callback(moonName, moonIndex, planet);
        })
    });


    req.on('error', function(e){
        console.log(e)
    });
}


function fetchPlanet(planetName, callback){
    parameter[0].value = getPlanetIndex(planetName);
    var url = '/horizons_batch.cgi?batch=l';

    parameter.forEach(function(param){
        url += '&' + param.key +  '=' + encodeURIComponent(param.value).replace(/'/g, '%27');
    });

    var options = {
        host: 'ssd.jpl.nasa.gov',
        path: url
    };
    var req = https.get(options, function(res){
        var body = [];
        res.on('data', function(chunk){
            body.push(chunk);
        });
        res.on('end', function(){
            var responseString = Buffer.concat(body).toString('binary');
            var lines = responseString.split(/\r?\n/);
            var vectorLine = '';
            var radiusRegex = /Radius\s*\(km\)\s*=\s*(\d*\.?\d?)/;
            let otherRadiusRegex = /Radius\s*\(gravity\),\s*km\s*=\s*(\d*\.?\d?)/;
            var massRegex = /Mass\s*\(10\^(\d*)\skg\s*\)\s*=\s*(\d*\.?\d?)/;
            var otherMassRegex = /Mass\s*x10\^(\d*)\s\(kg\)\s*=\s*(\d*\.?\d*)/;
            var mass = 0;
            var radius = 0;
            lines.forEach(function(line, index, array){
                // moon and planes return two radius, just take the first one
                if(line.indexOf('Radius') !== -1 && radius === 0){
                    var radiusMatch;
                    if(line.indexOf('gravity') !== -1){
                        radiusMatch = otherRadiusRegex.exec(line);
                    } else {
                        radiusMatch = radiusRegex.exec(line);
                    }
                    radius = radiusMatch[1];
                }
                if(line.indexOf('Mass') !== -1 && mass === 0){
                    var massMatch;
                    if(line.indexOf('x10') !== -1){
                        massMatch = otherMassRegex.exec(line);
                    } else {
                        massMatch = massRegex.exec(line);
                    }
                    mass = massMatch[2] + ' * Math.pow(10, ' + massMatch[1] + ')'
                }
                if(line.indexOf('$$SOE') !== -1) {
                    vectorLine = array[index + 1];
                }
            });
            var values = vectorLine.split(',');
            var x = values[2];
            var y = values[3];
            var z = values[4];
            var vx = values[5];
            var vy = values[6];
            var vz = values[7];

            var planet = {
                x: x,
                y: y,
                z: z,
                vx: vx,
                vy: vy,
                vz: vz,
                radius: radius,
                mass: mass
            };
            callback(planet, planetName);
        })
    });


    req.on('error', function(e){
        console.log(e)
    });
}


/*
fetchMoonOfPlanet('earth', 1, 'luna', moonformat);

fetchMoonOfPlanet('jupiter', 1, 'io', moonformat);
fetchMoonOfPlanet('jupiter', 2, 'europa', moonformat);
fetchMoonOfPlanet('jupiter', 3, 'ganymede', moonformat);
fetchMoonOfPlanet('jupiter', 4, 'callisto', moonformat);
fetchMoonOfPlanet('jupiter', 5, 'amalthea', moonformat);
fetchMoonOfPlanet('jupiter', 6, 'himalia', moonformat);
fetchMoonOfPlanet('jupiter', 7, 'elara', moonformat);

fetchMoonOfPlanet('saturn', 1, 'mimas', moonformat);
fetchMoonOfPlanet('saturn', 2, 'enceladus', moonformat);
fetchMoonOfPlanet('saturn', 3, 'tethys', moonformat);
fetchMoonOfPlanet('saturn', 4, 'dione', moonformat);
fetchMoonOfPlanet('saturn', 5, 'rhea', moonformat);
fetchMoonOfPlanet('saturn', 6, 'titan', moonformat);
fetchMoonOfPlanet('saturn', 7, 'hyperion', moonformat);
fetchMoonOfPlanet('saturn', 8, 'iapetus', moonformat);
fetchMoonOfPlanet('saturn', 9, 'phoebe', moonformat);
fetchMoonOfPlanet('saturn', 10, 'janus', moonformat);
fetchMoonOfPlanet('saturn', 11, 'epimetheus', moonformat);
fetchMoonOfPlanet('saturn', 16, 'prometheus', moonformat);

fetchMoonOfPlanet('uranus', 1, 'ariel', moonformat);
fetchMoonOfPlanet('uranus', 2, 'umbriel', moonformat);
fetchMoonOfPlanet('uranus', 3, 'titania', moonformat);
fetchMoonOfPlanet('uranus', 4, 'oberon', moonformat);
fetchMoonOfPlanet('uranus', 5, 'miranda', moonformat);
fetchMoonOfPlanet('uranus', 12, 'portia', moonformat);
fetchMoonOfPlanet('uranus', 15, 'puck', moonformat);
fetchMoonOfPlanet('uranus', 17, 'sycorax', moonformat);

fetchMoonOfPlanet('neptune', 1, 'triton', moonformat);
fetchMoonOfPlanet('neptune', 2, 'nereid', moonformat);
fetchMoonOfPlanet('neptune', 5, 'despina', moonformat);
fetchMoonOfPlanet('neptune', 6, 'galatea', moonformat);
fetchMoonOfPlanet('neptune', 7, 'larissa', moonformat);
fetchMoonOfPlanet('neptune', 8, 'proteus', moonformat);


fetchMoonOfPlanet('pluto', 1, 'charon', moonformat);
*/

/*
planets.forEach(value => {
    fetchPlanet(value, planetformat);
});
*/
fetchPlanet('sun', planetformat)
