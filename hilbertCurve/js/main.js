var ctx = {};
var canvas = {};

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    hilbertCurve: {
        width: 5,
        fps: 30,
        scala: 1,
        showHelp: true,
        baseTextSize: 12,
        showLinks: true,
        randomPoints: 2
    },
    dragonCurve: {
        width: 250,
        count: 0,
        colors: 4,
        dragonLevel: 15
    },
    mode: 2
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

function buildSector(dots, base){
    var sector = {};
    sector.width = config.hilbertCurve.width;
    sector.name = randomElement(names);
    sector.dotChain = buildDotChain(dots);
    sector.base = {x: base.x, y: base.y};
    return sector;
}

function buildDotChain(dots){
    var currentDot = {};
    var start = currentDot;
    currentDot.x = dots[0].x;
    currentDot.y = dots[0].y;
    currentDot.prev = undefined;
    currentDot.next = undefined;
    for(var i = 1; i < dots.length; i++){
        var newDot = {};
        newDot.x = dots[i].x;
        newDot.y = dots[i].y;
        currentDot.next = newDot;
        newDot.prev = currentDot;
        newDot.next = undefined;
        currentDot = newDot;
    }
    return start;
}

function translateSector(sector, offset){
   sector.base.x += offset.x;
   sector.base.y += offset.y;
}

function flipSectorHoriz(sector){
    var currentDot = sector.dotChain;
    while(currentDot != undefined){
        currentDot.x = sector.width - currentDot.x;
        currentDot = currentDot.next;
    }
}

function getDotsAsPoints(sector){
    var dots = [];
    var currentDot = sector.dotChain;
    while(currentDot != undefined){
        dots.push({x: currentDot.x, y: currentDot.y});
        currentDot = currentDot.next;
    }
    return dots;
}


var names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
function cloneSector(sector){
    var newSector = {};
    newSector.width = sector.width;
    newSector.name = randomElement(names);
    newSector.dotChain = buildDotChain(getDotsAsPoints(sector));
    newSector.base = {
        x: sector.base.x,
        y: sector.base.y
    };
    return newSector;
}


function swapMajorArea(majorArea, a, b){
    var temp = majorArea[a];
    majorArea[a] = majorArea[b];
    majorArea[b] = temp;
}


function flipMajorAreaHoriz(majorArea){
    if(majorArea.big){
        swapMajorArea(majorArea, 'first', 'second');
        swapMajorArea(majorArea, 'third', 'fourth');
        flipMajorAreaHoriz(majorArea.first);
        flipMajorAreaHoriz(majorArea.second);
        flipMajorAreaHoriz(majorArea.third);
        flipMajorAreaHoriz(majorArea.fourth);
        translateMajorArea(majorArea.first, {x: -majorArea.first.width, y: 0});
        translateMajorArea(majorArea.second, {x: majorArea.second.width, y: 0});
        translateMajorArea(majorArea.third, {x: -majorArea.third.width, y: 0});
        translateMajorArea(majorArea.fourth, {x: majorArea.fourth.width, y: 0});
    } else {
        swapSector(majorArea, 'first', 'second');
        swapSector(majorArea, 'third', 'fourth');
        flipSectorHoriz(majorArea.first);
        flipSectorHoriz(majorArea.second);
        flipSectorHoriz(majorArea.third);
        flipSectorHoriz(majorArea.fourth);
        translateSector(majorArea.first, {x: -majorArea.first.width, y: 0});
        translateSector(majorArea.second, {x: majorArea.second.width, y: 0});
        translateSector(majorArea.third, {x: -majorArea.third.width, y: 0});
        translateSector(majorArea.fourth, {x: majorArea.fourth.width, y: 0});
    }
}


function flipMajorArea90Deg(majorArea){
    if(majorArea.big){
        swapMajorArea(majorArea, 'third', 'first');
        swapMajorArea(majorArea, 'second', 'third');
        swapMajorArea(majorArea, 'third', 'fourth');
        flipMajorArea90Deg(majorArea.first, 90);
        flipMajorArea90Deg(majorArea.second, 90);
        flipMajorArea90Deg(majorArea.third, 90);
        flipMajorArea90Deg(majorArea.fourth, 90);
        translateMajorArea(majorArea.first, {x: 0, y: -majorArea.second.width});
        translateMajorArea(majorArea.second, {x: majorArea.second.width, y: 0});
        translateMajorArea(majorArea.third, {x: -majorArea.third.width, y: 0});
        translateMajorArea(majorArea.fourth, {x: 0, y: majorArea.fourth.width});
    } else {
        swapSector(majorArea, 'third', 'first');
        swapSector(majorArea, 'second', 'third');
        swapSector(majorArea, 'third', 'fourth');
        flipSectorDeg(majorArea.first, 90);
        flipSectorDeg(majorArea.second, 90);
        flipSectorDeg(majorArea.third, 90);
        flipSectorDeg(majorArea.fourth, 90);
        translateSector(majorArea.first, {x: 0, y: -majorArea.first.width});
        translateSector(majorArea.second, {x: majorArea.second.width, y: 0});
        translateSector(majorArea.third, {x: -majorArea.third.width, y: 0});
        translateSector(majorArea.fourth, {x: 0, y: majorArea.fourth.width});
    }
}

function flipSectorDeg(sector, degree){
    var currentDot = sector.dotChain;
    while(currentDot != undefined){
        rotatePoint({x: 0, y:0}, currentDot, degree);
        currentDot = currentDot.next;
    }
    var offset = getSectorPositionOffset(sector);
    if(offset.x != 0 || offset.y != 0){
        actuallyTranslateSector(sector, offset);
    }
}

function getSectorPositionOffset(sector){
    var currentDot = sector.dotChain;
    var offset = {x: 0, y: 0};
    while(currentDot != undefined){
        if(currentDot.x < 0){
            offset.x = sector.width;
        }
        if(currentDot.y < 0){
            offset.y = sector.width;
        }
        if(currentDot.x > sector.width){
            offset.x = -sector.width;
        }
        if(currentDot.y > sector.width){
            offset.y = -sector.width;
        }
        currentDot = currentDot.next;
    }
    return offset;
}

function actuallyTranslateSector(sector, offset){
    var currentDot = sector.dotChain;
    while(currentDot != undefined){
        currentDot.x += offset.x;
        currentDot.y += offset.y;
        currentDot = currentDot.next;
    }
}

function rotatePoint(base, point, angle){
    var sin = Math.sin(toRad(angle));
    var cos = Math.cos(toRad(angle));
    point.x -= base.x;
    point.y -= base.y;
    var xNew = point.x * cos - point.y * sin;
    var yNew = point.x * sin + point.y * cos;
    point.x = xNew + base.x;
    point.y = yNew + base.y;
}

function swapSector(majorArea, a, b){
    var temp = majorArea[a];
    majorArea[a] = majorArea[b];
    majorArea[b] = temp;
}

function cloneMajorArea(majorArea){
    var newMajorArea = {};
    if(majorArea.big){
        newMajorArea.first = cloneMajorArea(majorArea.first);
        newMajorArea.second = cloneMajorArea(majorArea.second);
        newMajorArea.third = cloneMajorArea(majorArea.third);
        newMajorArea.fourth = cloneMajorArea(majorArea.fourth);
    } else {
        newMajorArea.first = cloneSector(majorArea.first);
        newMajorArea.second = cloneSector(majorArea.second);
        newMajorArea.third = cloneSector(majorArea.third);
        newMajorArea.fourth = cloneSector(majorArea.fourth);
    }
    newMajorArea.width = majorArea.width;
    newMajorArea.big = majorArea.big;
    return newMajorArea;
}

function paintMajorArea(majorArea){
    if(majorArea.big){
        if(majorArea.first)
        paintMajorArea(majorArea.first);
        if(majorArea.second)
        paintMajorArea(majorArea.second);
        if(majorArea.third)
        paintMajorArea(majorArea.third);
        if(majorArea.fourth)
        paintMajorArea(majorArea.fourth);
    } else {
        if(majorArea.first)
        paintSector(majorArea.first);
        if(majorArea.second)
        paintSector(majorArea.second);
        if(majorArea.third)
        paintSector(majorArea.third);
        if(majorArea.fourth)
        paintSector(majorArea.fourth);
    }
}

function clearCanvas() {
    var topLeft = ctx.transformedPoint(0, 0);
    var bottomRight = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
}
function manageDrag() {
    ctx.translate(toMove.x, toMove.y);
    toMove.x = 0;
    toMove.y = 0;
}
function updateCanvas(){
    manageDrag();
    clearCanvas();
    if(config.hilbertCurve.showHelp){
        ctx.font = ~~(config.hilbertCurve.baseTextSize / config.hilbertCurve.scala + 1) + "px Arial";
        printHelp();
    }
    paintMajorArea(levels[level]);
    setTimeout(function () {
        animationId = requestAnimationFrame(updateCanvas);
    }, 1000 / config.hilbertCurve.fps)
}

function printHelp() {
    ctx.beginPath();
    var p = ctx.transformedPoint(config.size.width - 200, 0);
    var leftTopX = p.x;
    var leftTopY = p.y;
    var fontOffset = ~~(config.hilbertCurve.baseTextSize / config.hilbertCurve.scala + 1);
    ctx.fillText('HELP:', leftTopX, leftTopY);
    ctx.fillText('[d] - increase amount (caution!)', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[a] - decrease amount', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[r] - randomize!', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[l] - toggle links', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[j] - less random points for create', leftTopX, leftTopY += fontOffset);
    ctx.fillText('[k] - more random points for create', leftTopX, leftTopY += fontOffset);
    ctx.fillText('click & drag - move around', leftTopX, leftTopY += fontOffset);
    ctx.fillText('mouse wheel - zoom', leftTopX, leftTopY += fontOffset);
    ctx.fillText('#random points: ' + config.hilbertCurve.randomPoints, leftTopX, leftTopY += fontOffset);
    ctx.fillText('[h] - hide help', leftTopX, leftTopY += fontOffset);
}

function paintSector(sector){
    var currentDot = sector.dotChain;
    ctx.beginPath();
    var p = makeGlobal(currentDot, sector);
    ctx.moveTo(p.x, p.y);
    while(currentDot != undefined){
        var point = makeGlobal(currentDot, sector);
        ctx.lineTo(point.x, point.y);
        currentDot = currentDot.next;
    }
    ctx.stroke();
    if(sector.link && config.hilbertCurve.showLinks){
        ctx.strokeStyle = 'red';
        var start = makeGlobal(sector.link.start, sector);
        ctx.moveTo(start.x, start.y);
        var end = makeGlobal(sector.link.end, sector.link.partner);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.strokeStyle = 'black';
    }
}

function translateMajorArea(majorArea, offset){
    if(majorArea.big){
        translateMajorArea(majorArea.first, offset);
        translateMajorArea(majorArea.second, offset);
        translateMajorArea(majorArea.third, offset);
        translateMajorArea(majorArea.fourth, offset);
    } else {
        translateSector(majorArea.first, offset);
        translateSector(majorArea.second, offset);
        translateSector(majorArea.third, offset);
        translateSector(majorArea.fourth, offset);
    }
}


function interConnectMajorArea(majorArea){
    if(majorArea.first.big){
        var leftSectorsFirst = interConnectMajorArea(majorArea.first);
        var leftSectorsSecond = interConnectMajorArea(majorArea.second);
        var leftSectorsThird = interConnectMajorArea(majorArea.third);
        var leftSectorsFourth = interConnectMajorArea(majorArea.fourth);
        var openSectors = [];
        leftSectorsFirst.forEach(function(point){
            openSectors.push(point)
        });
        leftSectorsSecond.forEach(function(point){
            openSectors.push(point)
        });
        leftSectorsThird.forEach(function(point){
            openSectors.push(point)
        });
        leftSectorsFourth.forEach(function(point){
            openSectors.push(point)
        });
        for(var sI = 0; sI < openSectors.length; sI++) {
            var sectorStartAndEndPoint = openSectors[sI];
            var minDistance = 50000;
            var pointA;
            var pointB;
            var targetSector;
            var originSector;
            for(var s2 = 0; s2 < openSectors.length; s2++){
                var otherSectorStartAndEndPoint = openSectors[s2];
                var startStart = pointDistance(sectorStartAndEndPoint.point, otherSectorStartAndEndPoint.point);
                if(startStart < minDistance && startStart > 0.1 && startStart <= sectorStartAndEndPoint.sec.width) {
                    minDistance = startStart;
                    pointA = sectorStartAndEndPoint.point;
                    pointB = otherSectorStartAndEndPoint.point;
                    originSector = sectorStartAndEndPoint.sec;
                    targetSector = otherSectorStartAndEndPoint.sec;
                }
            }
            if(pointA && pointB && targetSector && !targetSector.link) {
                connectSectors(originSector, targetSector, pointA, pointB);
            }
        }
        var notLinkedSectors = [];
        for(var index = 0; index < openSectors.length; index++) {
            var sector = openSectors[index];
            if(!sector.sec.link){
                notLinkedSectors.push({point: sector.point, sec: sector.sec});
            }
        }
        return notLinkedSectors;
    } else {
        return interConnectSectorsInMajorArea(majorArea)
    }
}

function interConnectSectorsInMajorArea(majorArea){
    var firstSectors = getFirstAndLastSector(majorArea.first);
    var secondSectors = getFirstAndLastSector(majorArea.second);
    var thirdSectors = getFirstAndLastSector(majorArea.third);
    var fourthSectors = getFirstAndLastSector(majorArea.fourth);
    var sec = [firstSectors, secondSectors, thirdSectors, fourthSectors];

    for(var sI = 0; sI < sec.length; sI++) {
        var sectorStartAndEndPoint = sec[sI];
        var minDistance = 50000;
        var pointA;
        var pointB;
        var targetSector;
        var originSector;
        for(var s2 = 0; s2 < sec.length; s2++){
            var otherSectorStartAndEndPoint = sec[s2];
            if(pointDistance(sectorStartAndEndPoint.start.sec.base, otherSectorStartAndEndPoint.start.sec.base) < 0.1) continue;
            var startStart = pointDistance(sectorStartAndEndPoint.start.point, otherSectorStartAndEndPoint.start.point);
            if(startStart < minDistance && startStart > 0.1) {
                minDistance = startStart;
                pointA = sectorStartAndEndPoint.start.point;
                pointB = otherSectorStartAndEndPoint.start.point;
                originSector = sectorStartAndEndPoint.start.sec;
                targetSector = otherSectorStartAndEndPoint.start.sec;
            }
            var startEnd = pointDistance(sectorStartAndEndPoint.start.point, otherSectorStartAndEndPoint.end.point);
            if(startEnd < minDistance && startEnd > 0.1) {
                minDistance = startEnd;
                pointA = sectorStartAndEndPoint.start.point;
                pointB = otherSectorStartAndEndPoint.end.point;
                originSector = sectorStartAndEndPoint.start.sec;
                targetSector = otherSectorStartAndEndPoint.end.sec;
            }
            var endStart = pointDistance(sectorStartAndEndPoint.end.point, otherSectorStartAndEndPoint.start.point);
            if(endStart < minDistance && endStart > 0.1) {
                minDistance = endStart;
                pointA = sectorStartAndEndPoint.end.point;
                pointB = otherSectorStartAndEndPoint.start.point;
                originSector = sectorStartAndEndPoint.end.sec;
                targetSector = otherSectorStartAndEndPoint.start.sec;
            }
            var endEnd = pointDistance(sectorStartAndEndPoint.end.point, otherSectorStartAndEndPoint.end.point);
            if(endEnd < minDistance && endEnd > 0.1) {
                minDistance = endEnd;
                pointA = sectorStartAndEndPoint.end.point;
                pointB = otherSectorStartAndEndPoint.end.point;
                originSector = sectorStartAndEndPoint.end.sec;
                targetSector = otherSectorStartAndEndPoint.end.sec;
            }
        }
        if(pointA && pointB && targetSector && !targetSector.link) {
            connectSectors(originSector, targetSector, pointA, pointB);
        }
    }

    var notLinkedSectors = [];
    for(var index = 0; index < sec.length; index++) {
        var sector = sec[index];
        if(!sector.start.sec.link){
            notLinkedSectors.push({point: sector.start.point, sec: sector.start.sec});
        }
        if(!sector.end.sec.link){
            notLinkedSectors.push({point: sector.end.point, sec: sector.end.sec});
        }
    }
    return notLinkedSectors;
}

function getFirstAndLastSector(majorArea){
    // try with first sector
    var firstSector = {first: makeGlobal(firstPointOfSector(majorArea.first), majorArea.first), last: makeGlobal(lastPointOfSector(majorArea.first), majorArea.first), sec: majorArea.first};
    var secondSector = {first: makeGlobal(firstPointOfSector(majorArea.second), majorArea.second), last: makeGlobal(lastPointOfSector(majorArea.second), majorArea.second), sec: majorArea.second};
    var thirdSector = {first: makeGlobal(firstPointOfSector(majorArea.third), majorArea.third), last: makeGlobal(lastPointOfSector(majorArea.third), majorArea.third), sec: majorArea.third};
    var fourthSector = {first: makeGlobal(firstPointOfSector(majorArea.fourth), majorArea.fourth), last: makeGlobal(lastPointOfSector(majorArea.fourth), majorArea.fourth), sec: majorArea.fourth};
    var sectors = [firstSector, secondSector, thirdSector, fourthSector];
    var separateSectors = {};
    for(var sI = 0; sI < sectors.length; sI++){
        var thisSector = sectors[sI];
        var ending = isEndingPoint(thisSector.first, sectors, thisSector);
        if(ending){
            if(!separateSectors.start){
                separateSectors.start = {point: thisSector.first, sec: thisSector.sec };
            } else {
                separateSectors.end = {point: thisSector.first, sec: thisSector.sec };
            }
        }
        var ending2 = isEndingPoint(thisSector.last, sectors, thisSector);
        if(ending2){
            if(!separateSectors.start){
                separateSectors.start = {point: thisSector.last, sec: thisSector.sec };
            } else {
                separateSectors.end = {point:  thisSector.last, sec: thisSector.sec };
            }
        }
    }

    return separateSectors;
}

function isEndingPoint(point, restSectorS, thisSector){
    var ending = true;
    restSectorS.forEach(function(sector){
        if(sector.sec.base.x == thisSector.sec.base.x && sector.sec.base.y == thisSector.sec.base.y) return;
        if(pointDistance(point, sector.first) < 1 || pointDistance(point, sector.last) < 1){
            ending = false;
        }
    });
    return ending;
}


function makeGlobal(localPoint, sector){
    return {x: localPoint.x + sector.base.x, y: localPoint.y + sector.base.y};
}

function makeLocal(globalPoint, originalSector){
    return {x: globalPoint.x - originalSector.base.x, y: globalPoint.y - originalSector.base.y}
}

function firstPointOfSector(sector){
    return sector.dotChain;
}

function lastPointOfSector(sector){
    var currentDot = sector.dotChain;
    while(currentDot.next != undefined){
        currentDot = currentDot.next;
    }
    return currentDot;
}

function connectSectors(sectorA, sectorB, pointA, pointB){
    sectorB.link = {start: makeLocal(pointB, sectorB), end: makeLocal(pointA, sectorA), partner: sectorA};
    sectorA.link = {start: makeLocal(pointA, sectorA), end: makeLocal(pointB, sectorB), partner: sectorB};
}

var levels = [];
var level = 0;


$(document).ready(function () {
    var canvasJQuery = $("#canvas");
    canvas = canvasJQuery[0];
    ctx = canvas.getContext("2d");
    trackTransforms(ctx);
    canvas.height = config.size.height;
    canvas.width = config.size.width;
    ctx.translate(250, 250);
    canvas.addEventListener("mousedown", mouseClick, false);
    canvas.addEventListener("mouseup", mouseClick, false);
    canvas.addEventListener("mousemove", drag, false);
    canvasJQuery.on('wheel', mouseWheelEvent);
    ctx.lineWidth=0.5;
    //
    //setup(getSymbol(), false);
    //
    document.onkeypress = keyPressed;

    document.keydown = keyPressed;
    //
    //updateCanvas();
    createDragonCurve();
    drawDragonCurve();
});

var firstSegmentStart = {x: 0, y: 0};
var firstSegmentEnd = {x: config.dragonCurve.width, y: 0};
rotatePoint(firstSegmentStart, firstSegmentEnd, 45);
var secondSegmentEnd = {x: firstSegmentEnd.x + config.dragonCurve.width, y: firstSegmentEnd.y};
rotatePoint(firstSegmentEnd, secondSegmentEnd, -45);
var segment = {point: firstSegmentStart, next: undefined, col: randomColor()};
var segment2 = {point: firstSegmentEnd, next: undefined, col: randomColor()};
segment.next = segment2;
var segment3 = {point: secondSegmentEnd, next: undefined, col: randomColor()};
segment2.next = segment3;

var dragonCurve = segment;

var dragonCurves = [];
dragonCurves[-1] = dragonCurve;

function createDragonCurve(){
    config.dragonCurve.count = 3;
    for(var i = 0; i < config.dragonCurve.dragonLevel; i++){
        var segmentI = 1;
        var currentSegment = dragonCurve;
        while(currentSegment.next != undefined){
            splitAndRotateSegment(currentSegment, 45, segmentI);
            currentSegment = currentSegment.next.next;
            config.dragonCurve.count++;
            segmentI++;
        }
        dragonCurves[i] = copyDragonCurve(dragonCurve);
        console.log(dragonCurve)
    }
    config.dragonCurve.colorStepSize = config.dragonCurve.count / config.dragonCurve.colors << 0;
    console.log(dragonCurves)
}

function copyDragonCurve(existing){
    var newDragonCurve = {
        point: {
            x: existing.point.x,
            y: existing.point.y
        },
        next: undefined,
        col: {
            r: existing.col.r,
            g: existing.col.g,
            b: existing.col.b,
            styleRGB: existing.col.styleRGB
        }
    };
    var currentItem = existing;
    var newCurrentItem = newDragonCurve;
    while(currentItem.next != undefined){
        var copyItem = {
            point: {
                x: currentItem.point.x,
                y: currentItem.point.y
            },
            next: undefined,
            col: {
                r: currentItem.col.r,
                g: currentItem.col.g,
                b: currentItem.col.b,
                styleRGB: currentItem.col.styleRGB
            }
        };
        newCurrentItem.next = copyItem;
        newCurrentItem = copyItem;
        currentItem = currentItem.next;
    }
    return newDragonCurve;
}

function splitAndRotateSegment(segment, direction, iteration){
    var segmentLength = pointDistance(segment.point, segment.next.point);
    var heightC = segmentLength / 2;
    var segmentVector = createNormalizedVector(segment.next.point, segment.point);
    var segmentMiddle = {
        x: segment.point.x + segmentLength / 2 * segmentVector.x,
        y: segment.point.y + segmentLength / 2 * segmentVector.y
    };
    var deg = iteration % 2 == 0 ? 90 : -90;
    var rad = toRad(deg);
    var normalVector = {
        x: segmentVector.x *  Math.cos(rad) - segmentVector.y * Math.sin(rad),
        y: segmentVector.x *  Math.sin(rad) + segmentVector.y * Math.cos(rad)
    };
    segment.next = {
        point: {
            x: segmentMiddle.x + heightC * normalVector.x,
            y: segmentMiddle.y + heightC * normalVector.y
        },
        next: segment.next,
        col: randomColor()
    };
}


function drawDragonCurve(){
    clearCanvas();
    manageDrag();
    var currentSegment = dragonCurves[config.dragonCurve.dragonLevel - 1];
    ctx.moveTo(currentSegment.point.x, currentSegment.point.y);
    var cnt = 0;
    console.log('repaint')
    while(currentSegment.next != undefined){
        var end = currentSegment.next.point;
        ctx.lineTo(end.x, end.y);
        if((cnt % config.dragonCurve.colorStepSize) == 0){
            console.log('changing color to...' + currentSegment.col.styleRGB)
            ctx.strokeStyle = currentSegment.col.styleRGB;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
        }
        cnt++;
        currentSegment = currentSegment.next;
    }
    ctx.stroke();
    setTimeout(function () {
        animationId = requestAnimationFrame(drawDragonCurve);
    }, 1000 / config.hilbertCurve.fps)
}

function randomSymbol(){
    var firstPoints = [];
    var secondPoints = [];
    var thirdPoints = [];
    var fourthPoints = [];
    var points = config.hilbertCurve.randomPoints;
    firstPoints.push({x: config.hilbertCurve.width/2, y: config.hilbertCurve.width});
    for(var i = 0; i < points; i++){
        firstPoints.push({x: config.hilbertCurve.width * Math.random(), y: config.hilbertCurve.width * Math.random()})
    }
    firstPoints.push({x: config.hilbertCurve.width, y: config.hilbertCurve.width / 2});
    secondPoints.push({x: 0, y: config.hilbertCurve.width / 2});
    for(var i = 0; i < points; i++){
        secondPoints.push({x: config.hilbertCurve.width * Math.random(), y: config.hilbertCurve.width * Math.random()})
    }
    secondPoints.push({x: config.hilbertCurve.width/2, y: config.hilbertCurve.width});

    thirdPoints.push({x: config.hilbertCurve.width/2, y: 0});
    for(var i = 0; i < points; i++){
        thirdPoints.push({x: config.hilbertCurve.width * Math.random(), y: config.hilbertCurve.width * Math.random()})
    }
    thirdPoints.push({x: config.hilbertCurve.width/2, y: config.hilbertCurve.width});
    fourthPoints.push({x: config.hilbertCurve.width/2, y: 0});
    for(var i = 0; i < points; i++){
        fourthPoints.push({x: config.hilbertCurve.width * Math.random(), y: config.hilbertCurve.width * Math.random()})
    }
    fourthPoints.push({x: config.hilbertCurve.width / 2, y: config.hilbertCurve.width});


    var firstSector = buildSector(firstPoints, {x: 0, y: 0});
    var secondSector = buildSector(secondPoints, {x: config.hilbertCurve.width, y: 0});
    var thirdSector = buildSector(thirdPoints, {x: 0, y: config.hilbertCurve.width});
    var fourthSector = buildSector(fourthPoints, {x: config.hilbertCurve.width, y: config.hilbertCurve.width});

    var firstMajorArea = {};
    firstMajorArea.first = firstSector;
    firstMajorArea.second = secondSector;
    firstMajorArea.third = thirdSector;
    firstMajorArea.fourth = fourthSector;
    firstMajorArea.width = 2 * firstSector.width;
    firstMajorArea.big = false;
    return firstMajorArea;
}

function getSymbol() {
    var point1 = {x:  config.hilbertCurve.width / 2, y: config.hilbertCurve.width};
    var point2 = {x: config.hilbertCurve.width / 2, y: config.hilbertCurve.width / 2};
    var point3 = {x: config.hilbertCurve.width, y: config.hilbertCurve.width / 2};
    var firstSector = buildSector([point1, point2, point3], {x: 0, y: 0});
    var secondSector = cloneSector(firstSector);
    flipSectorHoriz(secondSector);
    translateSector(secondSector, {x: config.hilbertCurve.width, y: 0});
    var point4 = {x: config.hilbertCurve.width / 2, y: config.hilbertCurve.width / 2};
    var point5 = {x:  config.hilbertCurve.width / 2, y: 0};
    var thirdSector = buildSector([point4, point5], {x: 0, y: config.hilbertCurve.width});
    var fourthSector = cloneSector(thirdSector);
    flipSectorHoriz(fourthSector);
    translateSector(fourthSector, {x: config.hilbertCurve.width, y: 0});

    var firstMajorArea = {};
    firstMajorArea.first = firstSector;
    firstMajorArea.second = secondSector;
    firstMajorArea.third = thirdSector;
    firstMajorArea.fourth = fourthSector;
    firstMajorArea.width = 2 * firstSector.width;
    firstMajorArea.big = false;
    return firstMajorArea;
}
function setup(firstMajorArea, keepLevelCount){
    var oldLevels = 0;
    if(keepLevelCount){
        oldLevels = level;
    }
    levels = [];
    level = 0;
    level += 1;
    levels[level] = firstMajorArea;

    var secondMajorArea = cloneMajorArea(firstMajorArea);
    flipMajorAreaHoriz(secondMajorArea);
    translateMajorArea(secondMajorArea, {x: 2 * config.hilbertCurve.width, y: 0});

    var thirdMajorArea = cloneMajorArea(firstMajorArea);
    flipMajorArea90Deg(thirdMajorArea);
    translateMajorArea(thirdMajorArea, {x: 0, y: 2 * config.hilbertCurve.width});

    var fourthMajorArea = cloneMajorArea(thirdMajorArea);
    flipMajorAreaHoriz(fourthMajorArea);
    translateMajorArea(fourthMajorArea, {x: 2 * config.hilbertCurve.width, y: 0});

    var firstBigMajorArea = {};
    firstBigMajorArea.first = firstMajorArea;
    firstBigMajorArea.second = secondMajorArea;
    firstBigMajorArea.third = thirdMajorArea;
    firstBigMajorArea.fourth = fourthMajorArea;
    firstBigMajorArea.width = firstMajorArea.width * 2;
    firstBigMajorArea.big = true;

    level += 1;
    levels[level] = firstBigMajorArea;
    if(!keepLevelCount){
        for(var currentLevel = 0; currentLevel < 4; currentLevel++){
            addLevel()
        }
    } else {
        for(var currentLevel = 2; currentLevel < oldLevels; currentLevel++){
            addLevel()
        }
    }

    interConnectMajorArea(levels[level]);
}

function addLevel(){
    var lastObject = levels[level];
    var newSecond = cloneMajorArea(lastObject);
    flipMajorAreaHoriz(newSecond);
    translateMajorArea(newSecond, {x: lastObject.width, y: 0});

    var newThird = cloneMajorArea(lastObject);
    flipMajorArea90Deg(newThird);
    translateMajorArea(newThird, {x: 0, y: lastObject.width});

    var newFourth = cloneMajorArea(newThird);
    flipMajorAreaHoriz(newFourth);
    translateMajorArea(newFourth, {x: lastObject.width, y: 0});

    var newBigArea = {};
    newBigArea.first = lastObject;
    newBigArea.second = newSecond;
    newBigArea.third = newThird;
    newBigArea.fourth = newFourth;
    newBigArea.width = lastObject.width * 2;
    newBigArea.big = true;
    level += 1;
    levels[level]  = newBigArea;
}

function mouseWheelEvent(event) {
    scalePoint = getMousePos(canvas, event);
    scalePoint = ctx.transformedPoint(scalePoint.x,scalePoint.y);
    var scaleTo = event.originalEvent.deltaY < 0 ? 1.1 : 1/1.1;
    config.hilbertCurve.scala *= scaleTo;
    ctx.translate(scalePoint.x, scalePoint.y);
    ctx.scale(scaleTo, scaleTo);
    ctx.translate(-scalePoint.x, -scalePoint.y);
    event.preventDefault()
}

var mouseDown = false;

function mouseClick(event){
    mouseDown = !mouseDown;
    if(mouseDown){
        var mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.hilbertCurve.scala;
        mousePos.y /= config.hilbertCurve.scala;
        lastDrag = mousePos;
    }
}

function drag(event){
    if(mouseDown){
        var mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.hilbertCurve.scala;
        mousePos.y /= config.hilbertCurve.scala;
        toMove.x += mousePos.x - lastDrag.x;
        toMove.y += mousePos.y - lastDrag.y;
        lastDrag = mousePos;
    }
}

function eventIsKey(event, code) {
    return event.keyCode == code || event.charCode == code || event.which == code;
}

function keyPressed(event) {
    // left
    if (eventIsKey(event, 97)) {
        if(config.mode == 1){
            if(level > 0){
                level -= 1;
            }
        } else {
            config.dragonCurve.dragonLevel--;
        }
        // right
    } else if (eventIsKey(event, 100)) {
        if(config.mode == 1){
            if(level == levels.length - 1){
                addLevel();
                interConnectMajorArea(levels[level])
            } else {
                level += 1;
            }
        } else {
            config.dragonCurve.dragonLevel++;
        }
    } else if(eventIsKey(event, 104)){
        config.hilbertCurve.showHelp = !config.hilbertCurve.showHelp;
    } else if(eventIsKey(event, 114)){
        setup(randomSymbol(), true);
    } else if(eventIsKey(event, 108)){
        config.hilbertCurve.showLinks = !config.hilbertCurve.showLinks;
    } else if(eventIsKey(event, 106)){
        if(config.hilbertCurve.randomPoints > 0){
            config.hilbertCurve.randomPoints--;
        }
    } else if(eventIsKey(event, 107)){
        config.hilbertCurve. randomPoints++;
    }
}



