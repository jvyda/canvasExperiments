export class Renderer {

    private canvas: any;
    private ctx: CanvasRenderingContext2D;


    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    public renderLoop(){

    }
}