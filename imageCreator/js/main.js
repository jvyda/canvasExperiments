var imageData = {};
var ctx = {};
var canvas = {};
var colDefinitionWrapper;
var imgDefinitionWrapper;
var oilFilterConfigWrapper;

var functions = [
    {text: 'Just plain True', fun: truish},
    {text: 'AND(x,y)', fun: and},
    {text: 'OR(x, y) Mod 5 Equals 10', fun: orMod25Eq10},
    {text: 'GGT(x, y) equals X', fun: ggtXYEqX},
    {text: 'GGT(x, y) Mod 5 equals 0', fun: ggtYXMod5Eq0},
    {text: 'X or Y is Prime', fun: eitherPrime},
    {text: 'X and Y is Prime', fun: bothPrime},
    {text: 'XOR(x, y) Mod 15 Equals 10', fun: xorMod15Eq10},
    {text: 'XOR(x, y) Mod 3*x Equals 5', fun: xorMod3X10Eq5},
    {text: 'XOR(x, y) Mod 3*Y Equals 5', fun: xorMod3YEq5},
    {text: 'AND(x, y) Mod 5 Equals 3', fun: andMod5Eq3},
    {text: 'cos(x) bigger than PI /4 same for y', fun: cosXBiPiDiv4CosYBiPiDiv4},
    {text: 'sin(x*y) bigger than 0.1', fun: sinXYBi},
    {text: 'sin(x, y) bigger than -1', fun: tanXYBi},
    {text: 'Icicles', fun: icicles},
    {text: 'weird Horizontal lines', fun: horizontalLines},
    {text: 'Weird I', fun: seltsam},
    {text: 'Weird II', fun: someExtremities},
    {text: 'Weird III', fun: someweird},
    {text: 'top distribution', fun: topDistribution},
    {text: 'Like stairs', fun: likeStairs},
    {text: 'like braille', fun: looksLikeBraille},
    {text: 'Straight to curved Lines', fun: straightToCurvedLines},
    {text: 'small tiles', fun: small},
    {text: 'hieroglyphs', fun: hieroglyphs},
    {text: 'barcode', fun: strichcode},
    {text: 'Seems going up and down', fun: beideSeitengerichted},
    {text: 'Dot pattern', fun: lochMuster}
];
var color_functions = [
    {text: 'Violet to green', fun: violetToGreenRandom},
    {text: 'Red Green trippy', fun: redGreenTrippy},
    {text: 'Black', fun: black},
    {text: 'Grey Kachel', fun: kachelnGrey},
    {text: 'Red Shooting Stars', fun: sternSchnuppenRed},
    {text: 'Random, but reddish on top', fun: reddish},
    {text: 'Horizontal Red Lines', fun: horizontalRedLines},
    {text: 'Violet Lines Red Circles', fun: violetRedCircles},
    {text: 'Red Green grid', fun: redGreenRaster},
    {text: 'Half Boxes, Half Triangles', fun: pixelAndPerfect},
    {text: 'Small boxes with small imperfections', fun: perfectRaster2},
    {text: 'Medium boxes with diagonal black lines', fun: nearlyPerfectRaster},
    {text: 'Perfect Boxes', fun: perfectRedRaster},
    {text: 'Circles in Red', fun: kreiselInRed},
    {text: 'Circles with skewed black lines', fun: redSkewedLines},
    {text: 'indescribable I', fun: someShit},
    {text: 'Straight to Lines in color', fun: straightToLinesColor},
    {text: 'indescribable II', fun: powerSpike},
    {text: 'Top Down Red Lines', fun: topDownLines},
    {text: 'Crash from the left', fun: crashFromLeft},
    {text: 'Weak lines from the top', fun: redTopDownLine},
    {text: 'Weird IV', fun: weird},
    {text: 'Big Red and smaller Red', fun: bigRedAndSmallRed},
    {text: 'Dunes', fun: dunes},
    {text: 'Flicker', fun: fastRedLights},
    {text: 'Jute from the left', fun: rightJute},
    {text: 'Red projectiles', fun: someRain},
    {text: 'indescribable III', fun: indescribable3}
];

var imageCreation = functions[0];
var colorCreation = color_functions[0];

function setNewFunction(update) {
    imageCreation = functions[$("#fun_select").val()];
    imageCreation.user = false;
    if (update) {
        updateCanvas();
    }
}

function setNewColorFunction() {
    colorCreation = color_functions[$("#col_select").val()];
    colorCreation.user = false;
    updateCanvas();
}


function userDefinedTfEnter(event) {
    if (event.keyCode == 13) {
        userDefinedFunction();
    }
}

function userDefinedColorTf(event) {
    if (event.keyCode == 13) {
        updateUserDefinedColor();
    }
}

function updateUrl() {
    var path = location.protocol + '//' + location.host + location.pathname;
    if (imageCreation.user) {
        path += '?f=' + encodeURIComponent(getValueFromFunction(imageCreation.fun));
    } else {
        path += '?pf=' + functions.indexOf(imageCreation);
    }
    if (colorCreation.user) {
        if (colorCreation.fun.red) {
            path += '&r=' + encodeURIComponent(getValueFromFunction(colorCreation.fun.red).replace('% 255', '').trim());
        }
        if (colorCreation.fun.green) {
            path += '&g=' + encodeURIComponent(getValueFromFunction(colorCreation.fun.green).replace('% 255', '').trim());
        }
        if (colorCreation.fun.blue) {
            path += '&b=' + encodeURIComponent(getValueFromFunction(colorCreation.fun.blue).replace('% 255', '').trim());
        }
        if (colorCreation.fun.alpha) {
            path += '&a=' + encodeURIComponent(getValueFromFunction(colorCreation.fun.alpha).replace('% 255', '').trim());
        }
    } else {
        path += '&pc=' + color_functions.indexOf(colorCreation);
    }
    if ($("#invert_chk").is(':checked')) {
        path += '&i=1';
    }
    path += '&w=' + config.size.width;
    path += '&h=' + config.size.height;
    $('#url').val(path);
}

function loadFromUrl() {
    var qd = {};
    location.search.substr(1).split("&").forEach(function (item) {
        var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]);
        (k in qd) ? qd[k].push(v) : qd[k] = [v]
    });

    if (qd['f']) {
        setUserDefinedFunction(qd['f']);
    } else if (qd['pf']) {
        $("#fun_select").val(parseInt(qd['pf']));
        setNewFunction(false);
    }
    if (qd['pc']) {
        $("#col_select").val(parseInt(qd['pc']));
        setNewColorFunction();
    } else if (qd['r'] || qd['g'] || qd['b'] || qd['a']) {
        setUserDefinedColors(qd['r'], qd['g'], qd['b'], qd['a']);
    }
    if (qd['i']) {
        $("#invert_chk").prop('checked', true);
    }
    if (qd['w']) {
        config.size.width = parseInt(qd['w']);
    }
    if (qd['h']) {
        config.size.height = parseInt(qd['h']);
    }
}

function updateCanvas() {
    var data = imageData.data;
    $("#desc").html(imageCreation.text);
    $("#background").html(colorCreation.text);
    showDefinition();
    updateUrl();
    //paintUlamSpiral(data);

    var invert = $("#invert_chk").is(':checked');
    for (var i = 0; i < data.length; i += 4) {
        var coor = getCoordinates(i);
        var x = coor.x;
        var y = coor.y;
        var weNeedToPaint = imageCreation.fun(x, y);
        var color = colorCreation.fun;
        if (weNeedToPaint && !invert) {
            data[i] = color.red(x, y);     // red
            data[i + 1] = color.green(x, y); // green
            data[i + 2] = color.blue(x, y); // blue
            data[i + 3] = color.alpha(x, y);
        } else if (invert && !weNeedToPaint) {
            data[i] = color.red(x, y);     // red
            data[i + 1] = color.green(x, y); // green
            data[i + 2] = color.blue(x, y); // blue
            data[i + 3] = color.alpha(x, y);
        }
        else {
            data[i] = 0;     // red
            data[i + 1] = 0; // green
            data[i + 2] = 0; // blue
            data[i + 3] = 0;
        }
    }
    if(config.oilEffectConfig.enabled) {
        applyOilEffect(data, ctx);
    }
    ctx.putImageData(imageData, 0, 0)
}

function setUserDefinedFunction(condition) {
    $("#function").val(condition);
    var args = ['x', 'y', 'return ' + condition];
    imageCreation = {};
    imageCreation.fun = Function.apply(null, args);
    imageCreation.text = 'user-defined';
    imageCreation.user = true;
}

function userDefinedFunction() {
    var condition = $("#function").val();
    setUserDefinedFunction(condition);
    updateCanvas();
}

function setUserDefinedColors(red, green, blue, alpha) {
    if (red == undefined) {
        red = 0;
    }
    if (green == undefined) {
        green = 0;
    }
    if (blue == undefined) {
        blue = 0;
    }
    if (alpha == undefined) {
        alpha = 255;
    }
    $("#tf_red").val(red);
    $("#tf_green").val(green);
    $("#tf_blue").val(blue);
    $("#tf_alpha").val(alpha);
    var redArgs = ['x', 'y', 'return ' + red + ((isNumber(red) || red == '') ? "" : " % 255")];
    var greenArgs = ['x', 'y', 'return ' + green + ((isNumber(green) || green == '') ? "" : " % 255")];
    var blueArgs = ['x', 'y', 'return ' + blue + ((isNumber(blue) || blue == '') ? "" : " % 255")];
    var alphaArgs = ['x', 'y', 'return ' + alpha + ((isNumber(alpha) || alpha == '') ? "" : " % 255")];
    var colorObj = {
        red: Function.apply(null, redArgs),
        green: Function.apply(null, greenArgs),
        blue: Function.apply(null, blueArgs),
        alpha: Function.apply(null, alphaArgs)
    };
    colorCreation = {};
    colorCreation.user = true;
    colorCreation.fun = colorObj;
    colorCreation.text = 'user-defined';
}

function updateUserDefinedColor() {
    var red = $("#tf_red").val();
    var green = $("#tf_green").val();
    var blue = $("#tf_blue").val();
    var alpha = $("#tf_alpha").val();
    setUserDefinedColors(red, green, blue, alpha);
    updateCanvas();
}

function getValueFromFunction(funPtr) {
    var col_fun_text = funPtr.toString();
    return col_fun_text.slice(col_fun_text.indexOf("return ") + 7, col_fun_text.lastIndexOf(";"));
}

function showDefinition() {
    if ($("#show_definition_chk").is(':checked')) {
        colDefinitionWrapper.show();
        imgDefinitionWrapper.show();
        $("#col_definition_red").html(getValueFromFunction(colorCreation.fun.red) + ' ');
        $("#col_definition_green").html(getValueFromFunction(colorCreation.fun.green) + ' ');
        $("#col_definition_blue").html(getValueFromFunction(colorCreation.fun.blue) + ' ');
        $("#col_definition_alpha").html(getValueFromFunction(colorCreation.fun.alpha) + ' ');
        $("#img_definition").html(getValueFromFunction(imageCreation.fun) + ' ');
    } else {
        colDefinitionWrapper.hide();
        imgDefinitionWrapper.hide();
    }
}

function reconfigureOilEffect() {
    config.oilEffectConfig.levels = $('#oil_effect_levels_tf').val();
    config.oilEffectConfig.radius = $('#oil_effect_radius_tf').val();
}
function showOilConfig() {
    if ($("#oilFilter_chk").is(':checked')) {
        oilFilterConfigWrapper.show();
        config.oilEffectConfig.enabled = true;
        reconfigureOilEffect();
    } else {
        config.oilEffectConfig.enabled = false;
        oilFilterConfigWrapper.hide();
        updateCanvas();
    }
}

function configChanged(event) {
    if (event.keyCode == 13) {
        updateConfig();
    }
}


function updateConfig() {
    config.size.width = $('#width').val();
    config.size.height = $('#height').val();
    canvas.height = config.size.height;
    canvas.width = config.size.width;
    reconfigureOilEffect();
    imageData = ctx.createImageData(config.size.width, config.size.height);
    updateCanvas();
}


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.height = config.size.height;
    canvas.width = config.size.width;
    colDefinitionWrapper = $("#col_definition_wrapper");
    imgDefinitionWrapper = $("#img_definition_wrapper");
    oilFilterConfigWrapper = $("#oil_filter_config_wrapper");
    initDropdownList('fun_select', functions);
    initDropdownList('col_select', color_functions);
    colDefinitionWrapper.hide();
    imgDefinitionWrapper.hide();
    $('#oil_effect_levels_tf').val(config.oilEffectConfig.levels);
    $('#oil_effect_radius_tf').val(config.oilEffectConfig.radius);
    oilFilterConfigWrapper.hide();
    $('#width').val(config.size.width);
    $('#height').val(config.size.height);
    imageData = ctx.createImageData(config.size.width, config.size.height);
    loadFromUrl();
    updateCanvas();
});


