import {NasaSqrt2Config} from "./Config";
import {NasaSqrtFileLoader, NumberLoader} from "./FileLoader";
import {FileParser, NasaFileParser} from "./FileParser";
import {BezierNumberRenderer, NumberRenderer} from "./NumberRenderer";
import {CircularPointProvider, PointProvider} from "./PointProvider";
import {ColorProvider, EvenlyDistributedColorProvider, Color, Config} from "ce-common";

export abstract class SourceProvider {

    abstract getConfig(): Config;
    abstract getLoader(): NumberLoader;
    abstract getParser(): FileParser;
    abstract getRenderer(context:CanvasRenderingContext2D): NumberRenderer;
    abstract getPointProvider(): PointProvider;
    abstract getColorProvider(colors: Array<Color>): ColorProvider;
}

export class NasaSqrt2SourceProvider extends SourceProvider {
    getPointProvider(): PointProvider {
        return new CircularPointProvider();
    }

    getColorProvider(colors: Array<Color>) {
        return new EvenlyDistributedColorProvider(colors, 10);
    }
    getRenderer(context: CanvasRenderingContext2D): NumberRenderer {
        return new BezierNumberRenderer(context);
    }
    getConfig(): Config {
        return new NasaSqrt2Config();
    }

    getLoader(): NumberLoader {
        return new NasaSqrtFileLoader();
    }

    getParser(): FileParser {
        return new NasaFileParser();
    }





}