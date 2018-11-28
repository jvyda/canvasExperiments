import {Constants} from "./Contants";

export class Converter {
    public static  auPerDayToMPerSecond(value: number) {
        return value / 24 / 3600 * Constants.AU;
    }
}