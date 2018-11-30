import {Turtle, TurtleRule} from "./Turtle";

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
            turtle.popState();
        };
        turtleRules['F'] = drawF;
        turtleRules['G'] = drawF;
        turtleRules['I'] = noop;
        turtleRules['+'] = rotate;
        turtleRules['-'] = rotateReverse;
        turtleRules['['] = saveState;
        turtleRules[']'] = popState;
        return turtleRules;
    }
}