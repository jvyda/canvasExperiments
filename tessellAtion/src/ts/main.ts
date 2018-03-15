import * as $ from 'jquery';
import {Config} from "./config";
import {Renderer} from "./Renderer";
const common = require('../../../common/js/exportCommon');


$(document).ready(function () {
    canvas = $("#canvas")[0];

    let rend: Renderer = new Renderer(canvas);

});


