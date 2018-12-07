import {Vector2} from "./Vector2";
import {Utils} from "./Utils";
import {Config} from "./Config";
import {State} from "./State";

export interface TurtleRule {
    [rules: string] : (turtle: Turtle, ctx: CanvasRenderingContext2D) => void;
}

export class Turtle {

    private ctx : CanvasRenderingContext2D;
    private _position: Vector2;
    private turtleRules: TurtleRule;
    private distance: number;
    private tickAngle = Config.angle;
    private currentAngle = Utils.degToRad(-90);
    private colorIndex: number = 0;
    private rainbowColors = Utils.createRainbowColors(0.5);
    private states: Array<State> = [];

    constructor(ctx: CanvasRenderingContext2D, turtleRules: TurtleRule) {
        this.ctx = ctx;
        this.turtleRules = turtleRules;
        this._position = new Vector2(Config.width / 2, Config.height / 2);
        this.distance = Config.distance;
    }

    reset() {
        this._position = new Vector2(0, 0);
        this.currentAngle = Utils.degToRad(-90);
        this.colorIndex = 0;
    }

    interpretSequence(sequence: string[]){
        this.states = [];
        this.reset();
        this.ctx.clearRect(0, 0, 10000, 10000);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(Config.width / 2, Config.height / 2);
        this.updateColor();
        this.ctx.moveTo(this.position.x, this.position.y);
        sequence.forEach(value => {
            let turtleRule = this.turtleRules[value];
            turtleRule(this, this.ctx);
            this.ctx.lineTo(this.position.x, this.position.y);
        });
        this.ctx.stroke();
    }

    findMax(sequence: string[]){
        let minNegative = new Vector2(0,0);
        let maxPositive = new Vector2(0, 0);
        this.reset();
        sequence.forEach(value => {
            let turtleRule = this.turtleRules[value];
            turtleRule(this, this.ctx);
            minNegative.x = Math.min(minNegative.x, this._position.x);
            minNegative.y = Math.min(minNegative.y, this._position.y);
            maxPositive.x = Math.max(maxPositive.x, this._position.x);
            maxPositive.y = Math.max(maxPositive.y, this._position.y);
        });
        this._position = new Vector2(Config.width / 2, Config.height / 2);
        let width = Math.max(Math.abs(minNegative.x), maxPositive.x);
        let height = Math.max(Math.abs(minNegative.y), maxPositive.y);
        return new Vector2(width * 2, height * 2);
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
        let currentPosition = new Vector2(this.position.x, this.position.y);
        let state = new State(this.distance, this.colorIndex, this.currentAngle, currentPosition);
        this.states.push(state);
    }

    popState(){
        if(this.states.length == 0){
            return;
        }
        let lastState = this.states.pop();
        this._position = lastState.position;
        this.currentAngle = lastState.angle;
        this.colorIndex = lastState.colorIndex;
        this.distance = lastState.distance;
    }

    rotateVectorAccordingToAngle(vec: Vector2){
        let vector = new Vector2();
        vector.x = Math.cos(this.currentAngle) * vec.x - Math.sin(this.currentAngle) * vec.y;
        vector.y = Math.sin(this.currentAngle) * vec.x - Math.cos(this.currentAngle) * vec.y;
        return vector;
    }

    incrementColor() {
        this.colorIndex += 1;
        this.updateColor();
    }

    multiplyDistanceBy(factor: number){
        this.distance *= factor;
    }

    private updateColor() {
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