import {RandomUtil} from "./RandomUtil";
import {Vector2} from "./Vector";

export class Point2 {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    pointDistance(point2: Point2) {
        return Math.sqrt(Math.pow(this.x - point2.x, 2) +
            Math.pow(this.y - point2.y, 2));
    }

    static randomPoint(xbounds: number, ybounds: number) {
        return new Point2(RandomUtil.roundedRandom(xbounds), RandomUtil.roundedRandom(ybounds));
    }


    getPoint = function (arc:number, distance:number) {
        return new Point2(
            this.x + distance * Math.cos(arc),
            this.y + distance * Math.sin(arc)
        )
    };

    getPointVec = function (vec:Vector2, distance:number) {
        return new Point2(
            this.x + vec.x * distance,
            this.y + vec.y * distance
        )
    };
}