import {Config} from "ce-common";

export class TesselationConfig extends Config {
    public tileSize: number = 250;
    public jumpAmount: number = 5;
    public lineAmount: number = 2;
    public maxJumpDistance = this.tileSize * 0.75;
    public tilesX: number = this.width / this.tileSize;
    public tilesY: number = this.height / this.tileSize;
}