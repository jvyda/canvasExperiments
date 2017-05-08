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

function d2h(d) {
    return (d / 256 + 1 / 512).toString(16).substring(2, 4);
}


function randomNumberButAtLeast(range, min) {
    var rand = roundedRandom(range);
    return (rand < min) ? min : rand;
}


function createNormalizedVector(tip, shaft) {
    var vect = {
        x: tip.x - shaft.x,
        y: tip.y - shaft.y
    };

    var dist = pointDistance(tip, shaft);
    vect.x /= dist;
    vect.y /= dist;
    return vect;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function convertColorToStyle(color) {
    color.style = '#' + d2h(color.r) + d2h(color.g) + d2h(color.b);
}

function converColorToRgbaWithAlphaPlaceholderStyle(color) {
    color.style = 'rgba(%red, %green, %blue, %alpha)'
        .replace('%red', color.r)
        .replace('%blue', color.b)
        .replace('%green', color.g);
}