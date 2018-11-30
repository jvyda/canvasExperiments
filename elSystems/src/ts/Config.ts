import {Utils} from "./Utils";

export class Config {
    public static width = window.innerWidth;
    public static height = window.innerHeight;

    public static angle = Utils.degToRad(45);
    public static distance = window.innerHeight / 150;
    public static iterations = 6;
    public static angleChars = ['+', '-'];
    public static moveChars = ['F', 'G'];
    public static stateChars = ['[', ']']
    public static alphabet = Config.angleChars.concat(Config.moveChars).concat(Config.stateChars);
}