import {Point2} from "./Point";

export class GeometryUtils {
    static getPointInAngle(angle: number, centerToBaseOf: Point2, distance: number): Point2 {
        return new Point2(centerToBaseOf.x + distance * Math.cos(angle), centerToBaseOf.y + distance * Math.sin(angle))
    }

    static getPointRotatedAroundPointByAngle(pointToRotate: Point2, center: Point2, angle: number): Point2 {
        let sinus = Math.sin(angle);
        let cosinus = Math.cos(angle);
        let px = pointToRotate.x - center.x;
        let py = pointToRotate.y - center.y;
        let xNew = px * cosinus - py * sinus;
        let yNew = px * sinus + py * cosinus;

        return new Point2(xNew + center.x, yNew + center.y);
    }
}