var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        size: 250
    }
};


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


function updateCanvas() {
    paintUlamSpiral(imageData.data);
    ctx.putImageData(imageData, 0, 0)
}

function configChanged() {
    config.size.size = $('#size').val();
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
    $('#size').val(config.size.size);
    imageData = ctx.createImageData(config.size.size, config.size.size);
    updateCanvas();
});


