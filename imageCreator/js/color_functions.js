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
black.r = zero;
black.g = zero;
black.b = zero;
black.a = max;

var violetToGreenRandom = {};
violetToGreenRandom.r = zero;
violetToGreenRandom.g = randomXDivWidth;
violetToGreenRandom.b = randomYDivHeight;
violetToGreenRandom.a = oneTwenty;

var redGreenTrippy = {};
redGreenTrippy.r = xY;
redGreenTrippy.g = yy;
redGreenTrippy.b = xPowY;
redGreenTrippy.a = max;

var kachelnGrey = {};
kachelnGrey.r = xY;
kachelnGrey.g = xY;
kachelnGrey.b = xY;
kachelnGrey.a = max;

var sternSchnuppenRed = {};
sternSchnuppenRed.r = ggTXYMod;
sternSchnuppenRed.g = zero;
sternSchnuppenRed.b = zero;
sternSchnuppenRed.a = max;

var reddish = {};
reddish.r = randomX25;
reddish.g = randomYDiv3;
reddish.b = randomY;
reddish.a = oneTwenty;

var horizontalRedLines = {};
horizontalRedLines.r = cosYX;
horizontalRedLines.g = zero;
horizontalRedLines.b = zero;
horizontalRedLines.a = max;

var violetRedCircles = {};
violetRedCircles.r = cosXY3255;
violetRedCircles.g = zero;
violetRedCircles.b = cosXX3255;
violetRedCircles.a = max;

var redGreenRaster = {};
redGreenRaster.r = ggtx17y19;
redGreenRaster.g = ggtY17x19;
redGreenRaster.b = zero;
redGreenRaster.a = max;

var pixelAndPerfect = {};
pixelAndPerfect.r = xOrY;
pixelAndPerfect.g = zero;
pixelAndPerfect.b = zero;
pixelAndPerfect.a = max;

var perfectRaster2 = {};
perfectRaster2.r = xAndY3;
perfectRaster2.g = zero;
perfectRaster2.b = zero;
perfectRaster2.a = max;

var nearlyPerfectRaster = {};
nearlyPerfectRaster.r = xXorY;
nearlyPerfectRaster.g = zero;
nearlyPerfectRaster.b = zero;
nearlyPerfectRaster.a = max;

var perfectRedRaster = {};
perfectRedRaster.r = xAndy;
perfectRedRaster.g = zero;
perfectRedRaster.b = zero;
perfectRedRaster.a = max;

var kreiselInRed = {};
kreiselInRed.r = xyAndx;
kreiselInRed.g = zero;
kreiselInRed.b = zero;
kreiselInRed.a = max;

var redSkewedLines = {};
redSkewedLines.r = notXYXorNotYX;
redSkewedLines.g = zero;
redSkewedLines.b = zero;
redSkewedLines.a = max;

var someShit = {};
someShit.r = sqrtxyy;
someShit.g = sqrtxyy;
someShit.b = zero;
someShit.a = max;

var straightToLinesColor = {};
straightToLinesColor.r = zero;
straightToLinesColor.g = logXLogy500;
straightToLinesColor.b = zero;
straightToLinesColor.a = max;

var powerSpike = {};
powerSpike.r = powXYDivX;
powerSpike.g = zero;
powerSpike.b = zero;
powerSpike.a = max;

var topDownLines = {};
topDownLines.r = powYSinX;
topDownLines.g = zero;
topDownLines.b = zero;
topDownLines.a = max;

var crashFromLeft = {};
crashFromLeft.r = yDivXDivCosXY;
crashFromLeft.g = zero;
crashFromLeft.b = zero;
crashFromLeft.a = max;

var redTopDownLine = {};
redTopDownLine.r = xDivYCosX;
redTopDownLine.g = zero;
redTopDownLine.b = zero;
redTopDownLine.a = max;

var weird = {};
weird.r = tanXYDiv1DivX;
weird.g = zero;
weird.b = zero;
weird.a = max;

var bigRedAndSmallRed = {};
bigRedAndSmallRed.r = tanXDivYDiv1DivYX;
bigRedAndSmallRed.g = zero;
bigRedAndSmallRed.b = zero;
bigRedAndSmallRed.a = max;

var dunes = {};
dunes.r = sinXDivYDiv1DivX;
dunes.g = zero;
dunes.b = zero;
dunes.a = max;

var fastRedLights = {};
fastRedLights.r = cosXDivY1DivCosX;
fastRedLights.g = zero;
fastRedLights.b = zero;
fastRedLights.a = max;

var rightJute = {};
rightJute.r = powggtXYX;
rightJute.g = zero;
rightJute.b = zero;
rightJute.a = max;

var someRain = {};
someRain.r = powggtXYacosxDivY;
someRain.g = zero;
someRain.b = zero;
someRain.a = max;

var indescribable3 = {};
indescribable3.r = singgtXYDivsinXDivY;
indescribable3.g = zero;
indescribable3.b = zero;
indescribable3.a = max;

// x / y * config.size.width * config.size.height
