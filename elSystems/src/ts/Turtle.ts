import {Vector2} from "./Vector2";
import {Utils} from "./Utils";
import {Config} from "./Config";

export interface TurtleRule {
    [rules: string] : (turtle: Turtle, ctx: CanvasRenderingContext2D) => void;
}

export class Turtle {

    private ctx : CanvasRenderingContext2D;
    private _position: Vector2;
    private turtleRules: TurtleRule;
    private distance = 10;
    private tickAngle = Config.angle;
    private currentAngle = Utils.degToRad(-90);
    private oldAngles : Array<number> = [];
    private oldPositions : Array<Vector2>;
    private oldColorIndexes: Array<number> = [];
    private colorIndex: number = 0;
    private rainbowColors = Utils.createRainbowColors(0.5);

    constructor(ctx: CanvasRenderingContext2D, turtleRules: TurtleRule) {
        this.ctx = ctx;
        this.turtleRules = turtleRules;
        this._position = new Vector2(Config.width / 2, Config.height / 2);
        this.oldPositions = [];
        this.distance = Config.distance;
    }

    interpretSequence(sequence: string[]){
        this.ctx.clearRect(0, 0, Config.width, Config.height);
        this.updateColor();
        this.ctx.moveTo(this.position.x, this.position.y);
        sequence.forEach(value => {
            this.turtleRules[value](this, this.ctx);
            this.ctx.lineTo(this.position.x, this.position.y);
        });
        this.ctx.stroke();
    }


    get position(): Vector2 {
        return this._position;
    }

    move(){
        let rotated = this.rotateVectorAccordingToAngle(new Vector2(this.distance, 0));
        this.position.x += rotated.x;
        this.position.y += rotated.y;
    }

    rotate(){
        this.currentAngle -= this.tickAngle;
    }

    rotateReverse(){
        this.currentAngle += this.tickAngle;
    }

    saveState(){
        this.oldAngles.push(this.currentAngle);
        this.oldPositions.push(new Vector2(this._position.x, this._position.y));
        this.oldColorIndexes.push(this.colorIndex);
    }

    popState(){
        if(this.oldPositions.length == 0){
            return;
        }
        this.ctx.stroke();
        this.ctx.beginPath();
        this._position = this.oldPositions.pop();
        this.currentAngle = this.oldAngles.pop();
        this.colorIndex = this.oldColorIndexes.pop();
    }

    rotateVectorAccordingToAngle(vec: Vector2){
        let vector = new Vector2();
        vector.x = Math.cos(this.currentAngle) * vec.x - Math.sin(this.currentAngle) * vec.y;
        vector.y = Math.sin(this.currentAngle) * vec.x - Math.cos(this.currentAngle) * vec.y;
        return vector;
    }

    drawToPosition() {
        this.ctx.lineTo(this.position.x, this.position.y);
    }

    incrementColor() {
        this.colorIndex += 1;
        this.updateColor();
    }

    private updateColor() {
        this.ctx.stroke();
        this.ctx.beginPath();
        this.colorIndex = this.colorIndex % this.rainbowColors.length;
        this.ctx.strokeStyle = this.rainbowColors[this.colorIndex].styleRGB;
    }

    decrementColor() {
        this.colorIndex -= 1;
        if(this.colorIndex < 0){
            this.colorIndex = 0;
        }
        this.updateColor();
    }
}