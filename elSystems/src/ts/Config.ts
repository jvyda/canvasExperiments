import {Utils} from "./Utils";

export class Config {
    public static width = window.innerWidth;
    public static height = window.innerHeight;

    public static angle = Utils.degToRad(45);
    public static distance = window.innerHeight / 100;
    public static iterations = 6;
    public static angleChars = ['+', '-'];
    public static moveChars = ['F', 'G'];
    public static stateChars = ['[', ']'];
    public static colorChars = ['C', 'R'];
    //                            .2   .4  .6   .8   1    1.2  1.4  1.6  1.8  2.0
    public static lenghtChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    public static fillerChars = ['U','V','W',  'X', 'Y', 'Z'];
    public static alphabet = Config.angleChars.concat(Config.moveChars).concat(Config.stateChars).concat(Config.colorChars).concat(Config.fillerChars);
}