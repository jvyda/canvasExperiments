function randomXDivWidth(x, y) {
    return (Math.random() * x / (config.size.width / 255)) % 255;
}

function randomYDivHeight(x, y) {
    return (Math.random() * y / (config.size.height / 255)) % 255;
}

function zero(x, y) {
    return 0;
}

function oneTwenty(x, y) {
    return 120;
}

function max(x, y) {
    return 255;
}

function xY(x, y) {
    return (x * y) % 255;
}
function yy(x, y) {
    return (y * y) % 255;
}
function xPowY(x, y) {
    return (Math.pow(x, y)) % 255;
}

function singgtXYDivsinXDivY(x, y) {
    return (Math.sin(ggt(x, y)) / Math.sin(x / y)) % 255;
}

function powggtXYacosxDivY(x, y) {
    return (Math.pow(ggt(x, y), Math.acos(x / y))) % 255;
}

function powggtXYX(x, y) {
    return (Math.pow(ggt(x, y), x)) % 255;
}

function cosXDivY1DivCosX(x, y) {
    return (Math.cos(x / y) * (1 / (Math.cos(x)))) % 255;
}

function sinXDivYDiv1DivX(x, y) {
    return (Math.sin(x / y) / (1 / x)) % 255;
}

function tanXDivYDiv1DivYX(x, y) {
    return (Math.tan(x / y) / (1 / y * x)) % 255;
}

function tanXYDiv1DivX(x, y) {
    return (Math.tan(x * y) / (1 / x)) % 255;
}

function xDivYCosX(x, y) {
    return (x / y * Math.cos(x)) % 255;
}

function yDivXDivCosXY(x, y) {
    return (y / x / Math.cos(x * y)) % 255;
}

function powYSinX(x, y) {
    return (Math.pow(y, Math.sin(x))) % 255;
}

function powXYDivX(x, y) {
    return (Math.pow(x, y / x)) % 255;
}

function logXLogy500(x, y) {
    return (Math.log(x) * Math.log(y) * 500) % 255;
}

function sqrtxyy(x, y) {
    return (Math.sqrt(x * y * y)) % 255;
}

function notXYXorNotYX(x, y) {
    return ((~x * y) ^ (~y * x)) % 255;
}

function xyAndx(x, y) {
    return ((x * y) & (x)) % 255;
}

function xAndy(x, y) {
    return ((x & y)) % 255;
}

function xXorY(x, y) {
    return ((x ^ y)) % 255;
}

function xAndY3(x, y) {
    return ((x & y) * 3) % 255;
}

function xOrY(x, y) {
    return (x | y) % 255;
}

function ggtY17x19(x, y) {
    return (ggt(y * 17, x * 19)) % 255;
}

function ggtx17y19(x, y) {
    return (ggt(x * 17, y * 19)) % 255;
}

function cosXX3255(x, y) {
    return (Math.cos(x * x * 3) * 255) % 255;
}

function cosXY3255(x, y) {
    return (Math.cos(x * y * 3) * 255) % 255;
}

function cosYX(x, y) {
    return (Math.cos(y) * x) % 255;
}

function randomY(x, y) {
    return (Math.random() * y) % 255;
}

function randomYDiv3(x, y) {
    return (Math.random() * y / 3) % 255;
}

function randomX25(x, y) {
    return (Math.random() * x * 25) % 255;
}

function ggTXYMod(x, y) {
    return (ggt(x, y)) % 255;
}

var black = {};
black.red = zero;
black.green = zero;
black.blue = zero;
black.alpha = max;

var violetToGreenRandom = {};
violetToGreenRandom.red = zero;
violetToGreenRandom.green = randomXDivWidth;
violetToGreenRandom.blue = randomYDivHeight;
violetToGreenRandom.alpha = oneTwenty;

var redGreenTrippy = {};
redGreenTrippy.red = xY;
redGreenTrippy.green = yy;
redGreenTrippy.blue = xPowY;
redGreenTrippy.alpha = max;

var kachelnGrey = {};
kachelnGrey.red = xY;
kachelnGrey.green = xY;
kachelnGrey.blue = xY;
kachelnGrey.alpha = max;

var sternSchnuppenRed = {};
sternSchnuppenRed.red = ggTXYMod;
sternSchnuppenRed.green = zero;
sternSchnuppenRed.blue = zero;
sternSchnuppenRed.alpha = max;

var reddish = {};
reddish.red = randomX25;
reddish.green = randomYDiv3;
reddish.blue = randomY;
reddish.alpha = oneTwenty;

var horizontalRedLines = {};
horizontalRedLines.red = cosYX;
horizontalRedLines.green = zero;
horizontalRedLines.blue = zero;
horizontalRedLines.alpha = max;

var violetRedCircles = {};
violetRedCircles.red = cosXY3255;
violetRedCircles.green = zero;
violetRedCircles.blue = cosXX3255;
violetRedCircles.alpha = max;

var redGreenRaster = {};
redGreenRaster.red = ggtx17y19;
redGreenRaster.green = ggtY17x19;
redGreenRaster.blue = zero;
redGreenRaster.alpha = max;

var pixelAndPerfect = {};
pixelAndPerfect.red = xOrY;
pixelAndPerfect.green = zero;
pixelAndPerfect.blue = zero;
pixelAndPerfect.alpha = max;

var perfectRaster2 = {};
perfectRaster2.red = xAndY3;
perfectRaster2.green = zero;
perfectRaster2.blue = zero;
perfectRaster2.alpha = max;

var nearlyPerfectRaster = {};
nearlyPerfectRaster.red = xXorY;
nearlyPerfectRaster.green = zero;
nearlyPerfectRaster.blue = zero;
nearlyPerfectRaster.alpha = max;

var perfectRedRaster = {};
perfectRedRaster.red = xAndy;
perfectRedRaster.green = zero;
perfectRedRaster.blue = zero;
perfectRedRaster.alpha = max;

var kreiselInRed = {};
kreiselInRed.red = xyAndx;
kreiselInRed.green = zero;
kreiselInRed.blue = zero;
kreiselInRed.alpha = max;

var redSkewedLines = {};
redSkewedLines.red = notXYXorNotYX;
redSkewedLines.green = zero;
redSkewedLines.blue = zero;
redSkewedLines.alpha = max;

var someShit = {};
someShit.red = sqrtxyy;
someShit.green = sqrtxyy;
someShit.blue = zero;
someShit.alpha = max;

var straightToLinesColor = {};
straightToLinesColor.red = zero;
straightToLinesColor.green = logXLogy500;
straightToLinesColor.blue = zero;
straightToLinesColor.alpha = max;

var powerSpike = {};
powerSpike.red = powXYDivX;
powerSpike.green = zero;
powerSpike.blue = zero;
powerSpike.alpha = max;

var topDownLines = {};
topDownLines.red = powYSinX;
topDownLines.green = zero;
topDownLines.blue = zero;
topDownLines.alpha = max;

var crashFromLeft = {};
crashFromLeft.red = yDivXDivCosXY;
crashFromLeft.green = zero;
crashFromLeft.blue = zero;
crashFromLeft.alpha = max;

var redTopDownLine = {};
redTopDownLine.red = xDivYCosX;
redTopDownLine.green = zero;
redTopDownLine.blue = zero;
redTopDownLine.alpha = max;

var weird = {};
weird.red = tanXYDiv1DivX;
weird.green = zero;
weird.blue = zero;
weird.alpha = max;

var bigRedAndSmallRed = {};
bigRedAndSmallRed.red = tanXDivYDiv1DivYX;
bigRedAndSmallRed.green = zero;
bigRedAndSmallRed.blue = zero;
bigRedAndSmallRed.alpha = max;

var dunes = {};
dunes.red = sinXDivYDiv1DivX;
dunes.green = zero;
dunes.blue = zero;
dunes.alpha = max;

var fastRedLights = {};
fastRedLights.red = cosXDivY1DivCosX;
fastRedLights.green = zero;
fastRedLights.blue = zero;
fastRedLights.alpha = max;

var rightJute = {};
rightJute.red = powggtXYX;
rightJute.green = zero;
rightJute.blue = zero;
rightJute.alpha = max;

var someRain = {};
someRain.red = powggtXYacosxDivY;
someRain.green = zero;
someRain.blue = zero;
someRain.alpha = max;

var indescribable3 = {};
indescribable3.red = singgtXYDivsinXDivY;
indescribable3.green = zero;
indescribable3.blue = zero;
indescribable3.alpha = max;

// x / y * config.size.width * config.size.height
