import {Config, Point2} from "ce-common";
import {Color} from "ce-common";
import {GeometryUtils} from "ce-common";
import {BezierConfig} from "./Config";

export abstract class NumberRenderer {
    protected ctx: CanvasRenderingContext2D;
    protected stacksize: number = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    abstract renderNumbers(numbers: Array<number>, points: Array<ColoredAngle>, config: Config): void;
}

export class BezierNumberRenderer extends NumberRenderer {

    private latestPoint: BezierPoint;
    private colorSource: Array<Color>;

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    renderNumbers (numbers: Array<number>, points: Array<ColoredAngle>, config: Config): Promise<any> {
        let actualConfig = <BezierConfig> config;
        if(!this.latestPoint) {
            let firstDigit = numbers.splice(0, 1)[0];
            let firstAngle = points[firstDigit];
            let firstBorderPoint = GeometryUtils.getPointInAngle(firstAngle.angle, actualConfig.center, actualConfig.size);
            let firstControlPoint = GeometryUtils.getPointInAngle(firstAngle.angle, actualConfig.center, actualConfig.size);
            this.latestPoint = new BezierPoint(firstBorderPoint, firstControlPoint);
        }
        // TODO proper rework, to use additional promises and not a promise with a big fat callback
        return new Promise((resolve, reject) => {
            this.renderDigits(numbers, points, actualConfig, resolve);
        })
    }


    private renderDigits(numbers: Array<number>, points: Array<ColoredAngle>, actualConfig: BezierConfig, cb: any) {
            if(numbers.length == 0) {
                return cb();
            }
            let digit = numbers.splice(0, 1)[0];
            let angle = points[digit];
            let point = angle.getActualPoint();
            let newCtrlPoint = GeometryUtils.getPointInAngle(angle.angle, actualConfig.center, actualConfig.controlPointDistance);
            this.ctx.beginPath();
            this.ctx.moveTo(this.latestPoint._point.x, this.latestPoint._point.y);
            this.ctx.strokeStyle = angle.color.styleRGB;
            this.ctx.bezierCurveTo(this.latestPoint._controlPoint.x, this.latestPoint._controlPoint.y, newCtrlPoint.x, newCtrlPoint.y, point.x, point.y);
            this.ctx.stroke();
            points[digit].angle += actualConfig.angleIncr;
            this.latestPoint._point = point;
            this.latestPoint._controlPoint = newCtrlPoint;
            this.stacksize++;
            if(this.stacksize > actualConfig.stackSize){
                this.stacksize = 0;
                requestAnimationFrame(() => {
                    this.renderDigits(numbers, points, actualConfig, cb)
                })
            } else {
                this.renderDigits(numbers, points, actualConfig, cb);
            }
    }
}


export class BezierPoint {

    constructor(public _point: Point2, public _controlPoint: Point2) {

    }

}

export class ColoredAngle {
    constructor(private _angle: number, private _color: Color, private _center: Point2, private _range: number) {

    }

    getActualPoint(): Point2 {
        return GeometryUtils.getPointInAngle(this.angle, this.center, this.range);
    }


    get angle(): number {
        return this._angle;
    }

    set angle(value: number) {
        this._angle = value;
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }

    get center(): Point2 {
        return this._center;
    }

    set center(value: Point2) {
        this._center = value;
    }

    get range(): number {
        return this._range;
    }

    set range(value: number) {
        this._range = value;
    }
}