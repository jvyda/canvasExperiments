var imageData = {};
var ctx = {};
var canvas = {};

var verticesAmount = 6;
var thatAngle = toDeg(2 * Math.PI / verticesAmount);

var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    flocke: {
        vertices: verticesAmount,
        newFlockSizeFactor: 0.4,
        poleLengthFactor: 0.6,
        maxDepth: 5,
        initialSize: 250,
        structureAmount: 4,
        structures: {
            doubleEdged: {
                arc: thatAngle,
                arcRange: [thatAngle, thatAngle],
                sideLength: 60,
                sideLengthRange: [60, 60]
            },
            baseLine: {
                length: 25,
                lengthRange: [5, 40]
            },
            spread: {
                length: 100,
                lengthRange: [50, 120],
                amountOfSpreads: 4,
                amountOfSpreadsRange: [1, 5],
                arc: thatAngle,
                arcRange: [thatAngle, thatAngle],
                spreadDistance: 30,
                spreadDistanceRange: [25, 50]
            },
            conjoined: {
                length: 100,
                lengthRange: [70, 150],
                branchPosition: 50,
                branchPositionRange: [25, 75],
                arcUp: thatAngle,
                arcUpRange: [thatAngle, thatAngle],
                arcDown: 70
            }
        },
        rangeChance: 0.5,
        lineWidthMethod: {
            innerWidth: 8,
            outerWidth: 9
        }
    }
};

function createDoubleEdgedOptions(){
    return {
        arc: valueInRange(config.flocke.structures.doubleEdged.arcRange),
        sideLength: valueInRange(config.flocke.structures.doubleEdged.sideLengthRange)
    }
}

function createBaseLineOptions(){
    return {
        length: valueInRange(config.flocke.structures.baseLine.lengthRange)
    }
}

function createSpreadOptions(){
    return {
        length: valueInRange(config.flocke.structures.spread.lengthRange),
        amountOfSpreads: valueInRange(config.flocke.structures.spread.amountOfSpreadsRange),
        arc: valueInRange(config.flocke.structures.spread.arcRange),
        spreadDistance: valueInRange(config.flocke.structures.spread.spreadDistanceRange)
    }
}

function createConjoinedOptions(){
    return {
        length: valueInRange(config.flocke.structures.conjoined.lengthRange),
        branchPositionRange: valueInRange(config.flocke.structures.conjoined.branchPositionRange),
        arcUp: valueInRange(config.flocke.structures.conjoined.arcUpRange)
    }
}


function valueInRange(range){
    return range[0] + ((range[1] - range[0]) * Math.random()) << 0;
}






var flockVerticeFun = function (depth) {
    return config.flocke.vertices;
};

var topFlocke = {
    size: config.flocke.initialSize,
    arc: 2 * Math.PI * 0.25
};



var structureFun = [];
structureFun.push({fun: createBaseLineStructure, optFun: createBaseLineOptions, opt: config.flocke.structures.baseLine});
structureFun.push({fun: createDoubleEdgeStructure, optFun: createDoubleEdgedOptions, opt: config.flocke.structures.doubleEdged});
structureFun.push({fun: createSpreadStructure, optFun: createSpreadOptions, opt: config.flocke.structures.spread});
structureFun.push({fun: createConjoinedStructure, optFun: createConjoinedOptions, opt: config.flocke.structures.conjoined});


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    var alternativeFlocke = {
        poles: [],
        center: {
            x: config.size.width / 2,
            y: config.size.height / 2
        }
    };
    createAlternativeFlocke();
    paintAlternativeFlocke();
    setTimeout(function(){
        morphAround();
        console.log('new?')
        paintAlternativeFlocke();
    }, 2000)
    //createFlocke({x: config.size.width / 2, y: config.size.height / 2}, topFlocke, 1);

});


function createFlocke(baseCenter, flocke, depth) {
    if (depth > config.flocke.maxDepth) return;
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
            flocke: {size: flocke.size * config.flocke.newFlockSizeFactor, arc: arc}
        })
    }

    ctx.moveTo(flocke.vertices[0].x, flocke.vertices[0].y);
    flocke.vertices.forEach(function (vertex) {
        ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.lineTo(flocke.vertices[0].x, flocke.vertices[0].y);
    ctx.stroke();

    flocke.vertices.forEach(function (vertex) {
        var x = vertex.x + flocke.size * config.flocke.poleLengthFactor * Math.cos(vertex.representingAngle);
        var y = vertex.y + flocke.size * config.flocke.poleLengthFactor * Math.sin(vertex.representingAngle);
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

function fixConjoined(depth, flocke) {
    return;
    var lastPole = flocke.poles[flocke.poles.length - 1];
    var lastStructure = lastPole.structs[depth];
    var lastLine = lastStructure.lines[lastStructure.lines.length - 2];
    var lastPoint = getLastInLine(lastLine);
    var firstPole = flocke.poles[0];
    var firstStructure = firstPole.structs[depth];
    var firstLine = firstStructure.lines[lastStructure.lines.length - 3];
    var firstPoint = getLastInLine(firstLine);
    lastPoint.next = firstPoint;
}

function createAlternativeFlocke() {
    var stepSize = 2 * Math.PI / config.flocke.vertices;
    var actualStartingAngle = 0;
    for (var arc = actualStartingAngle; arc <= (2 * Math.PI - 0.1 + actualStartingAngle); arc += stepSize) {
        alternativeFlocke.poles.push({
            structs: [],
            arc: arc
        });
    }

    var structureFunsToUse =  [];
    for(var i = 0; i < config.flocke.structureAmount    ; i++){
        var useRange  = Math.random() < config.flocke.rangeChance;
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
            if (funToUse.fun === createConjoinedStructure && alternativeFlocke.poles.indexOf(pole) === alternativeFlocke.poles.length - 1 && depth > 0){
                fixConjoined(depth, alternativeFlocke);
            }
            depth++;
        })
    })



}

function paintStruct(struct) {
    struct.lines.forEach(function (line) {
        var curPoint = line.point;
        ctx.moveTo(curPoint.x, curPoint.y);
        do {
            line = line.next;
            if (line === undefined) break;
            curPoint = line.point;
            ctx.lineTo(curPoint.x, curPoint.y)
        } while (true)
    });
}

// not gonna bother, very.. buggy
function doItManually(struct){
    struct.lines.forEach(function (line) {
       var firstPoint = line;
       var nextPoint = line.next !== undefined ? line.next : undefined;
       while(nextPoint !== undefined){
           var vec = createNormalizedVector(nextPoint.point, firstPoint.point);
           var normalVector = rotate90Deg(vec);
           var lowerPoint = getPointVec(firstPoint.point, normalVector, config.flocke.lineWidthMethod.innerWidth / 2);
           var upperPoint = getPointVec(firstPoint.point, normalVector, -config.flocke.lineWidthMethod.innerWidth / 2);
           var lowerTarget = getPointVec(lowerPoint, vec, pointDistance(nextPoint.point, firstPoint.point));
           var upperTarget = getPointVec(upperPoint, vec, pointDistance(nextPoint.point, firstPoint.point));
           ctx.moveTo(lowerPoint.x, lowerPoint.y);
           ctx.lineTo(lowerTarget.x, lowerTarget.y);
           ctx.moveTo(upperPoint.x, upperPoint.y);
           ctx.lineTo(upperTarget.x, upperTarget.y);
           firstPoint = firstPoint.next;
           nextPoint = firstPoint.next !== undefined ? line.next : undefined;
       }
    });
}


function doItViaLineWidth(struct) {
    ctx.beginPath();
    ctx.lineWidth = config.flocke.lineWidthMethod.outerWidth;
    ctx.strokeStyle = 'black';
    paintStruct(struct);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = config.flocke.lineWidthMethod.innerWidth;
    paintStruct(struct);

    ctx.stroke();
}

function paintAlternativeFlocke() {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    alternativeFlocke.poles.forEach(function (pole) {
        pole.structs.forEach(function (struct) {
            doItViaLineWidth(struct);
        })
    });
    ctx.stroke();
}


function createBaseLineStructure(pole, flocke, depth, funToUse, startPoint) {
    var newStruct = getBaseStruct(funToUse);

    var centerLine = {
        point: startPoint
    };

    var centerEnd = {
        point: getPoint(startPoint, pole.arc, funToUse.opt.length)
    };

    centerLine.next = centerEnd;
    newStruct.lines.push(centerLine);
    newStruct.endPoint = centerEnd.point;
    return newStruct;
}

function createDoubleEdgeStructure(pole, flocke, depth, funToUse,  startPoint) {
    var newStruct = getBaseStruct(funToUse);
    var lowerMiddlePoint = getPoint(startPoint, pole.arc + toRad(funToUse.opt.arc), funToUse.opt.sideLength);
    var lowerLineStart = {
        point: startPoint, next: undefined
    };

    var lowerLineMiddle = {
        point: lowerMiddlePoint, next: undefined
    };
    lowerLineStart.next = lowerLineMiddle;

    var lowerLineEnd = {
        point:  getPoint(lowerMiddlePoint, pole.arc - toRad(funToUse.opt.arc), funToUse.opt.sideLength),
        next: undefined
    };
    lowerLineMiddle.next = lowerLineEnd;

    newStruct.lines.push(lowerLineStart);

    var upperMiddlePoint = getPoint(startPoint, pole.arc - toRad(funToUse.opt.arc), funToUse.opt.sideLength);
    var upperLineStart = {
        point: startPoint, next: undefined
    };

    var upperLineMiddle = {
        point: upperMiddlePoint, next: undefined
    };
    upperLineStart.next = upperLineMiddle;

    var upperLineEnd = {
        point: getPoint(upperMiddlePoint, pole.arc + toRad(funToUse.opt.arc), funToUse.opt.sideLength),
        next: undefined
    };
    upperLineMiddle.next = upperLineEnd;
    newStruct.lines.push(upperLineStart);
    newStruct.endPoint = upperLineEnd.point;

    return newStruct;
}

function createSpreadStructure(pole, flocke, depth, funToUse, startPoint){
    var newStruct = getBaseStruct(funToUse);
    var distance = funToUse.opt.length / funToUse.opt.amountOfSpreads;
    var centralLine = {point: startPoint};
    var centralLinetoAdd = centralLine;
    for(var spreadI = 0; spreadI < funToUse.opt.amountOfSpreads; spreadI++){
        var pointInLine = getPoint(startPoint, pole.arc, distance * (spreadI + 1));
        var lowerPoint = getPoint(pointInLine, pole.arc + toRad(funToUse.opt.arc), funToUse.opt.spreadDistance);
        var upperPoint = getPoint(pointInLine, pole.arc - toRad(funToUse.opt.arc), funToUse.opt.spreadDistance);
        var spreadLineUpper = {
            point: upperPoint
        };
        var spreadLineMiddle = {
            point: pointInLine
        };
        spreadLineUpper.next = spreadLineMiddle;
        var spreadLineLower = {
            point: lowerPoint
        };
        spreadLineLower.next = spreadLineMiddle;
        newStruct.lines.push(spreadLineUpper);
        newStruct.lines.push(spreadLineLower);
        var newCentralPoint = {
            point: pointInLine
        };
        centralLine.next = newCentralPoint;
        centralLine = newCentralPoint;
    }
    newStruct.lines.push(centralLinetoAdd);
    newStruct.endPoint = centralLine.point;
    return newStruct;
}

function createConjoinedStructure(pole, flocke, depth, funToUse, startPoint){
    var newStruct = getBaseStruct(funToUse);
    var innerFactor = 25;
    var targetFactor = 60;
    var upperLine = {
        point: getPoint(startPoint, pole.arc, funToUse.opt.branchPosition)
    };
    var nextUpper = {
        point: getPoint(upperLine.point, pole.arc - 2 * toRad(funToUse.opt.arcUp), depth * innerFactor)
    };

    upperLine.next = nextUpper;
    var finalUpper = {
        point: getPoint(upperLine.point, pole.arc - toRad(funToUse.opt.arcUp), depth * targetFactor)
    };
    nextUpper.next = finalUpper;
    newStruct.lines.push(upperLine);

    var lowerLine = {
        point: getPoint(startPoint, pole.arc, funToUse.opt.branchPosition)
    };
    var nextLower = {
        point: getPoint(lowerLine.point, pole.arc + 2 * toRad(funToUse.opt.arcUp), depth * innerFactor)
    };

    lowerLine.next = nextLower;
    var finalLower = {
        point: getPoint(lowerLine.point, pole.arc + toRad(funToUse.opt.arcUp), depth * targetFactor)
    };
    nextLower.next = finalLower;
    newStruct.lines.push(lowerLine);
    var centralLine = {
        point: startPoint
    };

    var centralEndPoint = {
        point: getPoint(startPoint, pole.arc, funToUse.opt.length)
    };
    centralLine.next = centralEndPoint;
    if(flocke.poles.length > 0 && false){
        if(pole.structs.length > 0){
            if(flocke.poles.indexOf(pole) > 0) {
                var poleToAttachto = flocke.poles[flocke.poles.indexOf(pole) - 1];
                var linesToAttachto = poleToAttachto.structs[depth].lines;
                finalUpper.next = getLastInLine(linesToAttachto[linesToAttachto.length - 2]);
            }
        }
    }
    newStruct.lines.push(centralLine);
    newStruct.endPoint = centralEndPoint.point;
    return newStruct;
}


function getLastInLine(line){
    var lineToUse = line;
    while(lineToUse.next !== undefined){
        lineToUse = lineToUse.next;
    }
    return lineToUse;
}

function getBaseStruct(funToUse) {
    return {lines: [], points: [], structDefinition: funToUse}
}


function morphAround(){
    var newFlocke = {
        poles: [],
        center: {
            x: config.size.width / 2,
            y: config.size.height / 2
        }
    };
    alternativeFlocke.poles.forEach(function (pole) {
        newFlocke.poles.push({
            structs: [],
            arc: pole.arc
        });
    });

    var oldStructs = [];

    alternativeFlocke.poles[0].structs.forEach(function(struct){
        struct.structDefinition.opt = getIncreasedValues(struct.structDefinition.opt, struct.structDefinition.defaultOpt);
        oldStructs.push(struct);
    });


    newFlocke.poles.forEach(function (pole, poleIndex, arrayOfPoles) {
        var depth = 0;
        oldStructs.forEach(function(newStruct, index, arrayOfStructs){
            var newlyCreatedStructToReplace = newStruct.structDefinition.fun(pole, newFlocke, depth, oldStructs[index].structDefinition, getFarthestStruct(pole, newFlocke));
            pole.structs.push(newlyCreatedStructToReplace);
            if (newStruct.structDefinition.fun === createConjoinedStructure && alternativeFlocke.poles.indexOf(pole) === alternativeFlocke.poles.length - 1 && depth > 0){
                fixConjoined(depth, newFlocke);
            }
            depth++;
        })
    });

    alternativeFlocke = newFlocke;
}


function getIncreasedValues(usedOptions, possibleOptions){
    var newOptions = {};
    for(var option in usedOptions){
        if(possibleOptions[option + 'Range']){
            newOptions[option] = valueInRange(possibleOptions[option + 'Range']);
        }
    }
    return newOptions;
}


function getFarthestStruct(pole, flocke) {
    var foundStruct;
    var currentMaxDistance = 0;
    if (pole.structs.length === 0) {
        return flocke.center;
    }
    pole.structs.forEach(function (struct) {
        var structPointDistance = pointDistance(struct.endPoint, flocke.center);
        if (structPointDistance > currentMaxDistance) {
            currentMaxDistance = structPointDistance;
            foundStruct = struct;
        }
    });
    return foundStruct.endPoint;
}