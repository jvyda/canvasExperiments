import { FileParser } from "./FileParser";
import { ColoredAngle, NumberRenderer } from "./NumberRenderer";
import { NumberLoader } from "./FileLoader";
import { Config } from "./Config";
export declare class MainLoop {
    execute(): void;
    loadNumbersAndRender(loader: NumberLoader, fp: FileParser, renderer: NumberRenderer, points: Array<ColoredAngle>, config: Config, part: number): Promise<any>;
}
