var imageData = {};
var ctx = {};
var canvas = {};


var config = {
    size: {
        width: 1000,
        height: 1000
    },
    template: {
    }
};

$(document).ready(function () {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    canvas.width = config.size.width;
    canvas.height = config.size.height;

});


