var config = {
    size: {
        width: 1920,
        height: 1080
    }
};

config.oilEffectConfig = {
    enabled: false,
    levels: 10,
    radius: 2
};

function ggt(m, n) {
    if (n == 0)
        return m;
    else
        return ggt(n, m % n);
}

function isNumber(obj) {
    return !isNaN(parseFloat(obj))
}
