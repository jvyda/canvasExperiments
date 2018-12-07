import {Vector2} from "./Vector2";

export class State {
    private _distance: number;
    private _colorIndex: number;
    private _angle: number;
    private _position: Vector2;


    constructor(distance: number, colorIndex: number, angle: number, position: Vector2) {
        this._distance = distance;
        this._colorIndex = colorIndex;
        this._angle = angle;
        this._position = position;
    }


    get distance(): number {
        return this._distance;
    }

    set distance(value: number) {
        this._distance = value;
    }

    get colorIndex(): number {
        return this._colorIndex;
    }

    set colorIndex(value: number) {
        this._colorIndex = value;
    }

    get angle(): number {
        return this._angle;
    }

    set angle(value: number) {
        this._angle = value;
    }

    get position(): Vector2 {
        return this._position;
    }

    set position(value: Vector2) {
        this._position = value;
    }
}