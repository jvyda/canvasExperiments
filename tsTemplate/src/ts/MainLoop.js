"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var SourceProvider_1 = require("./SourceProvider");
var ce_common_1 = require("ce-common");
var MainLoop = /** @class */ (function () {
    function MainLoop() {
    }
    MainLoop.prototype.execute = function () {
        var provider = new SourceProvider_1.NasaSqrt2SourceProvider();
        var loader = provider.getLoader();
        var config = provider.getConfig();
        var fp = provider.getParser();
        var canvas = $('#canvas')[0];
        canvas.width = config.dimensions.width;
        canvas.height = config.dimensions.height;
        var renderer = provider.getRenderer(canvas.getContext("2d"));
        var pointProvider = provider.getPointProvider();
        var rainbowColors = ce_common_1.Color.getRainboColors(1 / 16, 255);
        var colorProvider = provider.getColorProvider(rainbowColors);
        var points = pointProvider.getPoints(colorProvider, config);
        this.loadNumbersAndRender(loader, fp, renderer, points, config, 0).catch(function (err) { return console.log(err); });
    };
    MainLoop.prototype.loadNumbersAndRender = function (loader, fp, renderer, points, config, part) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (part > config.parts) {
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    resolve();
                                })];
                        }
                        return [4 /*yield*/, loader.loadPart(part).then(function (value) {
                                var numbers = fp.parseFileContents(value);
                                return renderer.renderNumbers(numbers, points, config);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadNumbersAndRender(loader, fp, renderer, points, config, part + 1)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MainLoop;
}());
exports.MainLoop = MainLoop;
