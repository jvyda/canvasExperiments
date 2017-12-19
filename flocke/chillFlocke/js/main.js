var imageData = {};
var ctx = {};
var canvas = {};

var verticesAmount = 6;
var thatAngle = toDeg(2 * Math.PI / verticesAmount);
var morphAmount = 0.003;

var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    chillFlocke: {
        newFlockSizeFactor: 0.4,
        poleLengthFactor: 0.6,
        maxDepth: 5,
        initialSize: 250,
        structureAmount: 4,
        structures: {
            doubleEdged: {
                arc: thatAngle/2,
                arcRange: [thatAngle/2, thatAngle/2],
                arcDir: 0,
                sideLength: 60,
                sideLengthRange: [60, 60],
                sideLengthDir: 1.05
            },
            baseLine: {
                length: 25,
                lengthRange: [5, 40],
                lengthDir: 1 + morphAmount
            },
            spread: {
                length: 100,
                lengthRange: [50, 120],
                lengthDir: 1 + morphAmount,
                amountOfSpreads: 4,
                amountOfSpreadsRange: [1, 5],
                amountOfSpreadsDir: 0,
                arc: thatAngle,
                arcRange: [thatAngle, thatAngle],
                arcDir: 0,
                spreadDistance: 30,
                spreadDistanceRange: [25, 50],
                spreadDistanceDir: 1 + morphAmount
            },
            conjoined: {
                length: 100,
                lengthRange: [70, 150],
                lengthDir: 1 + morphAmount,
                branchPosition: 50,
                branchPositionRange: [25, 75],
                branchPositionDir: 1 + morphAmount,
                arcUp: thatAngle,
                arcUpRange: [thatAngle, thatAngle],
                arcUpDir: 0,
                arcDown: 70
            }
        },
        rangeChance: 0.5,
        morphDistance: morphAmount
    },
    general: {
        paused: false,
        fps: 10
    },
    flocke: {
        vertices: verticesAmount,
        lineWidthMethod: {
            innerWidth: 9,
            outerWidth: 9
        }
    }
};

function randomDirection(){
    return randomElement([1 + config.chillFlocke.morphDistance, 1 - config.chillFlocke.morphDistance]);
}

function createDoubleEdgedOptions(){
    return {
        arc: valueInRange(config.chillFlocke.structures.doubleEdged.arcRange),
        arcDir:0,
        sideLength: valueInRange(config.chillFlocke.structures.doubleEdged.sideLengthRange),
        sideLengthDir: randomDirection()
    }
}

function createBaseLineOptions(){
    return {
        length: valueInRange(config.chillFlocke.structures.baseLine.lengthRange),
        lengthDir: randomDirection()
    }
}

function createSpreadOptions(){
    return {
        length: valueInRange(config.chillFlocke.structures.spread.lengthRange),
        lengthDir: randomDirection(),
        amountOfSpreads: valueInRange(config.chillFlocke.structures.spread.amountOfSpreadsRange),
        amountOfSpreadsDir: 0,
        arc: valueInRange(config.chillFlocke.structures.spread.arcRange),
        arcDir: 0,
        spreadDistance: valueInRange(config.chillFlocke.structures.spread.spreadDistanceRange),
        spreadDistanceDir: randomDirection()
    }
}

function createConjoinedOptions(){
    return {
        length: valueInRange(config.chillFlocke.structures.conjoined.lengthRange),
        lengthDir: randomDirection(),
        branchPosition: valueInRange(config.chillFlocke.structures.conjoined.branchPositionRange),
        branchPositionDir: randomDirection(),
        arcUp: valueInRange(config.chillFlocke.structures.conjoined.arcUpRange),
        arcUpDir: 0
    }
}




var flockVerticeFun = function (depth) {
    return config.flocke.vertices;
};

var topFlocke = {
    size: config.chillFlocke.initialSize,
    arc: 2 * Math.PI * 0.25
};

var structureFun = [];
structureFun.push({fun: createBaseLineStructure, optFun: createBaseLineOptions, opt: config.chillFlocke.structures.baseLine});
structureFun.push({fun: createDoubleEdgeStructure, optFun: createDoubleEdgedOptions, opt: config.chillFlocke.structures.doubleEdged});
structureFun.push({fun: createSpreadStructure, optFun: createSpreadOptions, opt: config.chillFlocke.structures.spread});
structureFun.push({fun: createConjoinedStructure, optFun: createConjoinedOptions, opt: config.chillFlocke.structures.conjoined});

var alternativeFlocke;
var lastFlocke  = -1;
$(document).ready(function () {
    canvas = $("#canvas")[0];
    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;

    document.onkeypress = keyPressed;

    alternativeFlocke = createAlternativeFlocke();
    paintAlternativeFlocke(alternativeFlocke);
    setTimeout(function () {
        requestAnimationFrame(morphAndPaint);
    }, 1000 / config.general.fps)
    //createFlocke({x: config.size.width / 2, y: config.size.height / 2}, topFlocke, 1);

});



function createFlocke(baseCenter, flocke, depth) {
    if (depth > config.chillFlocke.maxDepth) return;
    flocke.vertices = [];
    flocke.center = {
        x: baseCenter.x + flocke.size * Math.cos(flocke.arc),
        y: baseCenter.y + flocke.size * Math.sin(flocke.arc)
    };

    var verticeAmount = flockVerticeFun(depth);
    var stepSize = 2 * Math.PI / verticeAmount;

    var actualStartingAngle = flocke.arc - 2 * Math.PI * 0.25;
    for (var arc = actualStartingAngle; arc <= (2 * Math.PI - 0.1 + actualStartingAngle); arc += stepSize) {
        var x = flocke.center.x + flocke.size * Math.cos(arc);
        var y = flocke.center.y + flocke.size * Math.sin(arc);
        flocke.vertices.push({
            x: x,
            y: y,
            representingAngle: arc,
            flocke: {size: flocke.size * config.chillFlocke.newFlockSizeFactor, arc: arc}
        })
    }

    ctx.moveTo(flocke.vertices[0].x, flocke.vertices[0].y);
    flocke.vertices.forEach(function (vertex) {
        ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.lineTo(flocke.vertices[0].x, flocke.vertices[0].y);
    ctx.stroke();

    flocke.vertices.forEach(function (vertex) {
        var x = vertex.x + flocke.size * config.chillFlocke.poleLengthFactor * Math.cos(vertex.representingAngle);
        var y = vertex.y + flocke.size * config.chillFlocke.poleLengthFactor * Math.sin(vertex.representingAngle);
        ctx.moveTo(vertex.x, vertex.y);
        ctx.lineTo(x, y);
        vertex.top = {
            x: x, y: y
        };
    });

    ctx.stroke();


    flocke.vertices.forEach(function (vertex) {
        createFlocke({x: vertex.top.x, y: vertex.top.y}, vertex.flocke, depth + 1)
    });

    //createFlocke({x: flocke.vertices[0].top.x, y: flocke.vertices[0].top.y}, flocke.vertices[0].flocke, depth + 1)
}



function createAlternativeFlocke() {
    var alternativeFlocke = createBasicEquallyDistributedFlocke();
    var structureFunsToUse =  [];
    for(var i = 0; i < config.chillFlocke.structureAmount; i++){
        var useRange  = Math.random() < config.chillFlocke.rangeChance;
        var options;
        var funPtr = randomElement(structureFun);
        if(useRange){
            options = funPtr.optFun();
        } else {
            options = funPtr.opt;
        }
        structureFunsToUse.push({fun: funPtr.fun, opt: options, defaultOpt: funPtr.opt});
    }

    alternativeFlocke.poles.forEach(function (pole) {
        var depth = 0;
        structureFunsToUse.forEach(function(funToUse){
            var newStructCreated = funToUse.fun(pole, alternativeFlocke, depth, funToUse, getFarthestStruct(pole, alternativeFlocke));
            pole.structs.push(newStructCreated);
            depth++;
        })
    });


    return alternativeFlocke;
}

function getBaseStruct(funToUse) {
    return {lines: [], points: [], structDefinition: funToUse}
}


function morphAround(alternativeFlocke, lastFlocke){
    lastFlocke = lastFlocke != -1 ? lastFlocke : alternativeFlocke;
    var newFlocke = createBasicEquallyDistributedFlocke();

    var structConfigToUse = [];
    alternativeFlocke.poles[0].structs.forEach(function(struct){
        struct.structDefinition.opt = getIncreasedValues(struct.structDefinition.opt, struct.structDefinition.defaultOpt);
        structConfigToUse.push(struct);
    });


    newFlocke.poles.forEach(function (pole) {
        var depth = 0;
        structConfigToUse.forEach(function(structConfig, index){
            var newlyCreatedStructToReplace = structConfig.structDefinition.fun(pole, newFlocke, depth, structConfigToUse[index].structDefinition, getFarthestStruct(pole, newFlocke));
            if(structConfig.structDefinition.fun === createSpreadStructure){
                morphSizesInSpread(newlyCreatedStructToReplace, lastFlocke.poles[0].structs[depth], structConfigToUse[index].structDefinition.opt, pole)
            }
            pole.structs.push(newlyCreatedStructToReplace);
            depth++;
        })
    });
    return newFlocke;
}


function morphSizesInSpread(spreadStruct, oldStruct, opts, pole){
    // last line is the center line
    for(var lineIndex = 0; lineIndex < spreadStruct.lines.length - 1; lineIndex++){
        var line = spreadStruct.lines[lineIndex];
        var pointInMiddle = line.next;
        var distance;
        // #spreads can change.. they do not exist yet....
        if(oldStruct.lines[lineIndex]){
            distance = pointDistance(oldStruct.lines[lineIndex].point, oldStruct.lines[lineIndex].next.point);
        } else {
            distance = 1;
        }
        var newPoint = getPointVec(pointInMiddle.point, createNormalizedVector(line.point, pointInMiddle.point), distance * (opts.spreadDistanceDir));
        line.point = newPoint;
    }

}

function getIncreasedValues(usedOptions, possibleOptions){
    var newOptions = {};
    for(var option in usedOptions){
        if(possibleOptions[option + 'Range']){
            var allowedRange = possibleOptions[option + 'Range'];
            var currentOptionValue = usedOptions[option];
            var newValue = 0;
            var direction = usedOptions[option + 'Dir'];
            var newDirection = direction;
            if(direction == 0){
                newValue = currentOptionValue;
            } else {
                var possibleValue = currentOptionValue * direction;
                if(direction > 1){
                    if(possibleValue < allowedRange[1]){
                        newValue = currentOptionValue * direction;
                    } else {
                        newDirection = 1 - config.chillFlocke.morphDistance;
                        newValue = currentOptionValue;
                    }
                } else {
                    if(possibleValue > allowedRange[0]){
                        newValue = currentOptionValue * direction;
                    } else {
                        newDirection = 1 + config.chillFlocke.morphDistance;
                        newValue = currentOptionValue;
                    }
                }
            }
            newOptions[option + 'Dir'] = newDirection;
            newOptions[option] = newValue;
        }
    }
    return newOptions;
}




