import {CanvasUtils} from "./CanvasUtils";
import {OilConfig} from "./OilConfig";
import {Dimension} from "./Dimension";

export class OilEffect {
    applyToCanvas(data: Uint8ClampedArray, ctx: CanvasRenderingContext2D, dim: Dimension, config: OilConfig){
        let copy = ctx.createImageData(dim.width, dim.height);
        copy.data.set(data);
        let canvasUtil = new CanvasUtils(dim.width, dim.height);
        for (let item = 0; item < copy.data.length; item += 4) {
            let coor = canvasUtil.getCoordinates(item);
            let x = coor.x;
            let y = coor.y;
            let hist = [];
            let sr = [];
            let sg = [];
            let sb = [];
            let sa = [];
            for (let histIndex = 0; histIndex < config.levels; histIndex++) {
                hist.push(0);
            }
            for (let index = 0; index < config.levels + 1; index++) {
                sr.push(0);
                sg.push(0);
                sb.push(0);
                sa.push(0);
            }
            for (let x_d = -config.radius; x_d <= config.radius; x_d++) {
                if (x + x_d < 0 || x + x_d > dim.width) continue;
                for (let y_d = -config.radius; y_d <= config.radius; y_d++) {
                    if (y + y_d < 0 || y + y_d > dim.height) continue;
                    let tempItem = canvasUtil.getIndexForCoordinate(x + x_d, y + y_d);
                    let l = Math.floor(((copy.data[tempItem] + copy.data[tempItem + 1] + copy.data[tempItem + 2] + copy.data[tempItem + 3]) / 3.0) * (config.levels / (255.0)));
                    hist[l]++;
                    sr[l] += copy.data[tempItem];
                    sg[l] += copy.data[tempItem + 1];
                    sb[l] += copy.data[tempItem + 2];
                    sa[l] += copy.data[tempItem + 3];
                }
            }

            let currentMax = 0;
            let pixels = 0;
            for (let anotherI = 0; anotherI < config.levels; anotherI++) {
                if (hist[anotherI] >= pixels) {
                    currentMax = anotherI;
                    pixels = hist[anotherI];
                }
            }
            data[item] = sr[currentMax] / pixels;     // red
            data[item + 1] = sg[currentMax] / pixels; // green
            data[item + 2] = sb[currentMax] / pixels; // blue
            data[item + 3] = sa[currentMax] / pixels;

        }
    }
}