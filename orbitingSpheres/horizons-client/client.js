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


function createObjectString(name, index, object){
    var x = 'var {0} = generateBasicPlanet();\n \
    {0}.name = \'{0}\';\n \
    {0}.radius = {1} * 1000; \n \
    {0}.mass = {2}; \n \
    {0}.color = { \n \
        r: 0xc2, g: 0xb3, b: 0xbb \n\
    }; \n \
    {0}.x = {3} * config.orbitingSpheres.AU; \n \
    {0}.y = {4} * config.orbitingSpheres.AU; \n \
    {0}.z = {5} * config.orbitingSpheres.AU; \n \
    {0}.vx = auPerDayToMPerSecond({6}); \n \
    {0}.vy = auPerDayToMPerSecond({7}); \n \
    {0}.vz = auPerDayToMPerSecond({8}); \n \
    {0}.labelPosition = -1; \n \
    {0}.isMoon = true;';
    console.log(x.format(name, object.radius, object.mass, object.x, object.y, object.z, object.vx, object.vy, object.vz));
}

function getObjectIndex(planet, moonIndex) {
    return '\'' + (planets.indexOf(planet) + 1) + ((moonIndex > 9) ? '' : '0') + moonIndex + '\'';
}

function fetchDataFromHorizons(planetName, moonIndex, moonName, callback){
    parameter[0].value = getObjectIndex(planetName, moonIndex);
    var url = '/horizons_batch.cgi?batch=l';

    parameter.forEach(function(param){
        url += '&' + param.key +  '=' + encodeURIComponent(param.value).replace(/'/g, '%27');
    });

    var options = {
        host: 'ssd.jpl.nasa.gov',
        path: url
    };
    console.log(url)
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
            var massRegex = /Mass\s*\(10\^(\d*)\skg\s*\)\s*=\s*(\d*\.?\d?)/;
            var mass = 0;
            var radius = 0;
            lines.forEach(function(line, index, array){
                if(line.indexOf('Radius') !== -1){
                    var radiusMatch = radiusRegex.exec(line);
                    radius = radiusMatch[1];
                }
                if(line.indexOf('Mass') !== -1){
                    var massMatch = massRegex.exec(line);
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


fetchDataFromHorizons('saturn', 16, 'prometheus', createObjectString);