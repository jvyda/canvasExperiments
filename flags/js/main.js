var canvas;
var ctx;
var tmpCtx;
var tempCanvas;

var config = {
    size: {
        width: 100,
        height: 100
    }
};
var flagImage = new Image();

var countries = [
    'ad', 'mk', 'fm', 'cm', 'mt', 'na', 'cl', 'mx', 'gh', 'ao', 'tr', 'de', 'mh', 'be', 'ua', 'gd', 'za', 'er', 'gm', 'cr', 'zm', 'bt', 'ml', 'ng', 'dm', 'cd', 'bb', 'ws', 'co', 'tz', 'pa', 'sn', 'my', 'sa', 'kh', 'si', 'il', 'mm', 'sm', 'lv', 'au', 'no', 'jm', 'kz', 'tt', 'ge', 'gt', 'gr', 'se', 'eh', 'nr', 'cg', 'kn', 'km', 'it', 'lc', 'et', 'lb', 'jo', 'dj', 'mw', 'mu', 'cv', 'pe', 'rw', 'id', 'pt', 'td', 'ug', 'tm', 'tj', 'bh', 'bd', 'nz', 'sb', 'ht', 'sg', 'la', 'pl', 'cz', 'ch', 'do', 'sk', 'gq', 'ee', 'ls', 'af', 'ks', 'mg', 'mv', 'eg', 'pg', 'us', 'lt', 'vu', 'sd', 'kr', 'ir', 'kw', 'jp', 'tn', 'so', 'li', 'sv', 'am', 'ga', 'om', 'al', 'bg', 'ec', 'py', 'mn', 'sz', 'gy', 'bz', 'ro', 'rs', 'cn', 'lu', 'hn', 'cf', 'me', 'br', 'iq', 'cy', 'sr', 'bf', 'gw', 'uy', 'ci', 've', 'vc', 'at', 'bi', 'zw', 'ph', 'hr', 'sl', 'sy', 'ca', 'qa', 'ke', 'tv', 'dk', 'pk', 'es', 'va', 'bs', 'fj', 'ne', 'bo', 'vn', 'lr', 'sc', 'lk', 'fi', 'ru', 'bw', 'ba', 'ie', 'ki', 'is', 'fr', 'pw', 'st', 'md', 'ma', 'hu', 'tg', 'ni', 'ag', 'to', 'np', 'nl', 'kg', 'tw', 'az', 'gn', 'bn', 'kp', 'bj', 'dz', 'mz', 'mc', 'tl', 'by', 'uz', 'in', 'th', 'ly', 'cu', 'mr', 'ae', 'ye', 'gb', 'ar'
];


function colorDistance(colora, colorb) {
    var rmean = ( colora.red + colorb.red) / 2;
    var r = colora.red - colorb.red;
    var g = colora.green - colorb.green;
    var b = colora.blue - colorb.blue;
    return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
}

var imageInfo = new Array(config.size.height);
for (var i = 0; i < config.size.height; i++) {
    imageInfo[i] = new Array(config.size.width);
}

var finalImageData;

function colorEquals(colora, colorb) {
    return colorDistance(colora, colorb) < 30;
}

function addImageToAverage(index) {
    if (index == countries.length) {
        drawAverageImage(index);
        return;
    }
    if (index > 1) {
        drawAverageImage(index);
    }
    flagImage.onload = function () {
        tmpCtx.clearRect(0, 0, config.size.width, config.size.height);
        tmpCtx.drawImage(flagImage, 0, 0, config.size.width, config.size.height);
        var tempImageData = tmpCtx.getImageData(0, 0, config.size.width, config.size.height).data;
        for (var i = 0; i < tempImageData.length; i += 4) {
            var coors = getCoordinates(i);
            var currentColor = {
                red: tempImageData[i],
                green: tempImageData[i + 1],
                blue: tempImageData[i + 2],
                count: 1
            };
            var colors = imageInfo[coors.y][coors.x];
            if (!colors) {
                imageInfo[coors.y][coors.x] = [currentColor];
                continue;
            }
            var found = false;
            colors.forEach(function (color) {
                if (found) return;
                if (colorEquals(color, currentColor)) {
                    color.count += 1;
                    found = true;
                }
            });
            if (!found) {
                colors.push(currentColor);
            }
        }

        setTimeout(function(){
            addImageToAverage(++index);
        }, 500)
    };
    flagImage.src = 'src/' + countries[index] + '.png';
}

function findColorWithMaxCount(colors) {
    var currentMax = 0;
    var currentColor = colors[0];
    colors.forEach(function (color) {
        if (color.count > currentMax) {
            currentColor = color;
            currentMax = color.count;
        }
    })
    return currentColor;
}

function drawAverageImage(index) {
    console.log('drawing final image...')
    ctx.clearRect(0, 0, config.size.width, config.size.height);
    for (var y = 0; y < config.size.height; y++) {
        for (var x = 0; x < config.size.height; x++) {
            var color = findColorWithMaxCount(imageInfo[y][x]);
            ctx.beginPath();
            ctx.fillStyle = 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
            ctx.rect(x, y, 1, 1);
            ctx.fill();
        }
    }
}

$(document).ready(function () {
    canvas = $('#canvas')[0];
    canvas.width = config.size.width;
    canvas.height = config.size.height;
    ctx = canvas.getContext("2d");
    finalImageData = ctx.createImageData(config.size.width, config.size.height).data;

    tempCanvas = $('#tmpCanvas')[0];
    tempCanvas.width = config.size.width;
    tempCanvas.height = config.size.height;
    tmpCtx = tempCanvas.getContext("2d");
    addImageToAverage(0);
});



