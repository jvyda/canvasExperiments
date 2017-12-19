function keyPressed(event) {
    // p
    if (eventIsKey(event, 112)) {
        config.general.paused = !config.general.paused;
    }
}


function morphAndPaint(){
    var newFlocke = config.general.paused ? lastFlocke : morphAround(alternativeFlocke, lastFlocke);
    lastFlocke = newFlocke;
    paintAlternativeFlocke(newFlocke);
    setTimeout(function () {
        requestAnimationFrame(morphAndPaint);
    }, 1000 / config.general.fps)
}

function createBasicEquallyDistributedFlocke() {
    var basicFlocke = {
        poles: [],
        center: {
            x: config.size.width / 2,
            y: config.size.height / 2
        }
    };
    var stepSize = 2 * Math.PI / config.flocke.vertices;
    var actualStartingAngle = 0;
    for (var arc = actualStartingAngle; arc <= (2 * Math.PI - 0.1 + actualStartingAngle); arc += stepSize) {
        basicFlocke.poles.push({
            structs: [],
            arc: arc
        });
    }
    return basicFlocke;
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

function paintAlternativeFlocke(alternativeFlocke) {
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    alternativeFlocke.poles.forEach(function (pole) {
        pole.structs.forEach(function (struct) {
            doItViaLineWidth(struct);
        })
    });
    ctx.stroke();
}

function doItViaLineWidth(struct) {
    ctx.beginPath();
    ctx.lineWidth = config.flocke.lineWidthMethod.outerWidth;
    ctx.strokeStyle = 'white';
    paintStruct(struct);
    ctx.stroke();
    if(config.flocke.lineWidthMethod.innerWidth !== config.flocke.lineWidthMethod.innerWidth) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = config.flocke.lineWidthMethod.innerWidth;
        paintStruct(struct);
        ctx.stroke();
    }
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

    }
    var newCentralPoint = {
        // end point is better to be further away than latest central point
        // TODO why + distance * 2?
        point: getPoint(startPoint, pole.arc, funToUse.opt.length + distance * 2)
    };
    centralLine.next = newCentralPoint;
    centralLine = newCentralPoint;
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