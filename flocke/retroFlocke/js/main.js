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
    retroFlocke: {
        vertices: verticesAmount,
        newFlockSizeFactor: 0.4,
        poleLengthFactor: 0.6,
        maxDepth: 5,
        initialSize: 250,
        structureAmount: 4,
        structures: {
            doubleEdged: {
                arc: thatAngle/2,
                arcRange: [thatAngle/2, thatAngle/2],
                sideLength: 60,
                sideLengthRange: [60, 60],
                // TODO rework this
                endLength: 60,
                endLengthRange: [50, 80]
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
        arc: valueInRange(config.retroFlocke.structures.doubleEdged.arcRange),
        sideLength: valueInRange(config.retroFlocke.structures.doubleEdged.sideLengthRange),
        endLength: valueInRange(config.retroFlocke.structures.doubleEdged.endLengthRange)
    }
}

function createBaseLineOptions(){
    return {
        length: valueInRange(config.retroFlocke.structures.baseLine.lengthRange)
    }
}

function createSpreadOptions(){
    return {
        length: valueInRange(config.retroFlocke.structures.spread.lengthRange),
        amountOfSpreads: valueInRange(config.retroFlocke.structures.spread.amountOfSpreadsRange),
        arc: valueInRange(config.retroFlocke.structures.spread.arcRange),
        spreadDistance: valueInRange(config.retroFlocke.structures.spread.spreadDistanceRange)
    }
}

function createConjoinedOptions(){
    return {
        length: valueInRange(config.retroFlocke.structures.conjoined.lengthRange),
        amountOfSpreads: valueInRange(config.retroFlocke.structures.conjoined.branchPositionRange),
        arcUp: valueInRange(config.retroFlocke.structures.conjoined.arcUpRange)
    }
}


function valueInRange(range){
    return range[0] + ((range[1] - range[0]) * Math.random()) << 0;
}






var flockVerticeFun = function (depth) {
    return config.retroFlocke.vertices;
};

var topFlocke = {
    size: config.retroFlocke.initialSize,
    arc: 2 * Math.PI * 0.25
};

var alternativeFlocke = {
    poles: [],
    center: {
        x: config.size.width / 2,
        y: config.size.height / 2
    }
};

var structureFun = [];
structureFun.push({fun: createBaseLineStructure, optFun: createBaseLineOptions, opt: config.retroFlocke.structures.baseLine});
structureFun.push({fun: createDoubleEdgeStructure, optFun: createDoubleEdgedOptions, opt: config.retroFlocke.structures.doubleEdged});
structureFun.push({fun: createSpreadStructure, optFun: createSpreadOptions, opt: config.retroFlocke.structures.spread});
structureFun.push({fun: createConjoinedStructure, optFun: createConjoinedOptions, opt: config.retroFlocke.structures.conjoined});


$(document).ready(function () {
    canvas = $("#canvas")[0];
    $("#canvas").css('background-color', 'rgba(0, 0, 0, 1)');
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    createAlternativeFlocke();
    paintAlternativeFlocke();

    //createFlocke({x: config.size.width / 2, y: config.size.height / 2}, topFlocke, 1);

});


function createFlocke(baseCenter, flocke, depth) {
    if (depth > config.retroFlocke.maxDepth) return;
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
            flocke: {size: flocke.size * config.retroFlocke.newFlockSizeFactor, arc: arc}
        })
    }

    ctx.moveTo(flocke.vertices[0].x, flocke.vertices[0].y);
    flocke.vertices.forEach(function (vertex) {
        ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.lineTo(flocke.vertices[0].x, flocke.vertices[0].y);
    ctx.stroke();

    flocke.vertices.forEach(function (vertex) {
        var x = vertex.x + flocke.size * config.retroFlocke.poleLengthFactor * Math.cos(vertex.representingAngle);
        var y = vertex.y + flocke.size * config.retroFlocke.poleLengthFactor * Math.sin(vertex.representingAngle);
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

function fixConjoined(depth) {
    return;
    var lastPole = alternativeFlocke.poles[alternativeFlocke.poles.length - 1];
    var lastStructure = lastPole.structs[depth];
    var lastLine = lastStructure.lines[lastStructure.lines.length - 2];
    var lastPoint = getLastInLine(lastLine);
    var firstPole = alternativeFlocke.poles[0];
    var firstStructure = firstPole.structs[depth];
    var firstLine = firstStructure.lines[lastStructure.lines.length - 3];
    var firstPoint = getLastInLine(firstLine);
    lastPoint.next = firstPoint;
}

function createAlternativeFlocke() {
    var stepSize = 2 * Math.PI / config.retroFlocke.vertices;
    var actualStartingAngle = 0;
    for (var arc = actualStartingAngle; arc <= (2 * Math.PI - 0.1 + actualStartingAngle); arc += stepSize) {
        alternativeFlocke.poles.push({
            structs: [],
            arc: arc
        });
    }

    var structureFunsToUse =  [];
    for(var i = 0; i < config.retroFlocke.structureAmount    ; i++){
        var useRange  = Math.random() < config.retroFlocke.rangeChance;
        var options;
        var funPtr = randomElement(structureFun);
        if(useRange){
            options = funPtr.optFun();
        } else {
            options = funPtr.opt;
        }
        structureFunsToUse.push({fun: funPtr.fun, opt: options});
    }

    alternativeFlocke.poles.forEach(function (pole) {
        var depth = 0;
        structureFunsToUse.forEach(function(funToUse){
            funToUse.fun(pole, alternativeFlocke, depth, funToUse.opt);
            if (funToUse.fun === createConjoinedStructure && alternativeFlocke.poles.indexOf(pole) === alternativeFlocke.poles.length - 1 && depth > 0){
                fixConjoined(depth);
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
            var lowerPoint = getPointVec(firstPoint.point, normalVector, config.retroFlocke.lineWidthMethod.innerWidth / 2);
            var upperPoint = getPointVec(firstPoint.point, normalVector, -config.retroFlocke.lineWidthMethod.innerWidth / 2);
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
    ctx.lineWidth = config.retroFlocke.lineWidthMethod.outerWidth;
    ctx.strokeStyle = 'white';
    paintStruct(struct);
    ctx.stroke();
    if(config.retroFlocke.lineWidthMethod.innerWidth !== config.retroFlocke.lineWidthMethod.innerWidth) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = config.retroFlocke.lineWidthMethod.innerWidth;
        paintStruct(struct);
        ctx.stroke();
    }
}

function paintAlternativeFlocke() {
    alternativeFlocke.poles.forEach(function (pole) {
        pole.structs.forEach(function (struct) {
            doItViaLineWidth(struct);
        })
    });
    ctx.stroke();
}


function createBaseLineStructure(pole, flocke, depth, options) {
    var startPoint = getFarthestStruct(pole, flocke);
    var newStruct = getBaseStruct();

    var centerLine = {
        point: startPoint
    };

    var centerEnd = {
        point: getPoint(startPoint, pole.arc, options.length)
    };

    centerLine.next = centerEnd;
    newStruct.lines.push(centerLine);
    newStruct.endPoint = centerEnd.point;
    pole.structs.push(newStruct);

}

function createDoubleEdgeStructure(pole, flocke, depth, options) {
    var startPoint = getFarthestStruct(pole, flocke);
    var newStruct = getBaseStruct();
    var lowerMiddlePoint = getPoint(startPoint, pole.arc + toRad(options.arc), options.sideLength);
    var lowerLineStart = {
        point: startPoint, next: undefined
    };

    var lowerLineMiddle = {
        point: lowerMiddlePoint, next: undefined
    };
    lowerLineStart.next = lowerLineMiddle;

    var lowerLineEnd = {
        point:  getPoint(lowerMiddlePoint, pole.arc - toRad(options.arc), options.sideLength),
        next: undefined
    };
    lowerLineMiddle.next = lowerLineEnd;

    newStruct.lines.push(lowerLineStart);

    var upperMiddlePoint = getPoint(startPoint, pole.arc - toRad(options.arc), options.sideLength);
    var upperLineStart = {
        point: startPoint, next: undefined
    };

    var upperLineMiddle = {
        point: upperMiddlePoint, next: undefined
    };
    upperLineStart.next = upperLineMiddle;

    var upperLineEnd = {
        point: getPoint(upperMiddlePoint, pole.arc + toRad(options.arc), options.sideLength),
        next: undefined
    };
    upperLineMiddle.next = upperLineEnd;
    newStruct.lines.push(upperLineStart);
    newStruct.endPoint = upperLineEnd.point;

    var arc = angleBetweenTwoVectors(createNormalizedVector(lowerMiddlePoint, startPoint), createNormalizedVector(upperLineEnd.point, startPoint));
    console.log(toDeg(arc))
    pole.structs.push(newStruct)

}

function createSpreadStructure(pole, flocke, depth, options){
    var startPoint = getFarthestStruct(pole, flocke);
    var newStruct = getBaseStruct();
    var distance = options.length / options.amountOfSpreads;
    var centralLine = {point: startPoint};
    var centralLinetoAdd = centralLine;
    for(var spreadI = 0; spreadI < options.amountOfSpreads; spreadI++){
        var pointInLine = getPoint(startPoint, pole.arc, distance * (spreadI + 1));
        var lowerPoint = getPoint(pointInLine, pole.arc + toRad(options.arc), options.spreadDistance);
        var upperPoint = getPoint(pointInLine, pole.arc - toRad(options.arc), options.spreadDistance);
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
    pole.structs.push(newStruct);
}

function createConjoinedStructure(pole, flocke, depth, options){
    var startPoint = getFarthestStruct(pole, flocke);
    var newStruct = getBaseStruct();
    var innerFactor = 25;
    var targetFactor = 60;
    var upperLine = {
        point: getPoint(startPoint, pole.arc, options.branchPosition)
    };
    var nextUpper = {
        point: getPoint(upperLine.point, pole.arc - 2 * toRad(options.arcUp), depth * innerFactor)
    };

    upperLine.next = nextUpper;
    var finalUpper = {
        point: getPoint(upperLine.point, pole.arc - toRad(options.arcUp), depth * targetFactor)
    };
    nextUpper.next = finalUpper;
    newStruct.lines.push(upperLine);

    var lowerLine = {
        point: getPoint(startPoint, pole.arc, options.branchPosition)
    };
    var nextLower = {
        point: getPoint(lowerLine.point, pole.arc + 2 * toRad(options.arcUp), depth * innerFactor)
    };

    lowerLine.next = nextLower;
    var finalLower = {
        point: getPoint(lowerLine.point, pole.arc + toRad(options.arcUp), depth * targetFactor)
    };
    nextLower.next = finalLower;
    newStruct.lines.push(lowerLine);
    var centralLine = {
        point: startPoint
    };

    var centralEndPoint = {
        point: getPoint(startPoint, pole.arc, options.length)
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
    pole.structs.push(newStruct);
}


function getLastInLine(line){
    var lineToUse = line;
    while(lineToUse.next !== undefined){
        lineToUse = lineToUse.next;
    }
    return lineToUse;
}

function getBaseStruct() {
    return {lines: [], points: []}
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
