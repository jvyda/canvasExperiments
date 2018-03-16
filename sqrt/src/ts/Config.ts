import {Config} from "ce-common";

export class SqrtConfig extends Config {

    public numbers: number;
    public parts: number;
    public chunkSize: number;
}

export class CircularConfig extends SqrtConfig {
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