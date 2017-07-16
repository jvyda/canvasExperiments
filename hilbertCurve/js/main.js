var ctx = {};
var canvas = {};

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    hilbertCurve: {
        width: 40
    }
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

function swapSectorDiff(majorAreaA, majorAreaB, a, b){
    var temp = majorAreaA[a];
    majorAreaA[a] = majorAreaB[b];
    majorAreaB[b] = temp;
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

function resizeMajorArea(majorArea, faktor){
    resizeSector(majorArea.first, 1/2);
    resizeSector(majorArea.second, 1/2);
    resizeSector(majorArea.third, 1/2);
    resizeSector(majorArea.fourth, 1/2);
}

function resizeSector(sector, faktor){
    var currentDot = sector.dotChain;
    sector.base.x *= faktor;
    sector.base.y *= faktor;
    while(currentDot != undefined){
        currentDot.x *= faktor;
        currentDot.y *= faktor;
        currentDot = currentDot.next;
    }
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

function paintSector(sector){
    var currentDot = sector.dotChain;
    ctx.beginPath();
    ctx.moveTo(sector.base.x + currentDot.x, sector.base.y + currentDot.y);
    while(currentDot != undefined){
        ctx.lineTo(sector.base.x + currentDot.x, sector.base.y + currentDot.y);
        currentDot = currentDot.next;
    }
    ctx.stroke();
    if(sector.link){
        ctx.strokeColor = 'red';
        ctx.moveTo(sector.link.start.x, sector.link.start.y);
        ctx.lineTo(sector.link.end.x, sector.link.end.y);
        ctx.stroke();
        ctx.strokeColor = 'black';
    }
}

function printMajorArea(majorArea){
    printSector(majorArea.first);
    printSector(majorArea.second);
    printSector(majorArea.third);
    printSector(majorArea.fourth);
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
        interConnectMajorArea(majorArea.first);
        interConnectMajorArea(majorArea.second);
        interConnectMajorArea(majorArea.third);
        interConnectMajorArea(majorArea.fourth);
    } else {
        interConnectSectorsInMajorArea(majorArea)
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
        for(var s2 = 0; s2 < sec.length; s2++){
            var otherSectorStartAndEndPoint = sec[s2];
            var startStart = pointDistance(sectorStartAndEndPoint.start.point, otherSectorStartAndEndPoint.start.point);
            if(startStart < minDistance && startStart > 0.1) {
                minDistance = startStart;
                pointA = sectorStartAndEndPoint.start.point;
                pointB = otherSectorStartAndEndPoint.start.point;
                targetSector = otherSectorStartAndEndPoint.start.sec;
            }
            var startEnd = pointDistance(sectorStartAndEndPoint.start.point, otherSectorStartAndEndPoint.end.point);
            if(startEnd < minDistance && startStart > 0.1) {
                minDistance = startEnd;
                pointA = sectorStartAndEndPoint.start.point;
                pointB = otherSectorStartAndEndPoint.end.point;
                targetSector = otherSectorStartAndEndPoint.end.sec;
            }
        }
        connectSectors(sectorStartAndEndPoint.start.sec, targetSector, pointA, pointB);
    }
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
            console.log('ending found...')
            if(!separateSectors.start){
                separateSectors.start = {point: thisSector.first, sec: thisSector.sec };
            } else {
                separateSectors.end = {point: thisSector.first, sec: thisSector.sec };
            }
        }
        var ending2 = isEndingPoint(thisSector.last, sectors, thisSector);
        if(ending2){
            console.log('ending found...')
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
    sectorB.link = {start: pointB, end: pointA};
    sectorA.link = {start: pointA, end: pointB};
}


function printSector(sector){
    console.log('sector::::::::::::' + sector.name);
    console.log(sector.base.x + ' ' + sector.base.y);
    var currentDot = sector.dotChain;
    while(currentDot != undefined){
        console.log('x: ' + currentDot.x + ' y:' + currentDot.y);
        currentDot = currentDot.next;
    }
}




$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.height = config.size.height;
    canvas.width = config.size.width;
    var point1 = {x: config.hilbertCurve.width/2, y: config.hilbertCurve.width};
    var point2 = {x: config.hilbertCurve.width/2, y: config.hilbertCurve.width/2};
    var point3 = {x: config.hilbertCurve.width, y: config.hilbertCurve.width/2};
    var firstSector = buildSector([point1, point2, point3], {x: 0, y: 0});
    var secondSector = cloneSector(firstSector);
    flipSectorHoriz(secondSector);
    translateSector(secondSector, {x: config.hilbertCurve.width, y: 0});
    var point4 = {x: config.hilbertCurve.width/2, y: config.hilbertCurve.width/2};
    var point5 = {x: config.hilbertCurve.width/2, y: 0};
    var thirdSector = buildSector([point4, point5], {x: 0, y: config.hilbertCurve.width});
    var fourthSector = cloneSector(thirdSector);
    translateSector(fourthSector, {x: config.hilbertCurve.width, y: 0});

    var firstMajorArea = {};
    firstMajorArea.first = firstSector;
    firstMajorArea.second = secondSector;
    firstMajorArea.third = thirdSector;
    firstMajorArea.fourth = fourthSector;
    firstMajorArea.width = 2 * firstSector.width;
    firstMajorArea.big = false;

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

    var secondBigMajorArea = cloneMajorArea(firstBigMajorArea);
    translateMajorArea(secondBigMajorArea, {x: 4* config.hilbertCurve.width, y: 0});
    flipMajorAreaHoriz(secondBigMajorArea);

    var thirdBigMajorArea = cloneMajorArea(firstBigMajorArea);
    translateMajorArea(thirdBigMajorArea, {x: 0, y: 4 * config.hilbertCurve.width});
    flipMajorArea90Deg(thirdBigMajorArea);

    var fourthBigMajorArea = cloneMajorArea(thirdBigMajorArea);
    translateMajorArea(fourthBigMajorArea, {x: 4 * config.hilbertCurve.width, y: 0});
    flipMajorAreaHoriz(fourthBigMajorArea);

    var firstBiggerMajorArea = {};
    firstBiggerMajorArea.first = firstBigMajorArea;
    firstBiggerMajorArea.second = secondBigMajorArea;
    firstBiggerMajorArea.third = thirdBigMajorArea;
    firstBiggerMajorArea.fourth = fourthBigMajorArea;
    firstBiggerMajorArea.width = firstBigMajorArea.width * 2;
    firstBiggerMajorArea.big = true;

    var secondBiggerMajorArea = cloneMajorArea(firstBiggerMajorArea);
    translateMajorArea(secondBiggerMajorArea, {x: 8* config.hilbertCurve.width, y: 0});
    flipMajorAreaHoriz(secondBiggerMajorArea);

    var thirdBiggerMajorArea = cloneMajorArea(firstBiggerMajorArea);
    translateMajorArea(thirdBiggerMajorArea, {x: 0, y: 8 * config.hilbertCurve.width});
    flipMajorArea90Deg(thirdBiggerMajorArea);

    var fourthBiggerMajorArea = cloneMajorArea(thirdBiggerMajorArea);
    translateMajorArea(fourthBiggerMajorArea, {x: 8 * config.hilbertCurve.width, y: 0});
    flipMajorAreaHoriz(fourthBiggerMajorArea);

    var firstFinalArea = {};
    firstFinalArea.first = firstBiggerMajorArea;
    firstFinalArea.second = secondBiggerMajorArea;
    firstFinalArea.third = thirdBiggerMajorArea;
    firstFinalArea.fourth = fourthBiggerMajorArea;
    firstFinalArea.width = firstBiggerMajorArea.width * 2;
    firstFinalArea.big = true;

    interConnectMajorArea(firstBigMajorArea);

    paintMajorArea(firstBigMajorArea);

    //paintMajorArea(firstFinalArea);

});


