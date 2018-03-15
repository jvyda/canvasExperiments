import {Point2} from "./Point";

export class GeometryUtils {
    static getPointInAngle(angle: number, centerToBaseOf: Point2, distance: number):Point2 {
        return new Point2(centerToBaseOf.x + distance * Math.cos(angle), centerToBaseOf.y + distance * Math.sin(angle))
    }
}