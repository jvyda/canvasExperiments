import {ColoredAngle} from "./NumberRenderer";
import {ColorProvider} from "ce-common";
import {CircularConfig, Config} from "./Config";

export interface PointProvider {
    getPoints(provider: ColorProvider, config: Config): Array<ColoredAngle>;
}

export class CircularPointProvider implements PointProvider{
    getPoints(provider: ColorProvider, config: CircularConfig): Array<ColoredAngle> {
        let points : Array<ColoredAngle> = [];
        let increment = 2 * Math.PI / 10;
        let currentAngle = 0;

        for (let i = 0; i < 10; i++) {
            currentAngle = currentAngle + increment;
            points[i] = new ColoredAngle(currentAngle, provider.getColor(i), config.center, config.size);
        }
        return points;
    }

}