"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var Renderer_1 = require("./Renderer");
var MainLoop = /** @class */ (function () {
    function MainLoop() {
    }
    MainLoop.prototype.execute = function () {
        var canvas = $('#canvas')[0];
        var render = new Renderer_1.QuadTreeRenderer(canvas.getContext("2d"));
    };
    return MainLoop;
}());
exports.MainLoop = MainLoop;
