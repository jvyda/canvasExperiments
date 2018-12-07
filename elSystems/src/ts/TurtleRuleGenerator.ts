import {Turtle, TurtleRule} from "./Turtle";
import {Config} from "./Config";

export class TurtleRuleGenerator {
    static getTurtleRules(){
        let turtleRules : TurtleRule= {};
        let drawF = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
            turtle.move();
        };

        let rotate = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
          turtle.rotate();
        };

        let rotateReverse = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
            turtle.rotateReverse();
        };

        let saveState = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
            turtle.saveState();
        };

        let noop = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {

        };

        let popState = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
            ctx.stroke();
            ctx.beginPath();

            ctx.moveTo(turtle.position.x, turtle.position.y);
            turtle.popState();
        };

        let incrementColor = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
            turtle.incrementColor();

            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(turtle.position.x, turtle.position.y);
        };

        let decrementColor = (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
            turtle.decrementColor();

            ctx.stroke();
            ctx.beginPath();

            ctx.moveTo(turtle.position.x, turtle.position.y);
        };

        let multiplicator = (factor: number) => {
            return (turtle: Turtle, ctx: CanvasRenderingContext2D) => {
                turtle.multiplyDistanceBy(1);
            }
        };

        turtleRules['F'] = drawF;
        turtleRules['G'] = drawF;
        turtleRules['I'] = noop;
        turtleRules['+'] = rotate;
        turtleRules['-'] = rotateReverse;
        turtleRules['['] = saveState;
        turtleRules[']'] = popState;
        turtleRules['R'] = incrementColor;
        turtleRules['C'] = decrementColor;
        Config.fillerChars.forEach(char => {
            turtleRules[char] = noop;
        });
        turtleRules['1'] = multiplicator(0.1);
        turtleRules['2'] = multiplicator(0.2);
        turtleRules['3'] = multiplicator(0.3);
        turtleRules['4'] = multiplicator(0.4);
        turtleRules['5'] = multiplicator(0.5);
        turtleRules['6'] = multiplicator(0.6);
        turtleRules['7'] = multiplicator(0.7);
        turtleRules['8'] = multiplicator(0.8);
        turtleRules['9'] = multiplicator(0.9);
        turtleRules['0'] = multiplicator(1.0);
        return turtleRules;
    }
}