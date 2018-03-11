export class OilConfig {
    private _levels: number;
    private _radius: number;

    get levels(): number {
        return this._levels;
    }

    set levels(value: number) {
        this._levels = value;
    }


    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }
}