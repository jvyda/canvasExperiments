import {SystemManager} from "./SystemManager";
import {Turtle} from "./Turtle";
import {TurtleRuleGenerator} from "./TurtleRuleGenerator";
import {Config} from "./Config";
import {SystemRuleStorage} from "./SystemRuleStorage";
import {Utils} from "./Utils";

export class MainLoop {

    private manager: SystemManager;
    private ctx: CanvasRenderingContext2D;

    execute() {
        let canvas = <HTMLCanvasElement>document.getElementById('canvas');
        canvas.width = Config.width;
        canvas.height = Config.height;
        this.ctx = canvas.getContext('2d');
        this.manager = new SystemManager();

        let iterationsButton = <HTMLButtonElement> document.getElementById('iterationsBtn');
        let ticksInput = (<HTMLInputElement>document.getElementById('ticksInput'));
        iterationsButton.onclick = () => {
            Config.iterations = parseInt(ticksInput.value);
            this.manager.resetSequences();
            this.updateTurtleDisplay();
        };
        ticksInput.value = Config.iterations + '';

        let dragonCurveBtn = <HTMLButtonElement> document.getElementById('dragonCurveBtn');
        dragonCurveBtn.onclick = () => {
            Config.angle = Utils.degToRad(45);
            this.manager.setToSystem(SystemRuleStorage.dragonCurve());
            this.updateTurtleDisplay();
        };

        let randomBtn = <HTMLButtonElement> document.getElementById('random');
        randomBtn.onclick = () => {
            Config.angle = Math.random() * 2 * Math.PI;
            this.manager.setToSystem(SystemRuleStorage.randomRules());
            this.updateTurtleDisplay();
        };

        Config.angle = Utils.degToRad(45);
        this.manager.setToSystem(SystemRuleStorage.dragonCurve());
        this.updateTurtleDisplay();

    }

    updateTurtleDisplay(){
        for (let i = 0; i < Config.iterations; i++) {
            this.manager.tick();
        }
        /* manager.sequences.forEach(value => {
        console.log(value.join())
    });*/
        let turtleRules = TurtleRuleGenerator.getTurtleRules();
        let turtle = new Turtle(this.ctx, turtleRules);
        turtle.interpretSequence(this.manager.sequences[this.manager.sequences.length - 1]);
    }



}