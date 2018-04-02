import {Point2} from "ce-common";
import {Line, RandomUtil} from "ce-common";
import {TesselationConfig} from "./TesselationConfig";

export enum ProgressionDirection {
    UP, DOWN, LEFT, RIGHT
}

export class DirectionConfiguration {
    dir: ProgressionDirection;
    fun: (pointA: Point2, pointB: Point2) => boolean;
    getPointInConnectingPosition: (point: Point2, cfg: TesselationConfig) => Point2;
    getStatPoint: (cfg: TesselationConfig) => Point2;


    constructor(dir: ProgressionDirection, fun:  (pointA: Point2, pointB: Point2) => boolean,
                getPointInConnectingPosition: (point: Point2, cfg: TesselationConfig) => Point2,
                getStartPoint: (cfg: TesselationConfig) => Point2) {
        this.dir = dir;
        this.fun = fun;
        this.getPointInConnectingPosition = getPointInConnectingPosition;
        this.getStatPoint = getStartPoint;
    }
}

export class TesselationLayout {
    private _structures: Array<Structure> = [];


    getNextPoint(p: Point2, maxDistance: number, secondCompareFun: DirectionConfiguration): Point2{
        let newPoint;
        let allDockingPoints: Array<PointOnStructure> = [];
        // get all docking points, because everything is possible
        this.structures.forEach((baseStructure) => {
            // extend
            allDockingPoints.push.apply(allDockingPoints, baseStructure.dockingPoints);
        });
        let tries = 0;
        do {
            let randomDockingPoint = RandomUtil.randomElement(allDockingPoints);
            let distance = p.pointDistance(randomDockingPoint.point);
            if(secondCompareFun.fun(p, randomDockingPoint.point) && distance < maxDistance && distance > 0.1){
                newPoint = randomDockingPoint.point;
            }
            tries++;
        } while(!newPoint && tries < 200);
        return newPoint;
    }

    get structures(): Array<Structure> {
        return this._structures;
    }

    set structures(value: Array<Structure>) {
        this._structures = value;
    }
}

export class ComputedLine {
    private _lines: Array<Line> = [];


    get lines(): Array<Line> {
        return this._lines;
    }

    set lines(value: Array<Line>) {
        this._lines = value;
    }
}

export class ComputedTesellation {
    private _computedLines: Array<ComputedLine> = [];


    get computedLines(): Array<ComputedLine> {
        return this._computedLines;
    }

    set computedLines(value: Array<ComputedLine>) {
        this._computedLines = value;
    }
}


export abstract class Structure {
    constructor(protected  _dockingPoints: Array<PointOnStructure>){

    }


    addDockingPoint(point: Point2){
        this._dockingPoints.push(new PointOnStructure(point, this));
    }

    get dockingPoints(): Array<PointOnStructure> {
        return this._dockingPoints;
    }

    set dockingPoints(value: Array<PointOnStructure>) {
        this._dockingPoints = value;
    }
}

export class PointOnStructure {

    constructor(private _point: Point2, private _reference: Structure){

    }


    get point(): Point2 {
        return this._point;
    }

    set point(value: Point2) {
        this._point = value;
    }

    get reference(): Structure {
        return this._reference;
    }

    set reference(value: Structure) {
        this._reference = value;
    }
}

export class CircleWithSegments extends Structure {
    private _center: Point2;
    private _radius: number;


    constructor(center: Point2, radius: number) {
        super([]);
        this._center = center;
        this._radius = radius;
    }


    get center(): Point2 {
        return this._center;
    }

    set center(value: Point2) {
        this._center = value;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }
}

export class LineWithSegments extends Structure {


    constructor(private _start: Point2, private _end: Point2) {
        super([]);
        this.addDockingPoint(_start);
        this.addDockingPoint(_end);
    }


    get start(): Point2 {
        return this._start;
    }

    set start(value: Point2) {
        this._start = value;
    }

    get end(): Point2 {
        return this._end;
    }

    set end(value: Point2) {
        this._end = value;
    }
}