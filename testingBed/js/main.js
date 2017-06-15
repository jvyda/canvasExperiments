var canvas;
var ctx;

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    testingBed: {
        maxDepth: 4,
        triangleAmount: 7,
        side: 150
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
    console.log('____________________VERTICE START__________________________________________________________')
    console.log(vertice)
    var arcPerPiece = vertice.freeArc / (config.testingBed.triangleAmount - vertice.triangles.length);
    var maxAngle = 0;
    var startingVertice;
    var endingVertice;
    for (var existTriangleI = 0; existTriangleI < vertice.triangles.length; existTriangleI++) {
        var existingTriangle = vertice.triangles[existTriangleI];
        console.log('using triangle for search')
        console.log(existingTriangle)
        for (var existingVerticeI = 0; existingVerticeI < existingTriangle.vertices.length; existingVerticeI++) {
            var existingVertice = existingTriangle.vertices[existingVerticeI];
            console.log('using vertice as anchor')
            console.log(existingVertice)
            if (pointDistance(vertice, existingVertice) > 1) {
                var mainVec = createNormalizedVector(existingVertice, vertice);
                for (var otherTriangleI = 0; otherTriangleI < vertice.triangles.length; otherTriangleI++) {
                    var otherTriangle = vertice.triangles[otherTriangleI];
                    console.log('comparing with triangle')
                    console.log(otherTriangle)
                    for (var otherVerticeI = 0; otherVerticeI < otherTriangle.vertices.length; otherVerticeI++) {
                        var otherVertice = otherTriangle.vertices[otherVerticeI];
                        console.log('comparing with vertice')
                        console.log(otherVertice)
                        if (pointDistance(existingVertice, otherVertice) > 1 && pointDistance(otherVertice, vertice) > 1) {
                            var secondVec = createNormalizedVector(otherVertice, vertice);
                            var angle = angleBetweenTwoVectors(mainVec, secondVec);
                            if (angle > maxAngle) {
                                console.log('found angle is ' + toDeg(angle) )
                                console.log(existingVertice)
                                maxAngle = angle;
                                endingVertice = existingVertice;
                            }
                        }
                    }
                }
            }
        }
    }
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
                            if (angle == maxAngle) {
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

    var latestVertice;
    var lastVertice;
    if (vertice.freeArc < 2 * Math.PI) {
        var zeroCenter = createNormalizedVector(zero, vertice);
        var startCenter = createNormalizedVector(startingVertice, vertice);
        arc = -angleBetweenTwoVectors(startCenter, zeroCenter);
        if (zero.y < startingVertice.y) {
            arc *= -1;
        }
        initialVertice = startingVertice;
        lastVertice = endingVertice;
        latestVertice = startingVertice;
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
    console.log(initialVertice)
    console.log(lastVertice)
    var latestTriangle;
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
            if (pointDistance(initialVertice, lastVertice) > 1) {
                lastVertice.triangles.push(triangle)
            }
        } else {
            newPoint = true;
            var newVerticeX = vertice.x + config.testingBed.side * Math.cos(arc);
            var newVerticeY = vertice.y + config.testingBed.side * Math.sin(arc);
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
        vertice.freeArc -= arcPerPiece;
    }
    initialVertice.triangles.push(latestTriangle);

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
        var triangle = verticeToDraw.triangles[triangleI];
        for (var verticeI = 0; verticeI < triangle.vertices.length; verticeI++) {
            var subVertice = triangle.vertices[verticeI];
            ctx.lineTo(subVertice.x, subVertice.y);
            ctx.fillText(~~subVertice.x + ' ' +  ~~subVertice.y + ' ', subVertice.x, subVertice.y);
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



$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    trackTransforms(ctx);
    ctx.translate(config.size.width / 2, config.size.height / 2);
    ctx.font = '30px Arial';
    addTrianglesToVertice(vertice, 0);
    addTrianglesToVertice(vertice.triangles[0].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[1].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[2].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[3].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[4].vertices[1], 0)
    addTrianglesToVertice(vertice.triangles[5].vertices[1], 0)
    //addTrianglesToVertice(vertice.triangles[6].vertices[1], 0)
    console.log(vertice)
    ctx.strokeStyle = 'red';
    drawVertice(vertice, 0);
    drawVertice(vertice.triangles[0].vertices[1], 0)
    drawVertice(vertice.triangles[1].vertices[1], 0)
    drawVertice(vertice.triangles[2].vertices[1], 0)
    drawVertice(vertice.triangles[3].vertices[1], 0)
    drawVertice(vertice.triangles[4].vertices[1], 0)
    drawVertice(vertice.triangles[5].vertices[1], 0)
    //drawVertice(vertice.triangles[6].vertices[1], 0)
});
