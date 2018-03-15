import {Dimension} from "ce-common";
import {Point2} from "ce-common";

export class Config {
    public numbers: number;
    public parts: number;
    public chunkSize: number;
    public dimensions: Dimension = new Dimension(window.innerWidth, window.innerHeight);
    public center = new Point2(this.dimensions.width /2, this.dimensions.height /2);
    public stackSize: number = 5000;
}

export class CircularConfig extends Config {
    public angleIncr:number = 2 * Math.PI;
    public size:number = 400;
}

export class BezierConfig extends CircularConfig {
    public controlPointDistance: number = 250;
}

export class NasaSqrt2Config extends BezierConfig {
    constructor(){
        super();
        this.numbers = 10000000;
        this.chunkSize = 50000;
        this.parts = this.numbers / this.chunkSize;
        this.angleIncr = 2 * Math.PI / this.numbers;
    }
}