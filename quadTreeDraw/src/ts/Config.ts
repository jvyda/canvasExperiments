import {Config, Point2} from "ce-common";

export class QuadTreeDrawConfig extends Config {
    public quadTreeSideLength = Math.min(this.height, this.width);
    public quadTreeCenter = new Point2(this.quadTreeSideLength /2, this.quadTreeSideLength/ 2);
    public minSideLength = 2;
    public scale = 1;
    public strokeWidth = 1;
    public minScale = 0.99999;
    public scalingSmaller = 1 / 1.1;
    public scalingBigger = 1.1;
    public rotateIncr = 10;
    public rotate = 0;
    public rotateEnabled = true;

    private static qtinstance:QuadTreeDrawConfig;
    public static getInstance(){
        if(!this.qtinstance){
            this.qtinstance = new QuadTreeDrawConfig();
        }
        return this.qtinstance;
    }
}