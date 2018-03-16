import {Dimension} from "./Dimension";
import {Point2} from './Point';

export class Config {
    public dimensions: Dimension = new Dimension(window.innerWidth, window.innerHeight);
    public center = new Point2(this.dimensions.width /2, this.dimensions.height /2);
    public width = window.innerWidth;
    public height = window.innerHeight;
    public stackSize: number = 5000;

    private static instance:Config;
    public static getInstance(){
        if(!this.instance){
            this.instance = new Config();
        }
        return this.instance;
    }
}