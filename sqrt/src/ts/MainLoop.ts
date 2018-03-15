import {FileParser} from "./FileParser";
import * as $ from 'jquery';
import {ColoredAngle, NumberRenderer} from "./NumberRenderer";
import {NasaSqrt2SourceProvider, SourceProvider} from "./SourceProvider";
import {NumberLoader} from "./FileLoader";
import {Config} from "./Config";
import {PointProvider} from "./PointProvider";
import {Color} from "ce-common";

export class MainLoop {
    execute() {
        let provider: SourceProvider = new NasaSqrt2SourceProvider();
        let loader: NumberLoader = provider.getLoader();
        let config: Config = provider.getConfig();
        let fp: FileParser = provider.getParser();
        let canvas: HTMLCanvasElement = <HTMLCanvasElement> $('#canvas')[0];
        canvas.width = config.dimensions.width;
        canvas.height = config.dimensions.height;
        let renderer: NumberRenderer = provider.getRenderer(<CanvasRenderingContext2D>canvas.getContext("2d"));
        let pointProvider: PointProvider = provider.getPointProvider();
        let rainbowColors = Color.getRainboColors(1/16, 255);
        let colorProvider = provider.getColorProvider(rainbowColors);
        let points = pointProvider.getPoints(colorProvider, config);
        this.loadNumbersAndRender(loader, fp, renderer, points, config, 0).catch((err) => console.log(err));
    }

    async loadNumbersAndRender(loader: NumberLoader, fp: FileParser, renderer: NumberRenderer, points: Array<ColoredAngle>, config: Config, part: number): Promise<any> {
        if(part > config.parts){
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
        await loader.loadPart(part).then((value) => {
            console.log('part', part)
            return fp.parseFileContents(value);
        }).then((numbers)=> {
           return renderer.renderNumbers(numbers, points, config);
        }).then(() => {
            return this.loadNumbersAndRender(loader, fp, renderer, points, config, part + 1);
        })
    }

}