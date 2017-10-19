var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    voronoi: {
        dotAmount: 10
    },
    general: {
        fps: 60
    }
};


var mouseP = {
    x: config.size.width / 2, y: config.size.height / 2
};

var dots = [];

function addPiStuff(dots){
    dots.forEach(function(dot){
        ctx.fillText(dot.x + ' ' + dot.y, dot.x, dot.y)
        dot.z = dot.x * dot.x + dot.y * dot.y;
    })
}

function updateCanvas(){
    dots[0].x = mouseP.x;
    dots[0].y = mouseP.y;

    ctx.clearRect(0, 0, config.size.width, config.size.height);
    //while(amountOfDoneDots(dots) < dots.length){
    var konvexHull = findHull(dots, true);
    console.log(konvexHull)
    addPiStuff(dots);
    unDoDots(dots);
    findFacets(konvexHull);
    //}
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    dots.forEach(function(dot){
        ctx.rect(dot.x, dot.y, 1,1);
    });
    ctx.stroke();
    ctx.strokeStyle = 'black';
    unDoDots(dots);
    //setTimeout(function () {
    //    animationId = requestAnimationFrame(updateCanvas);
    //}, 1000 / config.general.fps)
}

function unDoDots(dots){
    dots.forEach(function(dot){
        dot.done = false;
    })
}

function findFacets(hull){
    var bottom = findLowestDot(dots);
    var left = findLeftestDot(dots);
    var right = findRightestDot(dots);
    var top = findHighestDot(dots);

    var firstFacet = findFacet(left, hull, [bottom, right, top]);
    firstFacet.forEach(function(line){
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
    });
    ctx.stroke();
}

function findFacet(endDot, hull, otherDots){
    var facet = [];
    var currentDot = endDot;
    do {
        var line = findDotInHull(currentDot, hull);
        console.log(line)
        currentDot = line.start;
        if(dotInList(currentDot, otherDots)) break;
        facet.push(line);
    } while(true);
    return facet;
}

function dotInList(dot, dotList){
    var found = false;
    dotList.forEach(function(dotFromList){
        if(found) return;
         if(pointDistance(dotFromList, dot) < 0.01){
            found = true;
        }
    });

    return found;
}

function findDotInHull(dot, hull){
    var hullPtr = hull;
    do {
        if(hullPtr.line){
            if(pointDistance(hullPtr.line.end, dot) < 0.01){
                return hullPtr.line;
            }
        }
        hullPtr = hullPtr.next;
    } while(hullPtr && (hullPtr.next || hullPtr.line));
}

function findHull(dots, print){
    var hull = {};
    var initialDot = findLowestDot(dots);
    var lastDot = initialDot;
    var dotBefore = {x: 0, y: 0};
    var cnt = 0;
    var currentHullPtr = hull;
    var lastVector = createNormalizedVector(dotBefore, initialDot);
    do {
        var newHullPtr = {};
        var foundDot = findWithBiggestArc(dots, lastVector, lastDot, initialDot, dotBefore);
        if(!foundDot) {
            newHullPtr.line = {start: {x: lastDot.x, y: lastDot.y}, end: {x: initialDot.x, y: initialDot.y}};
            currentHullPtr.next = newHullPtr;
            break;
        }
        newHullPtr.line = {start: {x: lastDot.x, y: lastDot.y}, end: {x: foundDot.x, y: foundDot.y}};
        newHullPtr.next = undefined;
        currentHullPtr.next = newHullPtr;
        currentHullPtr = newHullPtr;
        lastVector = createNormalizedVector(lastDot, foundDot);
        dotBefore = lastDot;
        lastDot = foundDot;
        cnt++;
    } while(true);
    if(print){
        var hullPtr = hull;
        do {
            if(hullPtr.line){

                ctx.fillText(hullPtr.line.start.x + ' ' + hullPtr.line.start.y, hullPtr.line.start.x, hullPtr.line.start.y)

                ctx.moveTo(hullPtr.line.start.x, hullPtr.line.start.y);
                ctx.lineTo(hullPtr.line.end.x, hullPtr.line.end.y);
            }
            hullPtr = hullPtr.next;
        } while(hullPtr && (hullPtr.next || hullPtr.line));
        ctx.stroke();
        ctx.fill();
    }
    return hull;
}

function isOrigin(dot){
    return dot.x == 0 && dot.y == 0;
}

function findWithBiggestArc(dots, baseVec, baseDot, exitDot, dotBefore){
    var foundDot = undefined;
    var biggestArc = 0;
    dots.forEach(function(dot){
        if(dot.done && !pointDistance(dot, exitDot) < 0.01) return;
        var otherVec = createNormalizedVector(dot, baseDot);
        var otherArc = angleBetweenTwoVectors(otherVec, baseVec);
        if(isOrigin(dotBefore)){
            var arcSym = {x: otherVec.x + baseVec.x, y: otherVec.y + baseVec.y};
            if(arcSym.y < 0){
                otherArc = 2 * Math.PI - otherArc;
            }
        }
        if(otherArc > biggestArc){
            biggestArc = otherArc;
            foundDot = dot;
        }
    });
    if(!foundDot || pointDistance(foundDot, exitDot) < 0.01) return undefined;
    foundDot.done = true;
    return foundDot;
}

function findLowestDot(dots){
    var lowestDot = {x: config.size.width, y: config.size.height};
    dots.forEach(function(dot){
        if(dot.done) return;
        if(dot.y < lowestDot.y){
            lowestDot = dot;
        }
    });
    lowestDot.done = true;
    return lowestDot;
}

function findHighestDot(dots){
    var highestDot = {x: 0, y: 0};
    dots.forEach(function(dot){
        if(dot.done) return;
        if(dot.y > highestDot.y){
            highestDot = dot;
        }
    });
    highestDot.done = true;
    return highestDot;
}

function findRightestDot(dots){
    var highestDot = {x: 0, y: 0};
    dots.forEach(function(dot){
        if(dot.done) return;
        if(dot.x > highestDot.x){
            highestDot = dot;
        }
    });
    highestDot.done = true;
    return highestDot;
}

function findLeftestDot(dots){
    var highestDot = {x: config.size.width, y: 0};
    dots.forEach(function(dot){
        if(dot.done) return;
        if(dot.x < highestDot.x){
            highestDot = dot;
        }
    });
    highestDot.done = true;
    return highestDot;
}

function generateDots(){
    for(var i = 0; i < config.voronoi.dotAmount; i++){
        dots.push({
            x: randomNumberButAtLeast(config.size.width - 100, 0) + 50,
            y: randomNumberButAtLeast(config.size.height - 100, 0) + 50
        });
    }
}

function amountOfDoneDots(dots){
    var amount = 0;
    dots.forEach(function(dot){
        if(dot.done) {
            amount++;
        }
    });

    return amount;
}

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;

    canvas.onmousemove = setMousePos;
    trackTransforms(ctx);
    ctx.translate(0, config.size.height);
    ctx.scale(1, -1);
    generateDots();

    requestAnimationFrame(updateCanvas);

});

function setMousePos(e) {
    var p = getMousePos(canvas, e);
    mouseP = ctx.transformedPoint(p.x, p.y);
}


// TODO refacture
$(window).bind('touchmove', function(jQueryEvent) {
    jQueryEvent.preventDefault();
    var event = window.event;
    var p = {x: event.touches[0].pageX, y: event.touches[0].pageY}
    mouseP = ctx.transformedPoint(p.x, p.y);
});

