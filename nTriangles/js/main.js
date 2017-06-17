var canvas;
var ctx;

var config = {
    size: {
        height: 3* window.innerHeight,
        width: 3* window.innerWidth
    },
    testingBed: {
        maxDepth: 6,
        triangleAmount: 7,
        side: 200
    }
};

var addedVertices = [];
var drawnVertices = [];

var vertice = {
    x: 0,
    y: 0,
    freeArc: 2 * Math.PI,
    triangles: []
};


function addTrianglesToVertice(vertice, depth) {
    depth += 1;
    addedVertices.push(vertice);
    if (depth > config.testingBed.maxDepth) return;
    console.log('vertice................................................................................................')
    console.log(vertice)
    var arcPerPiece = vertice.freeArc / (config.testingBed.triangleAmount - vertice.triangles.length);
    var startingVertice;
    var endingVertice;
    for (var existTriangleI = 0; existTriangleI < vertice.triangles.length; existTriangleI++) {
        var existingTriangle = vertice.triangles[existTriangleI];
        for (var existingVerticeI = 0; existingVerticeI < existingTriangle.vertices.length; existingVerticeI++) {
            var existingVertice = existingTriangle.vertices[existingVerticeI];
            if (pointDistance(vertice, existingVertice) > 1) {
                var mainVec = createNormalizedVector(existingVertice, vertice);
                for (var otherTriangleI = 0; otherTriangleI < vertice.triangles.length; otherTriangleI++) {
                    var otherTriangle = vertice.triangles[otherTriangleI];
                    for (var otherVerticeI = 0; otherVerticeI < otherTriangle.vertices.length; otherVerticeI++) {
                        var otherVertice = otherTriangle.vertices[otherVerticeI];
                        if (pointDistance(existingVertice, otherVertice) > 1 && pointDistance(otherVertice, vertice) > 1) {
                            var secondVec = createNormalizedVector(otherVertice, vertice);
                            var angle = angleBetweenTwoVectors(mainVec, secondVec);
                            if ((Math.abs(angle - vertice.freeArc) < 0.001)) {
                                endingVertice = otherVertice;
                                startingVertice = existingVertice;
                            } else if ((Math.abs(angle - (2 * Math.PI - vertice.freeArc)) < 0.001)) {
                                endingVertice = otherVertice;
                                startingVertice = existingVertice;
                            }
                        }
                    }
                }
            }
        }
    }
    var zeroX = vertice.x + config.testingBed.side * Math.cos(0);
    var zeroY = vertice.y + config.testingBed.side * Math.sin(0);
    var zero = {
        x: zeroX,
        y: zeroY
    };
    var arc = 0;
    console.log('starting and ending')
    console.log(startingVertice);
    console.log(endingVertice)
    var latestVertice;
    var lastVertice;
    if (vertice.freeArc < 2 * Math.PI) {
        var zeroCenter = createNormalizedVector(zero, vertice);
        var startCenter = createNormalizedVector(startingVertice, vertice);
        arc = -angleBetweenTwoVectors(startCenter, zeroCenter);
        var endCenter = createNormalizedVector(endingVertice, vertice);
        var angleBetween = angleBetweenTwoVectors(endCenter, startCenter);
        console.log(toDeg(arc))
        if (zero.y < startingVertice.y
            && !(Math.abs(Math.abs(angleBetween) - vertice.freeArc) > 0.001 && endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0)
            && !(endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y > 0)
            && !(endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0)
            && !(endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0)
            && !(endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x <= vertice.x && vertice.x > 0 && vertice.y < 0)
            && !(endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0)
            && !(endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0)
            && !(endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y < 0)
            && !(endingVertice.x < vertice.x && endingVertice.y > vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y < 0)
            && !(endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y < 0)
            && !(endingVertice.x >= vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0)
            && !(endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0)
            && !(endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y < 0)
            && !(endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y < 0)

        ) {
            arc *= -1;
            console.log('main')
        } else if (Math.abs(Math.abs(angleBetween) - vertice.freeArc) > 0.001 && endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            console.log('second')
        } else if (Math.abs(Math.abs(angleBetween) - vertice.freeArc) > 0.001 && endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            arc *= -1;
            console.log('third')
        } else if (endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y > 0) {
            arc *= -1;
            arcPerPiece *= -1;
            console.log('fourth')
        } else if (endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0) {
            arc *= -1;
            arcPerPiece *= -1;
            console.log('fifth')
        } else if (endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            console.log('sixth')
        } else if (endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x <= vertice.x && vertice.x > 0 && vertice.y < 0) {
            arc *= -1;
            arcPerPiece *= -1;
            console.log('seventh')
        } else if (endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0) {
            arc *= -1;
            arcPerPiece *= -1;
            console.log('eighth')
        } else if (endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y < vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            console.log('ninth')
        } else if (endingVertice.x < vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            console.log('tenth')
        } else if (endingVertice.x < vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            console.log('tenth')
        } else if (endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            arc *= -1;
            console.log('eleventh')
        } else if (endingVertice.x < vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            console.log('twelvth')
        } else if (endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            console.log('thirteenth')
        } else if (endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            arc *= -1;
            console.log('fourteenth')
        } else if (endingVertice.x < vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            console.log('fifteenth')
        } else if (endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            console.log('sixteenth')
        } else if (endingVertice.x < vertice.x && endingVertice.y > vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            arc *= -1;
            console.log('seventeenth')
        } else if (endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            console.log('eighteenth')
        } else if (endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x > 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            arc *= -1;
            console.log('nineteenth')
        } else if (endingVertice.x >= vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x > 0 && vertice.y > 0) {
            arcPerPiece *= -1;
            arc *= -1;
            console.log('twentieth')
        } else if (endingVertice.x > vertice.x && endingVertice.y > vertice.y && startingVertice.y < vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y < 0) {
            console.log('twetyoneth')
        } else if (endingVertice.x > vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y > 0) {
            arc *= -1;
            console.log('twentytwoth')
        }  else if (endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y < vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            console.log('twentytreeth')
        } else if (endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x > vertice.x && vertice.x < 0 && vertice.y < 0) {
            arcPerPiece *= -1;
            console.log('twentyfourth')
        } else if (endingVertice.x < vertice.x && endingVertice.y < vertice.y && startingVertice.y > vertice.y && startingVertice.x < vertice.x && vertice.x < 0 && vertice.y < 0) {
            arc *= -1;
            console.log('twentyfifth')
        }
        lastVertice = endingVertice;
        latestVertice = startingVertice;
        //if((toDeg(vertice.freeArc) << 0) == 224){
        //    arcPerPiece *= -1;
        //}

    } else {
        var initialVerticeX = vertice.x + config.testingBed.side * Math.cos(arc);
        var initialVerticeY = vertice.y + config.testingBed.side * Math.sin(arc);
        var initialVertice = {
            x: initialVerticeX,
            y: initialVerticeY,
            freeArc: 2 * Math.PI
        };
        initialVertice.triangles = [];
        latestVertice = initialVertice;
        lastVertice = initialVertice;
    }
    var latestTriangle;
    var lenght = Math.min(config.testingBed.side, vectorLenght(createVector(latestVertice, vertice)));
    lenght = Math.min(lenght, vectorLenght(createVector(lastVertice, vertice)));
    for (var i = vertice.triangles.length; i < config.testingBed.triangleAmount; i++) {
        var triangle = {};
        triangle.vertices = [];
        triangle.vertices.push(vertice);
        triangle.vertices.push(latestVertice);
        arc += arcPerPiece;
        var newPoint = false;
        var newVertice = {};
        if (i == (config.testingBed.triangleAmount - 1)) {
            triangle.vertices.push(lastVertice);
            // in a normal circle, the last triangle needs to be added to two vertices
            // if we fill up a circle, the last is newly created, and needs to be added to three
            var latestToCenter = createNormalizedVector(vertice, latestVertice);
            var latestToLast = createNormalizedVector(lastVertice, latestVertice);
            latestVertice.freeArc -= angleBetweenTwoVectors(latestToCenter, latestToLast);

            var lastToCenter = createNormalizedVector(vertice, lastVertice);
            var lastToLatest = createNormalizedVector(latestVertice, lastVertice);
            lastVertice.freeArc -= angleBetweenTwoVectors(lastToCenter, lastToLatest);
            //if (pointDistance(initialVertice, lastVertice) > 1) {
            //    initialVertice.triangles.push(triangle)
            //}
        } else {
            newPoint = true;
            var newVerticeX = vertice.x + lenght * Math.cos(arc);
            var newVerticeY = vertice.y + lenght * Math.sin(arc);
            newVertice.x = newVerticeX;
            newVertice.y = newVerticeY;
            newVertice.freeArc = 2 * Math.PI;
            newVertice.triangles = [];
            newVertice.triangles.push(triangle);
            triangle.vertices.push(newVertice);
        }
        vertice.triangles.push(triangle);
        latestVertice.triangles.push(triangle);
        if (newPoint) {
            var newToCenter = createNormalizedVector(vertice, newVertice);
            var newToOld = createNormalizedVector(latestVertice, newVertice);
            newVertice.freeArc -= angleBetweenTwoVectors(newToCenter, newToOld);

            var oldToCenter = createNormalizedVector(vertice, latestVertice);
            var oldToNew = createNormalizedVector(newVertice, latestVertice);
            latestVertice.freeArc -= angleBetweenTwoVectors(oldToCenter, oldToNew);
            latestVertice = newVertice;
        }
        latestTriangle = triangle;
        vertice.freeArc -= Math.abs(arcPerPiece);
    }
    lastVertice.triangles.push(latestTriangle);

    //vertice.triangles.forEach(function(triangle){
    //    triangle.vertices.forEach(function(vertice){
    //        if(vertice.freeArc > 0 && addedVertices.indexOf(vertice) < 0) {
    //            addTrianglesToVertice(vertice, depth)
    //        }
    //    })
    //})
}

function drawVertice(verticeToDraw, depth) {
    drawnVertices.push(verticeToDraw)
    depth++;
    var color = randomColor().styleRGB;
    if (depth > config.testingBed.maxDepth) return;
    for (var triangleI = 0; triangleI < verticeToDraw.triangles.length; triangleI++) {
        ctx.beginPath();
        ctx.strokeStyle = color
        ctx.fillStyle = color
        var triangle = verticeToDraw.triangles[triangleI];
        for (var verticeI = 0; verticeI < triangle.vertices.length; verticeI++) {
            var subVertice = triangle.vertices[verticeI];
            ctx.lineTo(subVertice.x, subVertice.y);
            //ctx.fillText(~~subVertice.x + ' ' + ~~subVertice.y + ' ', subVertice.x, subVertice.y);
            //ctx.fillText(~~toDeg(subVertice.freeArc) + ' ', subVertice.x, subVertice.y);
        }
        ctx.lineTo(triangle.vertices[0].x, triangle.vertices[0].y);
        ctx.stroke();
    }

    //vertice.triangles.forEach(function(triangle){
    //    triangle.vertices.forEach(function(vertice){
    //        if(drawnVertices.indexOf(vertice) < 0) {
    //            drawVertice(vertice, depth)
    //        }
    //    })
    //})
}
var visited = [];
var max = 2 * Math.PI;
var current;
function getMaxFreeVertice(verticeToLook){
    verticeToLook.triangles.forEach(function(triangle){
        triangle.vertices.forEach(function(subVertice){
            if(pointDistance(triangle.vertices[0], triangle.vertices[1]) < 10) return;
            if(visited.indexOf(subVertice) < 0){
                if(subVertice.freeArc > toRad(45) && subVertice.freeArc < max) {
                    max = subVertice.freeArc;
                    current = subVertice;
                }
                visited.push(subVertice);
                getMaxFreeVertice(subVertice)
            }
        });
    })
}


$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    trackTransforms(ctx);
    ctx.translate(config.size.width / 2, config.size.height / 2);
    ctx.font = '12px Arial';
    addTrianglesToVertice(vertice, 0);
    addTrianglesToVertice(vertice.triangles[0].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[1].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[5].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[6].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[1].triangles[5].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[1].triangles[5].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[0].vertices[1].triangles[6].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[1].triangles[2].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[0].vertices[1].triangles[4].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[0].vertices[1].triangles[2].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[0].vertices[1].triangles[4].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[2].triangles[2].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[1].triangles[6].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[2].triangles[6].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[2].triangles[3].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[2].triangles[4].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[0].vertices[2].triangles[3].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[2].triangles[3].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[1].triangles[5].vertices[2].triangles[5].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[5].vertices[1].triangles[2].vertices[1].triangles[3].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[5].vertices[1].triangles[2].vertices[1].triangles[2].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[1].vertices[2].triangles[4].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[1].triangles[5].vertices[2].triangles[3].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[2].triangles[5].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[2].triangles[6].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[0].vertices[1].triangles[5].vertices[1].triangles[3].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[1].triangles[4].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[1].triangles[5].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[1].triangles[5].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[1].triangles[6].vertices[1].triangles[5].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[1].vertices[2].triangles[3].vertices[2].triangles[4].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[1].triangles[3].vertices[2].triangles[5].vertices[2], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[1].triangles[3].vertices[2].triangles[6].vertices[2], 0)
    console.log(vertice.triangles[1].vertices[2].triangles[4].vertices[1])
    console.log(vertice)
    ctx.strokeStyle = 'red';
    drawVertice(vertice, 0);
    drawVertice(vertice.triangles[0].vertices[1], 0)
    drawVertice(vertice.triangles[1].vertices[1], 0)
    drawVertice(vertice.triangles[2].vertices[1], 0)
    drawVertice(vertice.triangles[3].vertices[1], 0)
    drawVertice(vertice.triangles[4].vertices[1], 0)
    drawVertice(vertice.triangles[5].vertices[1], 0)
    drawVertice(vertice.triangles[6].vertices[1], 0)
    drawVertice(vertice.triangles[2].vertices[1].triangles[5].vertices[1], 0)
    drawVertice(vertice.triangles[2].vertices[1].triangles[5].vertices[2], 0)
    drawVertice(vertice.triangles[0].vertices[1].triangles[6].vertices[1], 0)
    drawVertice(vertice.triangles[2].vertices[1].triangles[2].vertices[1], 0)
    drawVertice(vertice.triangles[0].vertices[1].triangles[4].vertices[1], 0)
    drawVertice(vertice.triangles[0].vertices[1].triangles[2].vertices[2], 0)
    drawVertice(vertice.triangles[0].vertices[1].triangles[4].vertices[2], 0)
    drawVertice(vertice.triangles[4].vertices[2].triangles[2].vertices[1], 0)
    drawVertice(vertice.triangles[3].vertices[1].triangles[6].vertices[1], 0)
    drawVertice(vertice.triangles[4].vertices[2].triangles[6].vertices[1], 0)
    drawVertice(vertice.triangles[3].vertices[2].triangles[3].vertices[2], 0)
    drawVertice(vertice.triangles[4].vertices[2].triangles[4].vertices[2], 0)
    drawVertice(vertice.triangles[0].vertices[2].triangles[3].vertices[2], 0)
    drawVertice(vertice.triangles[2].vertices[2].triangles[3].vertices[2], 0)
    drawVertice(vertice.triangles[2].vertices[1].triangles[5].vertices[2].triangles[5].vertices[2], 0)
    drawVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[2], 0)
    drawVertice(vertice.triangles[5].vertices[1].triangles[2].vertices[1].triangles[3].vertices[2], 0)
    drawVertice(vertice.triangles[5].vertices[1].triangles[2].vertices[1].triangles[2].vertices[2], 0)
    drawVertice(vertice.triangles[1].vertices[2].triangles[4].vertices[1], 0)
    drawVertice(vertice.triangles[3].vertices[1].triangles[5].vertices[2].triangles[3].vertices[2], 0)
    drawVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[2].triangles[5].vertices[2], 0)
    drawVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[2].triangles[6].vertices[2], 0)
    drawVertice(vertice.triangles[0].vertices[1].triangles[5].vertices[1].triangles[3].vertices[2], 0)
    drawVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[1].triangles[4].vertices[2], 0)
    drawVertice(vertice.triangles[6].vertices[1].triangles[5].vertices[1].triangles[5].vertices[2], 0)
    drawVertice(vertice.triangles[3].vertices[1].triangles[5].vertices[1], 0)
    drawVertice(vertice.triangles[3].vertices[1].triangles[6].vertices[1].triangles[5].vertices[1], 0)
    drawVertice(vertice.triangles[1].vertices[2].triangles[3].vertices[2].triangles[4].vertices[1], 0)
    drawVertice(vertice.triangles[4].vertices[1].triangles[3].vertices[2].triangles[5].vertices[2], 0)
    drawVertice(vertice.triangles[4].vertices[1].triangles[3].vertices[2].triangles[6].vertices[2], 0)

    console.log('starting dynamic')
    for(var i = 0; i < 446; i++){
        console.log('current i: ' + i)
        getMaxFreeVertice(vertice);
        visited = [];
        max = 2* Math.PI;
        addTrianglesToVertice(current, 0)
        drawVertice(current, 0)
    }

    console.log(toDeg(current.freeArc))
});
