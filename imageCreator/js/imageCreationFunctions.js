function truish() {
    return true;
}

function and(x, y) {
    return x & y;
}

function orMod25Eq10(x, y) {
    return (x | y) % 25 == 10;
}

function ggtXYEqX(x, y) {
    return ggt(x, y) == x;
}

function ggtYXMod5Eq0(x, y) {
    return ggt(y, x) % 5 == 0;
}

function eitherPrime(x, y) {
    return isPrime(x) || isPrime(y);
}

function bothPrime(x, y) {
    return isPrime(x) && isPrime(y);
}

function xorMod15Eq10(x, y) {
    return (x ^ y) % 15 == 10;
}

function xorMod3X10Eq5(x, y) {
    return (x ^ y) % (x * 3) == 5;
}

function xorMod3YEq5(x, y) {
    return (x ^ y) % (y * 3) == 5;
}

function andMod5Eq3(x, y) {
    return (x & y) % 5 == 3;
}

function cosXBiPiDiv4CosYBiPiDiv4(x, y) {
    return Math.cos(x) > Math.PI / 4 && Math.cos(y) > Math.PI / 4;
}

function sinXYBi(x, y) {
    return Math.sin(x * y) > 0.1;
}

function tanXYBi(x, y) {
    return Math.tan(x * y) > -1;
}

function icicles(x, y) {
    return Math.pow(Math.cos(x) * y, 10) > 0.4;
}

function horizontalLines(x, y) {
    return Math.pow(Math.sin(y) * x, 15) > 0.3;
}

function seltsam(x, y) {
    return Math.E * Math.cos(x * 3 * y) < 0.1;
}

function someExtremities(x, y) {
    return Math.E * Math.cos(x * -1 * y) < 0.1
}

function someweird(x, y) {
    return Math.PI * Math.cos(x * y * y) > 0.1;
}

function topDistribution(x, y){
    return x * ggt(x, y) / y > Math.log(x)*y;
}

function likeStairs(x, y){
    return ~x*y % 25 == 0;
}

function looksLikeBraille(x, y){
    return ggt(x, y) % 11 == 2;
}

function straightToCurvedLines(x, y){
    return Math.sqrt(x*y) % 25 < 2;
}

function small(x, y){
    return Math.sin(x) * Math.cos(y) < 0.1;
}

function hieroglyphs(x, y){
    return Math.tan(y * x )* Math.pow(Math.sin(x), Math.E) < 0.2;
}

function strichcode(x, y){
    return Math.tan(x * x) < 0.2;
}

function beideSeitengerichted(x, y){
    return Math.cos(y * Math.pow(x, 1/y)) < 0.4
}

function lochMuster(x, y){
    return Math.sin(x * ggt(x, y)) * Math.cos(y) < 0.9;
}

function something(x, y){
    return Math.pow(Math.abs(Math.sin(x)), Math.abs(Math.sin(y))) > 0.995
}


// Math.E * Math.cos(x * 3 * y) < 2.5
