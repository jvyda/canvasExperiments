var imageData = {};
var ctx = {};
var canvas = {};

var $numberOfCircles = $("#numberOfCircles");
var $stretchiness = $("#stretchiness");
var $size = $('#size');
var $archimedeanWrapper = $("#archimedean_wrapper");

var config = {
    size: {
        size: 1000
    },
    stretchiness: 0.1,
    circleAmount: 1500
};


function paintArchimedianSpiral() {
    ctx.beginPath();
    ctx.clearRect(0, 0, config.size.size, config.size.size);
    var centerX = config.size.size / 2;

    var centerY = config.size.size / 2;
    ctx.moveTo(centerX, centerY);
    //var amount = 60;
    //var increment = 2 * Math.PI / amount;
    //var theta = increment;
    //while (theta < 100 * Math.PI) {
    //    var newX = centerX + theta * config.stretchiness * Math.cos(theta);
    //    var newY = centerY + theta * config.stretchiness * Math.sin(theta);
    //    ctx.lineTo(newX, newY);
    //    theta = theta + increment;
    //}
    //ctx.stroke();

    ctx.font = "8px Georgia";
    var cnt = 1;
    var theta2 = 0;
    for (var index = 1; index < config.circleAmount; index++) {
        var amountOfNumbers = Math.pow(index + 1, 2) - Math.pow(index, 2);
        var increment2 = 2 * Math.PI / amountOfNumbers;
        var amountOfAngle = (index) * 2 * Math.PI;
        var numbersDrawn = 0;
        // there are some rounding errors....
        while (theta2 < amountOfAngle && !(Math.abs(theta2 - amountOfAngle) < 0.00001)) {
            theta2 = theta2 + increment2;
            var newX2 = centerX + theta2 * config.stretchiness * Math.cos(theta2);
            var newY2 = centerY + theta2 * config.stretchiness * Math.sin(theta2);
            cnt++;
            if (isPrime(cnt)) {
                ctx.rect(newX2, newY2, 1, 1);
            }
            numbersDrawn++;
        }

    }
    ctx.stroke();
}

function paintUlamSpiral(data) {
    var coordinate_system = [];
    var index = 0;
    var step_width = 1;
    var last_pos = 0;
    coordinate_system[index++] = data.length / 2 + config.size.size / 2 * 4;
    last_pos = data.length / 2 + config.size.size / 2 * 4;
    var loops = 0;
    for (; coordinate_system.length < config.size.size * config.size.size;) {
        for (var going_right = 1; going_right <= step_width; going_right++) {
            coordinate_system[index++] = last_pos + going_right * 4;
        }

        last_pos = last_pos + step_width * 4;
        loops++;
        if (loops % 2 == 0) {
            step_width++;
        }
        for (var going_up = 1; going_up <= step_width; going_up++) {
            coordinate_system[index++] = last_pos - config.size.size * going_up * 4;
        }
        last_pos = last_pos - config.size.size * step_width * 4;
        loops++;
        if (loops % 2 == 0) {
            step_width++;
        }
        for (var going_left = 1; going_left <= step_width; going_left++) {
            coordinate_system[index++] = last_pos - going_left * 4;
        }
        last_pos = last_pos - step_width * 4;
        loops++;
        if (loops % 2 == 0) {
            step_width++;
        }
        for (var going_down = 1; going_down <= step_width; going_down++) {
            coordinate_system[index++] = last_pos + going_down * config.size.size * 4;
        }
        last_pos = last_pos + step_width * config.size.size * 4;
        loops++;
        if (loops % 2 == 0) {
            step_width++;
        }
    }
    coordinate_system.forEach(function (value, key) {
        if (isPrime(key)) {
            data[value] = 255;
            data[value + 1] = 0;
            data[value + 2] = 0;
            data[value + 3] = 255;
        }
    });
}

function updateArchimedeanConfig() {
    if (config.circleAmount == $numberOfCircles.val() && config.stretchiness == $stretchiness.val()) {
        return;
    }
    config.circleAmount = $numberOfCircles.val();
    config.stretchiness = $stretchiness.val();
    updateCanvas();
}

function initArchimedeanConfig() {
    $archimedeanWrapper.show();
    $numberOfCircles.val(config.circleAmount);
    $stretchiness.val(config.stretchiness);
}
function selectSpiral() {
    var selectedSpiral = $("#spiral_select").val();
    if (selectedSpiral == 1) {
        $archimedeanWrapper.hide();
        paintUlamSpiral(imageData.data);
        ctx.putImageData(imageData, 0, 0)
    } else {
        initArchimedeanConfig();
        paintArchimedianSpiral();
    }
}

function updateCanvas() {
    selectSpiral();
}

function configChanged() {
    if (config.size.size == $size.val()) {
        return;
    }
    config.size.size = $size.val();
    canvas.height = config.size.size;
    canvas.width = config.size.size;
    imageData = ctx.createImageData(config.size.size, config.size.size);
    updateCanvas();
}


$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.height = config.size.size;
    canvas.width = config.size.size;
    $size.val(config.size.size);
    initArchimedeanConfig();
    $archimedeanWrapper.hide();
    imageData = ctx.createImageData(config.size.size, config.size.size);
    updateCanvas();
});


