import {Color} from "./ColorUtils";

export abstract class ColorProvider {
    constructor(protected colors: Array<Color>){

    }
    abstract getColor(parameter: number): Color;
}

export class EvenlyDistributedColorProvider extends ColorProvider{

    constructor(colors: Array<Color>, protected maxValues: number){
        super(colors);
    }
    getColor(parameter: number):Color {
        let index = parameter / this.maxValues;
        index *= this.colors.length;
        return this.colors[index << 0];
    }

}