import {Point2} from "./Point";

export class Vector2 {
    private _x: number;
    private _y: number;
    constructor(tip: Point2, shaft: Point2){
        this._x =  tip.x - shaft.x;
        this._y =  tip.y - shaft.y;
    }

    normalize(){
        let vectorLength = this.length();
        this._x /= vectorLength;
        this._y /= vectorLength;
    }

    length(){
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    rotate90Deg(){
        let xSave = this._x;
        this._x = this._y;
        this._y = xSave * -1;
    }

    dotProduct(vector2: Vector2){
        return this._x * vector2._x + this._y * vector2._y;
    }

    angleBetween(vector2: Vector2){
        return Math.acos(this.dotProduct(vector2));
    }


    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }
}