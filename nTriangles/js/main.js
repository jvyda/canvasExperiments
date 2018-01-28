var canvas;
var ctx;

var progress;
var inputFields = {};
var drawAnimation;

var config = {
    size: {
        height: window.innerHeight,
        width: window.innerWidth
    },
    nTriangles: {
        triangleAmount: 7,
        side: 250,
        minSideSize: 25,
        minArc: 20,
        baseMinSideSize: 25,
        verticeAmount: 1000,
        fps: 60,
        scala: 1,
        addVertices: true
    }
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

var vertice = {
    x: 0,
    y: 0,
    freeArc: 2 * Math.PI,
    triangles: []
};

var maxDist = config.nTriangles.side;
var visitedDist = [];
var currentDist;


function searchForMaxDist(vertice) {
    visitedDist = [];
    maxDist = config.nTriangles.side;
    currentDist = vertice;
    getMinDistance(vertice);
    return maxDist;
}

function addTrianglesToVertice(vertice) {
    if (vertice.freeArc <= 0) {
        return
    }
    //console.log('vertice################################################################################################');
    //console.log(vertice);
    //console.log(toDeg(vertice.freeArc));
    var lenght = searchForMaxDist(vertice);
    var arcPerPiece = vertice.freeArc / (config.nTriangles.triangleAmount - vertice.triangles.length);
    var startingVertice;
    var endingVertice;
    for (var existTriangleI = 0; existTriangleI < vertice.triangles.length; existTriangleI++) {
        var existingTriangle = vertice.triangles[existTriangleI];
        for (var existingVerticeI = 0; existingVerticeI < existingTriangle.vertices.length; existingVerticeI++) {
            var existingVertice = existingTriangle.vertices[existingVerticeI];
            // get a point which is not the base point, but one point in the border of the current pointy edge
            if (pointDistance(vertice, existingVertice) > 0.001) {
                var mainVec = createNormalizedVector(existingVertice, vertice);
                for (var otherTriangleI = 0; otherTriangleI < vertice.triangles.length; otherTriangleI++) {
                    var otherTriangle = vertice.triangles[otherTriangleI];
                    for (var otherVerticeI = 0; otherVerticeI < otherTriangle.vertices.length; otherVerticeI++) {
                        // get another point which comes from the triangles, and search through all of the possible edges to get the one, which is spanning open the arc
                        var otherVertice = otherTriangle.vertices[otherVerticeI];
                        if (pointDistance(existingVertice, otherVertice) > 0.001 && pointDistance(otherVertice, vertice) > 0.001) {
                            var secondVec = createNormalizedVector(otherVertice, vertice);
                            var angle = angleBetweenTwoVectors(mainVec, secondVec);
                            if ((Math.abs(angle - vertice.freeArc) < 0.000001)) {
                                endingVertice = otherVertice;
                                startingVertice = existingVertice;

                                // it can be over 180°, so we need to keep that in mind
                            } else if ((Math.abs(angle - (2 * Math.PI - vertice.freeArc)) < 0.000001)) {
                                endingVertice = otherVertice;
                                startingVertice = existingVertice;
                            }
                        }
                    }
                }
            }
        }
    }
    var zeroX = vertice.x + config.nTriangles.side * Math.cos(0);
    var zeroY = vertice.y + config.nTriangles.side * Math.sin(0);
    var zero = {
        x: zeroX,
        y: zeroY
    };
    var arc = 0;
    //console.log('starting and ending');
    //console.log(startingVertice);
    //console.log(endingVertice);
    var latestVertice;
    var lastVertice;
    if (vertice.freeArc < 2 * Math.PI) {
        var zeroCenter = createNormalizedVector(zero, vertice);
        var startCenter = createNormalizedVector(startingVertice, vertice);
        arc = angleBetweenTwoVectors(startCenter, zeroCenter);
        var endCenter = createNormalizedVector(endingVertice, vertice);
        var angleBetween = angleBetweenTwoVectors(endCenter, startCenter);
        var endingToZeroAngle = angleBetweenTwoVectors(endCenter, zeroCenter);
        var startingToZeroAngle = arc;

        var xOffset = vertice.x * -1;
        var yOffset = vertice.y * -1;
        var startingVerticeTranslated = {
            x: startingVertice.x + xOffset,
            y: startingVertice.y + yOffset
        };

        var endingVerticeTranslated = {
            x: endingVertice.x + xOffset,
            y: endingVertice.y + yOffset
        };

        if (startingVerticeTranslated.x >= 0) {
            if (startingVerticeTranslated.y >= 0) {
                if (endingVerticeTranslated.x >= 0) {
                    if (endingVerticeTranslated.y >= 0) {
                        if (startingToZeroAngle <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arcPerPiece *= -1;
                            } else {
                                // do nothing
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                // do nothing
                            } else {
                                arcPerPiece *= -1;
                            }
                        }
                    } else {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            // do nothing
                        } else {
                            arcPerPiece *= -1;
                        }
                    }
                } else {
                    if (endingVerticeTranslated.y >= 0) {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            arcPerPiece *= -1;
                        } else {
                            // do nothing
                        }
                    } else {
                        if (((startingToZeroAngle * -1) + Math.PI) <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arcPerPiece *= -1;
                            } else {
                                // do nothing
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                // do nothing
                            } else {
                                arcPerPiece *= -1;
                            }
                        }
                    }
                }
            } else {
                if (endingVerticeTranslated.x >= 0) {
                    if (endingVerticeTranslated.y >= 0) {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            arc *= -1;
                            arcPerPiece *= -1;
                        } else {
                            arc *= -1;
                        }
                    } else {
                        if (startingToZeroAngle <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                            } else {
                                arc *= -1;
                                arcPerPiece *= -1;
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                                arcPerPiece *= -1;
                            } else {
                                arc *= -1;
                            }
                        }
                    }
                } else {
                    if (endingVerticeTranslated.y >= 0) {
                        // special cases when on E on opposite, but angle only reflects 180°
                        // start angle is bigger
                        if (((startingToZeroAngle * -1) + Math.PI) <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                            } else {
                                arcPerPiece *= -1;
                                arc *= -1;
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                                arcPerPiece *= -1;
                            } else {
                                arc *= -1;
                            }
                        }
                    } else {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            arc *= -1;
                        } else {
                            arcPerPiece *= -1;
                            arc *= -1;
                        }
                    }
                }
            }
        } else {
            if (startingVerticeTranslated.y >= 0) {
                if (endingVerticeTranslated.x >= 0) {
                    if (endingVerticeTranslated.y >= 0) {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            // do nothing
                        } else {
                            arcPerPiece *= -1;
                        }
                    } else {
                        if (((startingToZeroAngle * -1) + Math.PI ) <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arcPerPiece *= -1;
                            } else {
                                // do nothing
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                // do nothing
                            } else {
                                arcPerPiece *= -1;
                            }
                        }
                    }
                } else {
                    if (endingVerticeTranslated.y >= 0) {
                        if (startingToZeroAngle <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arcPerPiece *= -1;
                            } else {
                                // do nothing
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                // do nothing
                            } else {
                                arcPerPiece *= -1;
                            }
                        }
                    } else {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            arcPerPiece *= -1;
                        } else {
                            // do nothing
                        }
                    }
                }
            } else {
                if (endingVerticeTranslated.x >= 0) {
                    if (endingVerticeTranslated.y >= 0) {
                        if (((startingToZeroAngle * -1) + Math.PI) <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                            } else {
                                arc *= -1;
                                arcPerPiece *= -1;
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                                arcPerPiece *= -1;
                            } else {
                                arc *= -1;
                            }
                        }
                    } else {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            arc *= -1;
                            arcPerPiece *= -1;
                        } else {
                            arc *= -1;
                        }
                    }
                } else {
                    if (endingVerticeTranslated.y >= 0) {
                        if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                            arc *= -1;
                        } else {
                            arc *= -1;
                            arcPerPiece *= -1;
                        }
                    } else {
                        if (startingToZeroAngle <= endingToZeroAngle) {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                            } else {
                                arc *= -1;
                                arcPerPiece *= -1;
                            }
                        } else {
                            if (Math.abs(angleBetween - vertice.freeArc) > 0.000001) {
                                arc *= -1;
                                arcPerPiece *= -1;
                            } else {
                                arc *= -1;
                            }
                        }
                    }
                }
            }
        }

        lastVertice = endingVertice;
        latestVertice = startingVertice;

    } else {
        // the case at the very start, with no existing vertices
        var initialVerticeX = vertice.x + lenght * Math.cos(arc);
        var initialVerticeY = vertice.y + lenght * Math.sin(arc);
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
    //var lenght = Math.min(config.nTriangles.side, vectorLenght(createVector(latestVertice, vertice)));
    //lenght = Math.min(lenght, vectorLenght(createVector(lastVertice, vertice)));
    for (var i = vertice.triangles.length; i < config.nTriangles.triangleAmount; i++) {
        var triangle = {};
        triangle.vertices = [];
        triangle.vertices.push(vertice);
        triangle.vertices.push(latestVertice);
        arc += arcPerPiece;
        var newPoint = false;
        var newVertice = {};
        if (i == (config.nTriangles.triangleAmount - 1)) {
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
            newVertice.color = randomColor().styleRGB;
            var oldToCenter = createNormalizedVector(vertice, latestVertice);
            var oldToNew = createNormalizedVector(newVertice, latestVertice);
            latestVertice.freeArc -= angleBetweenTwoVectors(oldToCenter, oldToNew);
            latestVertice = newVertice;
        }
        latestTriangle = triangle;
        vertice.freeArc -= Math.abs(arcPerPiece);
    }
    lastVertice.triangles.push(latestTriangle);

}

function drawVertice(verticeToDraw) {
    var color = verticeToDraw.color;
    for (var triangleI = 0; triangleI < verticeToDraw.triangles.length; triangleI++) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
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

}
var visited = [];
var max = 2 * Math.PI;
var current;

function getMaxFreeVertice(verticeToLook) {
    for (var i = 0; i < verticeToLook.triangles.length; i++) {
        var triangle = verticeToLook.triangles[i];
        for (var vi = 0; vi < triangle.vertices.length; vi++) {
            var subVertice = triangle.vertices[vi];
            if (visited.indexOf(subVertice) < 0) {
                if (subVertice.freeArc > toRad(config.nTriangles.minArc) && subVertice.freeArc < max && subVertice.freeArc > 0.1 &&
                    pointDistance(triangle.vertices[0], triangle.vertices[1]) > config.nTriangles.minSideSize &&
                    pointDistance(triangle.vertices[1], triangle.vertices[2]) > config.nTriangles.minSideSize &&
                    pointDistance(triangle.vertices[2], triangle.vertices[0]) > config.nTriangles.minSideSize) {
                    max = subVertice.freeArc;
                    current = subVertice;
                }
                visited.push(subVertice);
                getMaxFreeVertice(subVertice)
            }
        }
    }
}

function getMinDistance(verticeToLook) {
    for (var i = 0; i < verticeToLook.triangles.length; i++) {
        var triangle = verticeToLook.triangles[i];
        for (var vi = 0; vi < triangle.vertices.length; vi++) {
            var subVertice = triangle.vertices[vi];
            if (visitedDist.indexOf(subVertice) < 0) {
                var dist = pointDistance(subVertice, currentDist);
                if (dist > 0 && dist < maxDist) {
                    maxDist = dist;
                }
                visitedDist.push(subVertice);
                getMinDistance(subVertice)
            }
        }
    }
}


function updateAndRepaint() {
    config.nTriangles.side = inputFields['sideLength'].val();
    var minSideSize = inputFields['minSideLength'].val();
    if (minSideSize > 1) {
        config.nTriangles.baseMinSideSize = minSideSize;
    } else {
        inputFields['minSideLength'].val(config.nTriangles.baseMinSideSize)
    }
    maxDist = config.nTriangles.side;
    config.nTriangles.verticeAmount = inputFields['vertices'].val();
    var triangleAmount = inputFields['triangles'].val();
    if (triangleAmount > 6) {
        config.nTriangles.triangleAmount = triangleAmount;
    } else {
        inputFields['triangles'].val(config.nTriangles.triangleAmount)
    }
    vertice = {
        x: 0,
        y: 0,
        freeArc: 2 * Math.PI,
        triangles: []
    };
    count = 0;
    config.nTriangles.addVertices = false;
}

var drawn = [];

function drawAllVertices(verticeToLook) {
    for (var i = 0; i < verticeToLook.triangles.length; i++) {
        var triangle = verticeToLook.triangles[i];
        for (var vi = 0; vi < triangle.vertices.length; vi++) {
            var subVertice = triangle.vertices[vi];
            if (drawn.indexOf(subVertice) < 0) {
                drawn.push(subVertice);
                if (subVertice.x < ctx.transformedPoint(config.size.width, 0).x &&
                    subVertice.y < ctx.transformedPoint(0, config.size.height).y &&
                    subVertice.x > ctx.transformedPoint(0, 0).x &&
                    subVertice.y > ctx.transformedPoint(0, 0).y) {
                    drawVertice(subVertice);
                }
                drawAllVertices(subVertice);
            }
        }
    }
}

function createVertices() {
    addTrianglesToVertice(vertice);
    count++;
    var actual = config.nTriangles.triangleAmount;
    for (var i = 0; i < actual; i++) {
        addTrianglesToVertice(vertice.triangles[i].vertices[1])
        count++;
    }
    requestAnimationFrame(addVertice);
}


function mouseWheelEvent(event) {
    scalePoint = getMousePos(canvas, event);
    scalePoint = ctx.transformedPoint(scalePoint.x, scalePoint.y);
    var scaleTo = event.originalEvent.deltaY < 0 ? 1.1 : 1 / 1.1;
    config.nTriangles.scala *= scaleTo;
    ctx.translate(scalePoint.x, scalePoint.y);
    ctx.scale(scaleTo, scaleTo);
    ctx.translate(-scalePoint.x, -scalePoint.y);
    event.preventDefault()
}

function updateCanvas() {
    ctx.translate(toMove.x, toMove.y);
    toMove.x = 0;
    toMove.y = 0;
    var topLeft = ctx.transformedPoint(0, 0);
    var bottomRight = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    ctx.lineWidth = 1 / config.nTriangles.scala;
    ctx.font = ~~(0.1 / config.nTriangles.scala + 1) + "px Arial";
    drawAllVertices(vertice);
    drawn = [];
    setTimeout(function () {
        drawAnimation = requestAnimationFrame(updateCanvas);
    }, 1000 / config.nTriangles.fps)
}

var mouseDown = false;

function mouseClick(event) {
    mouseDown = !mouseDown;
    if (mouseDown) {
        var mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.nTriangles.scala;
        mousePos.y /= config.nTriangles.scala;
        lastDrag = mousePos;
    }
}

function drag(event) {
    if (mouseDown) {
        var mousePos = getMousePos(canvas, event);
        mousePos.x -= config.size.width / 2;
        mousePos.y -= config.size.height / 2;
        mousePos.x /= config.nTriangles.scala;
        mousePos.y /= config.nTriangles.scala;
        toMove.x += mousePos.x - lastDrag.x;
        toMove.y += mousePos.y - lastDrag.y;
        lastDrag = mousePos;
    }
}

$(document).ready(function () {
    var canvasJQuery = $("#canvas");
    canvas = canvasJQuery[0];
    progress = $('#progress');
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    canvasJQuery.css('background-color', 'rgba(0, 0, 0, 1)');
    canvas.addEventListener("mousedown", mouseClick, false);
    canvas.addEventListener("mouseup", mouseClick, false);
    canvas.addEventListener("mousemove", drag, false);
    ctx = canvas.getContext("2d");

    canvasJQuery.on('wheel', mouseWheelEvent);

    inputFields['sideLength'] = $('#side');
    inputFields['minSideLength'] = $('#minSideLength');
    inputFields['vertices'] = $('#vertices');
    inputFields['triangles'] = $('#triangles');
    inputFields['width'] = $('#width');
    inputFields['height'] = $('#height');

    inputFields['sideLength'].val(config.nTriangles.side);
    inputFields['minSideLength'].val(config.nTriangles.baseMinSideSize);
    inputFields['vertices'].val(config.nTriangles.verticeAmount);
    inputFields['triangles'].val(config.nTriangles.triangleAmount);
    inputFields['width'].val(config.size.width);
    inputFields['height'].val(config.size.height);

    trackTransforms(ctx);
    ctx.translate(config.size.width / 2, config.size.height / 2);
    ctx.font = '12px Arial';
    requestAnimationFrame(updateCanvas);
    createVertices();
});

var count = 0;

function addVertice() {
    if(!config.nTriangles.addVertices) {
        config.nTriangles.addVertices = true;
        updateCanvas();
        createVertices();
        return;
    }
    getMaxFreeVertice(vertice);
    if (current == undefined) {
        config.nTriangles.minSideSize--;
        resetSearch();
        setTimeout(addVertice, 1);
        return;
    }
    config.nTriangles.minSideSize = config.nTriangles.baseMinSideSize;
    addTrianglesToVertice(current);
    drawn = [];
    count++;
    progress.text(count + ' /' + config.nTriangles.verticeAmount);
    resetSearch();
    if (count < config.nTriangles.verticeAmount && config.nTriangles.addVertices) {
        setTimeout(addVertice, 10)
    }
}


function resetSearch() {
    visited = [];
    max = 2 * Math.PI;
    current = undefined
}