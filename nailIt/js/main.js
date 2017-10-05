var ctx = {};
var canvas = {};

var config = {
    size: {
        size: 1000
    },
    nailIt: {
        scalerFaktor: 0.05,
        kernelRadius: 0.08,
        cannyFrom: 100,
        cannyTo: 300,
        houghSize: 2,
        houghAngle: Math.PI / 540,
        lineFindingGracePeriod: 3,
        bodyFindingAngleDelta: 10,
        bodyFindingMaxDistance: 25
    }
};

var houghLines;
var finiteLines;
var finalBodies;
var img_u8;
var imageData;
var img;
var progress;
var info;


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    img = new Image;
    img.onload = analyzePictureFun;
    img.src = 'img/a.png';
    //img.src = 'img/a.jpg';
    //img.src = 'img/b.png';
    canvas.height = config.size.size;
    canvas.width = config.size.size;
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.strokeStyle = "rgb(0,255,0)";
    progress = $('#progress');
    info = $('#info');
});

function analyzePictureFun(){
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(img, 0, 0);
    // lazy way to get somewhat updates to the frontend
    setTimeout(function(){
        cannyEdgeDetector();
        setTimeout(function(){
            findHoughLines();
            console.log('HoughLines: ' + houghLines.length);
            setTimeout(function(){
                findFiniteLines();
                console.log('Finite lines: ' + finiteLines.length);
                setTimeout(function(){
                    connectLines();
                    console.log('Bodies: ' + finalBodies.length);
                    setTimeout(function(){
                        redrawImage();
                        info.text('Lines: ' + finiteLines.length);
                        updateProgress('Done.')
                    }, 1)
                }, 1)
            }, 1)
        }, 1)
    }, 1);
}

function analyzeNewImage(){
    updateProgress('new Image');
    var file = $("#img_upload")[0].files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        img.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

function redrawImage(){
    ctx.drawImage(img, 0, 0);
}

function drawCanny(){
    paintData();
}

function drawMainLines(){
    paintLines(finiteLines);
}

function drawResult(){
    $('#currentState').show();
    paintBodiesConsistingOfLines(finalBodies);
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function cannyEdgeDetector() {
    updateProgress('canny Edge');
    img_u8 = new jsfeat.matrix_t(canvas.width, canvas.height, jsfeat.U8C1_t);

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    jsfeat.imgproc.grayscale(imageData.data, canvas.width, canvas.height, img_u8);

    var kernel_size = (config.nailIt.kernelRadius + 1) << 1;

    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

    jsfeat.imgproc.canny(img_u8, img_u8, config.nailIt.cannyFrom, config.nailIt.cannyTo);
}

function findHoughLines(){
    var scaler = canvas.width;
    if (canvas.height < scaler) {
        scaler = canvas.height;
    }

    scaler *= config.nailIt.scalerFaktor;

    var h = jsfeat.imgproc.hough_transform(img_u8, config.nailIt.houghSize, config.nailIt.houghAngle, scaler);

    houghLines = [];
    var length = canvas.width * 3;
    var tenth = (h.length / 10) << 0;
    for (var i = 0; i < h.length; i++) {
        if(i % tenth == 0) {
            updateProgress('Hough Lines: '+ i +'/'+ h.length);
        }
        var rho = h[i][0];
        var theta = h[i][1];

        var a = Math.cos(theta);
        var b = Math.sin(theta);

        var x0 = a * rho;
        var y0 = b * rho;

        var pt1 = {};
        pt1.x = Math.round(x0 + length * (-b));
        pt1.y = Math.round(y0 + length * (a));
        var pt2 = {};
        pt2.x = Math.round(x0 - length * (-b));
        pt2.y = Math.round(y0 - length * (a));

        var line = {};
        line.start = pt1;
        line.end = pt2;
        houghLines.push(line);
    }
}

function findFiniteLines() {
    finiteLines = [];
    var tenth = (houghLines.length / 100) << 0;
    for (var lineI = 0; lineI < houghLines.length; lineI++) {
        if(lineI % tenth == 0) {
            updateProgress('Finite Lines: ' + lineI +'/'+ houghLines.length + ': ' + (lineI/houghLines.length*100 << 0) + '%');
        }
        var line = houghLines[lineI];
        var vec = createNormalizedVector(line.start, line.end);
        var dist = pointDistance(line.start, line.end);
        var currDist = 0;
        var start = undefined;
        var end = undefined;
        var gracePeriod = config.nailIt.lineFindingGracePeriod;
        var currentGrace = 0;
        var possibleLines = [];
        while (Math.abs(currDist) < dist) {
            var tryPoint = {
                x: vec.x + vec.x * currDist,
                y: vec.y + vec.y * currDist
            };
            currDist--;
            var newX = line.start.x + ~~tryPoint.x;
            var newY = line.start.y + ~~tryPoint.y;
            if (newX > config.width || newY > config.height) continue;
            if (newX < 0 || newY < 0) continue;
            var index = getIndexForCoordinate2(newX, newY);
            //img_u8.data[index] = 120;
            if (img_u8.data[index] == 255) {
                //img_u8.data[index] = 0;
                currentGrace = 0;
                //ctx.rect(newX, newY, 1,1)
                if (!start) {
                    start = {x: newX, y: newY};
                } else {
                    end = {x: newX, y: newY};
                }
            } else {
                if (start) {
                    currentGrace++;
                    if (currentGrace > gracePeriod) {
                        currentGrace = 0;
                        if (start && end) {
                            possibleLines.push({
                                start: {x: start.x, y: start.y},
                                end: {x: end.x, y: end.y}
                            });
                        }
                        start = undefined;
                        end = undefined;
                    }
                }
            }
        }
        var maxDistance = 0;
        possibleLines.forEach(function (line) {
            var distance = pointDistance(line.start, line.end);
            if (distance > maxDistance) {
                maxDistance = distance;
                start = line.start;
                end = line.end;
            }
        });

        if (start != undefined && end != undefined) {
            finiteLines.push({
                start: {x: start.x, y: start.y},
                end: {x: end.x, y: end.y},
                vec: vec
            });
        }
    }
}

function connectLines() {
    finalBodies = [];
    var tenth = (finiteLines.length / 100) << 0;
    var cnt = 0;
    finiteLines.forEach(function (line) {
        cnt++;
        if(cnt % tenth == 0){
            updateProgress('connecting lines ' +cnt + '/' + finiteLines.length + ': ' + (cnt/finiteLines.length*100 << 0) + '%')
        }
        if (line.attached) return;
        var newBody = [];
        newBody.push(line);
        var lineEdge = line.start;
        do {
            var potentialPartners = [];
            finiteLines.forEach(function (potentialPartnerLine) {
                var angle = angleBetweenTwoVectors(potentialPartnerLine.vec, line.vec);
                angle = toDeg(angle);
                if (Math.abs(angle) < config.nailIt.bodyFindingAngleDelta && !potentialPartnerLine.attached) {
                    potentialPartners.push(potentialPartnerLine)
                }
            });
            var minDistance = config.nailIt.bodyFindingMaxDistance;
            var partner = undefined;
            var connectTo = undefined;
            var otherEdge = undefined;
            potentialPartners.forEach(function (potentialPartner) {
                var startStart = pointDistance(lineEdge, potentialPartner.start);
                var endEnd = pointDistance(lineEdge, potentialPartner.end);
                if (startStart < minDistance && startStart > 0.000000001) {
                    minDistance = startStart;
                    partner = potentialPartner;
                    connectTo = potentialPartner.start;
                    otherEdge = potentialPartner.end;
                }
                if (endEnd < minDistance && endEnd > 0.000000001) {
                    minDistance = endEnd;
                    partner = potentialPartner;
                    connectTo = potentialPartner.end;
                    otherEdge = potentialPartner.start;
                }
            });
            // should help.. but doesn't
            //if(!partner){
            //    minDistance = 2;
            //    finiteLines.forEach(function (potentialPartner) {
            //        if(potentialPartner.attached) return;
            //        var startStart = pointDistance(lineEdge, potentialPartner.start);
            //        var endEnd = pointDistance(lineEdge, potentialPartner.end);
            //        if (startStart < minDistance && startStart > 0.000000001) {
            //            minDistance = startStart;
            //            partner = potentialPartner;
            //            connectTo = potentialPartner.start;
            //            otherEdge = potentialPartner.end;
            //        }
            //        if (endEnd < minDistance && endEnd > 0.000000001) {
            //            minDistance = endEnd;
            //            partner = potentialPartner;
            //            connectTo = potentialPartner.end;
            //            otherEdge = potentialPartner.start;
            //        }
            //    });
            //}

            if (partner) {
                partner.attached = true;
                newBody.push(partner);
                newBody.push({
                    start: {x: lineEdge.x, y: lineEdge.y},
                    end: {x: connectTo.x, y: connectTo.y}
                });
            }
            line = partner;
            lineEdge = otherEdge;
        } while (partner);
        finalBodies.push(newBody);
    });
}

function paintData() {
    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = img_u8.cols * img_u8.rows, pix = 0;
    while (--i >= 0) {
        pix = img_u8.data[i];
        if (pix != 255 && pix != 0) {
            data_u32[i] = alpha | (pix << 8);
        } else {
            data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}


function paintLines(linesToPain) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    linesToPain.forEach(function(line){
        //ctx.strokeStyle = randomColor().styleRGB;
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
    });
    ctx.stroke();
}

function paintBodiesConsistingOfLines(lineLinesToDraw) {
    lineLinesToDraw.forEach(function (lineline) {
        ctx.strokeStyle = randomColor().styleRGB;
        ctx.beginPath();
        lineline.forEach(function (line) {
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.end.x, line.end.y);
        });
        ctx.stroke();
    });

}

function getCoordinates2(index) {
    return {x: index % img_u8.cols, y: Math.floor(index / img_u8.cols)}
}

function getIndexForCoordinate2(x, y) {
    return (y * img_u8.cols + x);
}

function updateProgress(text){
    setTimeout(function(){
        document.getElementById('progress').innerHTML = text;
    }, 1)
    console.log(text)
}

