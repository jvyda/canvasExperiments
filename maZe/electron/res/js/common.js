function randomNumber(n, cur) {
    var rand = (Math.random() * n) - n / 2;
    if (cur + rand < 0) return 0;
    return rand;
}

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f) {
        return setTimeout(f, 1000 / 60)
    };


window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function (requestID) {
        clearTimeout(requestID)
    };


function roundedRandom(amount) {
    return ~~(Math.random() * amount);
}

function getCoordinates(index) {
    return {x: index / 4 % config.size.width, y: Math.floor((index / 4 / config.size.width))}
}

function getIndexForCoordinate(x, y) {
    return (y * config.size.width + x) * 4;
}

function formatInterval(date1, date2, message) {
    console.log(message + ((date2 - date1) / 1000));
}

function downloadCanvasCommon(name, canvas_obj) {
    var downloadBtn = $('#download')[0];
    downloadBtn.download = name + '_' + new Date().toISOString() + '.png';

    var imageData = canvas_obj.toDataURL({
        format: 'png',
        multiplier: 4
    });
    var blob = dataURLtoBlob(imageData);
    downloadBtn.href = URL.createObjectURL(blob);

}

//http://stackoverflow.com/questions/23150333/html5-javascript-dataurl-to-blob-blob-to-dataurl
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}


function initDropdownList(id, list) {
    var select, i, option;
    select = document.getElementById(id);
    for (i = 0; i < list.length; i += 1) {
        option = document.createElement('option');
        option.value = i;
        option.text = list[i].text;
        select.add(option);
    }
}

function applyOilEffect(data, ctx) {
    var copy = ctx.createImageData(config.size.width, config.size.height);
    copy.data.set(data);
    for (var item = 0; item < copy.data.length; item += 4) {
        var coor = getCoordinates(item);
        var x = coor.x;
        var y = coor.y;
        var hist = [];
        var sr = [];
        var sg = [];
        var sb = [];
        var sa = [];
        for (var histIndex = 0; histIndex < config.oilEffectConfig.levels; histIndex++) {
            hist.push(0);
        }
        for (var index = 0; index < config.oilEffectConfig.levels + 1; index++) {
            sr.push(0);
            sg.push(0);
            sb.push(0);
            sa.push(0);
        }
        for (var x_d = -config.oilEffectConfig.radius; x_d <= config.oilEffectConfig.radius; x_d++) {
            if (x + x_d < 0 || x + x_d > config.size.width) continue;
            for (var y_d = -config.oilEffectConfig.radius; y_d <= config.oilEffectConfig.radius; y_d++) {
                if (y + y_d < 0 || y + y_d > config.size.height) continue;
                var tempItem = getIndexForCoordinate(x + x_d, y + y_d);
                var l = Math.floor(((copy.data[tempItem] + copy.data[tempItem + 1] + copy.data[tempItem + 2] + copy.data[tempItem + 3]) / 3.0 ) * (config.oilEffectConfig.levels / ( 255.0)));
                hist[l]++;
                sr[l] += copy.data[tempItem];
                sg[l] += copy.data[tempItem + 1];
                sb[l] += copy.data[tempItem + 2];
                sa[l] += copy.data[tempItem + 3];
            }
        }

        var currentMax = 0;
        var pixels = 0;
        for (var anotherI = 0; anotherI < config.oilEffectConfig.levels; anotherI++) {
            if (hist[anotherI] >= pixels) {
                currentMax = anotherI;
                pixels = hist[anotherI];
            }
        }
        data[item] = sr[currentMax] / pixels;     // red
        data[item + 1] = sg[currentMax] / pixels; // green
        data[item + 2] = sb[currentMax] / pixels; // blue
        data[item + 3] = sa[currentMax] / pixels;

    }
}


// courtesy of http://www.javascripter.net/faq/numberisprime.htm
isPrime = function (n) {
    if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
    if (n == leastFactor(n)) return true;
    return false;
}

// leastFactor(n)
// returns the smallest prime that divides n
//     NaN if n is NaN or Infinity
//      0  if n=0
//      1  if n=1, n=-1, or n is not an integer

leastFactor = function (n) {
    if (isNaN(n) || !isFinite(n)) return NaN;
    if (n == 0) return 0;
    if (n % 1 || n * n < 2) return 1;
    if (n % 2 == 0) return 2;
    if (n % 3 == 0) return 3;
    if (n % 5 == 0) return 5;
    var m = Math.sqrt(n);
    for (var i = 7; i <= m; i += 30) {
        if (n % i == 0)      return i;
        if (n % (i + 4) == 0)  return i + 4;
        if (n % (i + 6) == 0)  return i + 6;
        if (n % (i + 10) == 0) return i + 10;
        if (n % (i + 12) == 0) return i + 12;
        if (n % (i + 16) == 0) return i + 16;
        if (n % (i + 22) == 0) return i + 22;
        if (n % (i + 24) == 0) return i + 24;
    }
    return n;
}

function pointDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) +
        Math.pow(pointA.y - pointB.y, 2));
}


function toRad(angle) {
    return angle / 180 * Math.PI;
}

function toDeg(angle) {
    return angle * 180 / Math.PI;
}

function d2h(d) {
    return (d / 256 + 1 / 512).toString(16).substring(2, 4);
}


function randomNumberButAtLeast(range, min) {
    var rand = roundedRandom(range);
    return (rand < min) ? min : rand;
}


function createNormalizedVector(tip, shaft) {
    var vect = createVector(tip, shaft);

    var dist = pointDistance(tip, shaft);
    vect.x /= dist;
    vect.y /= dist;
    return vect;
}

function rotate90Deg(vec){
    return {x: vec.y, y: vec.x * -1}
}

function vectorLenght(vect) {
    return Math.sqrt(vect.x * vect.x + vect.y * vect.y);
}

function normalizeVector(vect) {
    var lenght = vectorLenght(vect);
    vect.x /= lenght;
    vect.y /= lenght;
    return vect;
}

function createVector(tip, shaft) {
    return {
        x: tip.x - shaft.x,
        y: tip.y - shaft.y
    };
}

// only normalized vectors
function angleBetweenTwoVectors(vectorA, vectorB){
    return Math.acos(dotProduct(vectorA, vectorB));
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function addRGBStyle(color) {
    color.styleRGB = '#' + d2h(color.r) + d2h(color.g) + d2h(color.b);
}

function converColorToRgbaWithAlphaPlaceholderStyle(color) {
    color.styleRGBA = 'rgba(%red, %green, %blue, %alpha)'
        .replace('%red', color.r)
        .replace('%blue', color.b)
        .replace('%green', color.g);
}

function convertColorToRGBA(color) {
    color.styleRGBA = 'rgba(%red, %green, %blue, %alpha)'
        .replace('%red', color.r)
        .replace('%blue', color.b)
        .replace('%green', color.g)
        .replace('%alpha', 1);
}

function randomElement(array) {
    return array[~~(Math.random() * array.length)];
}

function addOptionsWithImages(selectId, listOfElements, initialIndex) {
    var oDropdown = $('#' + selectId).msDropdown({roundedCorner: false}).data("dd");
    listOfElements.forEach(function (objectToPreview) {
        var tmpCanvas = document.createElement('canvas');
        objectToPreview.previewDimensionFun();
        tmpCanvas.width = objectToPreview.previewWidth;
        tmpCanvas.height = objectToPreview.previewHeight;
        var tmpCtx = tmpCanvas.getContext("2d");
        objectToPreview.previewFun(tmpCtx);
        var imageData = tmpCanvas.toDataURL({
            format: 'png',
            multiplier: 4
        });
        var blob = dataURLtoBlob(imageData);

        oDropdown.add({text: objectToPreview.name, image: URL.createObjectURL(blob)});
    });

    oDropdown.set("selectedIndex", initialIndex);
}


function convertColorToRgb(sphere) {
    sphere.finalColor = '#' + d2h(sphere.color.r) + d2h(sphere.color.g) + d2h(sphere.color.b);
}

function randomColor(){
    var color = {
        r: roundedRandom(255),
        g: roundedRandom(255),
        b: roundedRandom(255)
    };
    addRGBStyle(color);
    return color;
}

function randomColorWithAtLeastLumen(atLeastLum){
    var currentLum = 0;
    var col;
    do {
        col = randomColor();
        currentLum = calculateLum(col);
    } while(currentLum < atLeastLum);
    return col;
}

function calculateLum(col){
    return 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
}

function dotProduct(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}

// only works in orbitingspheres because of constant
function auPerDayToMPerSecond(value) {
    return value / 24 / 3600 * config.orbitingSpheres.AU;
}

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function () {
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };
    var translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };
    var transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };
    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function (x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}

function setCoordinateToColor(x, y, color) {
    var indexForCoordinate = getIndexForCoordinate(x, y) << 0;
    imageData.data[indexForCoordinate] = color.r;
    imageData.data[indexForCoordinate + 1] = color.g;
    imageData.data[indexForCoordinate + 2] = color.b;
    imageData.data[indexForCoordinate + 3] = color.alpha *  255;
}

function eventIsKey(event, code) {
    return event.keyCode == code || event.charCode == code || event.which == code;
}

function randomInteger(n){
    return (Math.random() * n) << 0
}

function createRainbowColors(frequency){
    var colors = [];
    var most = 2 * Math.PI / frequency;
    for (var i = 0; i < most; ++i) {
        var red   = Math.sin(frequency * i + 0) * 127 + 128;
        var green = Math.sin(frequency * i + 2) * 127 + 128;
        var blue  = Math.sin(frequency * i + 4) * 127 + 128;
        var color = {r: red << 0, g: green << 0, b: blue << 0, a: 255};
        addRGBStyle(color);
        colors.push(color)
    }
    return colors;
}


function getPoint(basePoint, arc, distance){
    return  {
        x:  basePoint.x + distance * Math.cos(arc),
        y:  basePoint.y + distance * Math.sin(arc)
    }
}

function getPointVec(basePoint, vec, distance){
    return {
        x: basePoint.x + vec.x * distance,
        y: basePoint.y + vec.y * distance
    }
}

function valueInRange(range){
    return range[0] + ((range[1] - range[0]) * Math.random()) << 0;
}

function spliceRandomElement(array){
    return array.splice((Math.random() * array.length) <<0, 1)[0];
}

function colorDistance(colora, colorb) {
    var rmean = ( colora.r + colorb.r) / 2;
    var r = colora.r - colorb.r;
    var g = colora.g - colorb.g;
    var b = colora.b - colorb.b;
    return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
}

function colorDistanceWithAlpha(colora, colorb) {
    /* max((r₁-r₂)², (r₁-r₂ - a₁+a₂)²) +
         max((g₁-g₂)², (g₁-g₂ - a₁+a₂)²) +
         max((b₁-b₂)², (b₁-b₂ - a₁+a₂)²)*/
    var rDiff = colora.r - colorb.r;
    var rDiffSquared = Math.pow(rDiff, 2);
    var gDiff = colora.g - colorb.g;
    var gDiffSquared = Math.pow(gDiff, 2);
    var bDiff = colora.b - colorb.b;
    var bDiffSquared = Math.pow(bDiff, 2);
    var aSum = colora.a + colorb.a;
    var colorADif = Math.pow(aSum, 2);
    return Math.max(rDiffSquared, Math.pow(rDiff - aSum, 2)) + Math.max(gDiffSquared, Math.pow(gDiff- aSum, 2)) + Math.max(bDiffSquared, Math.pow(bDiff- aSum, 2));
}

// taken from here https://gist.github.com/binarymax/4071852
function floodfill(x, y, fillcolor, ctx, width, height, tolerance) {
    var img = ctx.getImageData(0, 0, width, height);
    var data = img.data;
    var length = data.length;
    var Q = [];
    var currentIndex = (x + y * width) * 4;
    var rightColorBorder = currentIndex, leftColorBorder = currentIndex, currentRowRightBorder, currentRowLeftBorder,
        rowWidth = width * 4;
    var targetcolor = {
        r: data[currentIndex],
        g: data[currentIndex + 1],
        b: data[currentIndex + 2],
        a: data[currentIndex + 3]
    };

    if (!pixelCompare(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
        return false;
    }
    Q.push(currentIndex);
    var used = {};
    while (Q.length) {
        currentIndex = Q.pop();
        if (pixelCompareAndSet(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
            rightColorBorder = currentIndex;
            leftColorBorder = currentIndex;
            currentRowLeftBorder = ((currentIndex / rowWidth) << 0) * rowWidth - 4; //left bound
            currentRowRightBorder = currentRowLeftBorder + rowWidth + 4;//right bound
            while (currentRowLeftBorder < (leftColorBorder -= 4) && pixelCompareAndSet(leftColorBorder, targetcolor, fillcolor, data, length, tolerance)) ; //go left until edge hit
            while (currentRowRightBorder > (rightColorBorder += 4) && pixelCompareAndSet(rightColorBorder, targetcolor, fillcolor, data, length, tolerance)) ; //go right until edge hit
            for (var currentCell = leftColorBorder + 4; currentCell < (rightColorBorder - 4); currentCell += 4) {
                //queue y-1
                var lower = currentCell - rowWidth;
                if (lower >= 0 && pixelCompare(lower, targetcolor, fillcolor, data, length, tolerance)) {
                    if(!(lower in used)){
                        Q.push(lower);
                        used[lower] = 1;
                    }
                }
                //queue y+1
                var upper = currentCell + rowWidth;
                if (upper < length && pixelCompare(upper, targetcolor, fillcolor, data, length, tolerance)) {
                    if(!(upper in used)){
                        Q.push(upper);
                        used[upper] = 1;
                    }
                }
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}
var cnt = 0;

function pixelCompare(i, targetcolor, fillcolor, data, length, tolerance) {
    if (i < 0 || i >= length) return false; //out of bounds
    if (data[i + 3] === 0) return true;  //surface is invisible

    //target is same as fill
    if (
        (targetcolor.a === fillcolor.a) &&
        (targetcolor.r === fillcolor.r) &&
        (targetcolor.g === fillcolor.g) &&
        (targetcolor.b === fillcolor.b)
    ) {
        return false;
    }


    //target matches surface
    if (
        (targetcolor.a === data[i + 3]) &&
        (targetcolor.r === data[i]) &&
        (targetcolor.g === data[i + 1]) &&
        (targetcolor.b === data[i + 2])
    ) {
        return true;
    }

    /*
    if (
        Math.abs(targetcolor.a - data[i + 3]) <= (255 - tolerance) &&
        Math.abs(targetcolor.r - data[i]) <= tolerance &&
        Math.abs(targetcolor.g - data[i + 1]) <= tolerance &&
        Math.abs(targetcolor.b - data[i + 2]) <= tolerance
    ) return true; //target to surface within tolerance
*/
    cnt ++;
    var currentColor = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3]
    };
    var distance = colorDistanceWithAlpha(targetcolor, currentColor);
    if (distance < tolerance) {
        return true;
    }
    return false; //no match
}

function pixelCompareAndSet(i, targetcolor, fillcolor, data, length, tolerance) {
    if (pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
        //fill the color
        data[i] = fillcolor.r;
        data[i + 1] = fillcolor.g;
        data[i + 2] = fillcolor.b;
        data[i + 3] = fillcolor.a;
        return true;
    }
    return false;
}