import * as $ from 'jquery';
import {QuadTreeRenderer} from "./Renderer";
import {QuadTreeDrawConfig} from "./Config";
import {Direction, FoundDirection, QuadTree, QuadTreeNode} from "./QuadTree";
import {Quad, Point2, Utils, CanvasUtils, MyCanvasRenderingContext2D, Vector2} from "ce-common";

export class MainLoop {
    private renderer: QuadTreeRenderer;
    private quad: QuadTree;
    private mouseDown: boolean;
    private canvas: HTMLCanvasElement;
    private ctx: MyCanvasRenderingContext2D;
    private cfg: QuadTreeDrawConfig;
    private toMove: Point2 = new Point2(0, 0);
    private lastDrag: Point2 = new Point2(0, 0);
    private deleteKeyDown: boolean= false;

    execute() {
        let $canvas = $('#canvas');
        this.canvas = <HTMLCanvasElement> $canvas[0];
        this.cfg = QuadTreeDrawConfig.getInstance();
        this.canvas.width = this.cfg.quadTreeSideLength;
        this.canvas.height = this.cfg.quadTreeSideLength;
        this.quad = new QuadTree();
        this.canvas.onmouseup = this.mouseUpHandler;
        this.canvas.onmousedown = this.mouseDownHandler;
        this.canvas.onmousemove = this.mouseMoveHandler;
        $canvas.on("wheel", this.wheelEventHandler);
        document.onkeyup = this.keyUp;
        document.onkeydown = this.keyPres;
        this.ctx = <MyCanvasRenderingContext2D>this.canvas.getContext("2d");
        CanvasUtils.trackTransforms(this.ctx);
        this.renderer = new QuadTreeRenderer(this.ctx);
        this.renderLoop();
    }



    keyPres = (event: KeyboardEvent) => {
        // x...
        if(Utils.eventIsKey(event, 88)){
            if(!this.deleteKeyDown) {
                this.deleteKeyDown = !this.deleteKeyDown;
            }
        }
    };

    keyUp = (event:KeyboardEvent) => {
        if(Utils.eventIsKey(event, 88)){
            if(this.deleteKeyDown) {
                this.deleteKeyDown = !this.deleteKeyDown;
            }
        }
    };

    wheelEventHandler = (event: JQuery.Event<any>) => {
        let scalePoint = Utils.getMousePosJQ(this.canvas, event);
        let svgScalePoint = this.ctx.transformedPoint(scalePoint.x, scalePoint.y);
        let scaleTo = (<WheelEvent> event.originalEvent).deltaY < 0 ? this.cfg.scalingSmaller : this.cfg.scalingBigger;
        let instance = QuadTreeDrawConfig.getInstance();
        instance.scale *= scaleTo;
        if (instance.scale < instance.minScale) {
            instance.scale /= scaleTo;
            return;
        }
        if (event.shiftKey && this.cfg.rotateEnabled) {
            this.cfg.rotate += Utils.toRad(this.cfg.rotateIncr * (scaleTo < 1 ? -1 : 1));
        } else {
            this.ctx.translate(svgScalePoint.x, svgScalePoint.y);
            this.ctx.scale(scaleTo, scaleTo);
            this.ctx.translate(-svgScalePoint.x, -svgScalePoint.y);
        }
        event.preventDefault()
    };

    renderLoop() {
        let topLeft = this.ctx.transformedPoint(0, 0);
        let bottomRight = this.ctx.transformedPoint(this.canvas.width, this.canvas.height);
        this.ctx.clearRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);

        this.ctx.translate(this.toMove.x, this.toMove.y);
        this.toMove.x = 0;
        this.toMove.y = 0;
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderer.render(this.quad);
        requestAnimationFrame(() => {
            this.renderLoop();
        });
    }

    mouseMoveHandler = (event: MouseEvent) => {
        if (this.mouseDown) {
            let mousePos = Utils.getMousePos(this.canvas, event);
            if (event.ctrlKey) {
                mousePos.x /= this.cfg.scale;
                mousePos.y /= this.cfg.scale;
                this.toMove.x += mousePos.x - this.lastDrag.x;
                this.toMove.y += mousePos.y - this.lastDrag.y;
                this.lastDrag = mousePos;
            } else {
                this.spawnPointAt(mousePos);
            }
        }
    };

    private deletePointAt(mousePosInCanvas: Point2){
        let mousePosInWorld = this.ctx.transformedPoint(mousePosInCanvas.x, mousePosInCanvas.y);
        if (mousePosInWorld.x < 0 || mousePosInWorld.x > this.cfg.quadTreeSideLength || mousePosInWorld.y < 0 || mousePosInWorld.y > this.cfg.quadTreeSideLength) {
            return;
        }
        let randomQuad = new Quad(new Point2(mousePosInWorld.x, mousePosInWorld.y), QuadTreeDrawConfig.getInstance().minSideLength / QuadTreeDrawConfig.getInstance().scale);
        this.quad.removeSquare(randomQuad);
    }

    private spawnPointAt(mousePosInCanvas: Point2) {
        let mousePosInWorld = this.ctx.transformedPoint(mousePosInCanvas.x, mousePosInCanvas.y);
        if (mousePosInWorld.x < 0 || mousePosInWorld.x > this.cfg.quadTreeSideLength || mousePosInWorld.y < 0 || mousePosInWorld.y > this.cfg.quadTreeSideLength) {
            return;
        }
        let randomQuad = new Quad(new Point2(mousePosInWorld.x, mousePosInWorld.y), QuadTreeDrawConfig.getInstance().minSideLength / QuadTreeDrawConfig.getInstance().scale);
        this.quad.addSquare(randomQuad);
    }

    mouseUpHandler = (event: MouseEvent) => {
        this.mouseDown = false;
        if (!event.ctrlKey && !this.deleteKeyDown) {
            let mousePos = Utils.getMousePos(this.canvas, event);
            this.spawnPointAt(mousePos);
        }
    };

    mouseDownHandler = (event: MouseEvent) => {
        this.mouseDown = true;
        let mousePos = Utils.getMousePos(this.canvas, event);
        if(this.deleteKeyDown) {
            this.deletePointAt(mousePos);
        } else if (!event.ctrlKey) {
            this.spawnPointAt(mousePos);
        }
        this.updateLastDrag(mousePos);
    };

    private updateLastDrag(mousePos: Point2) {
        mousePos.x /= this.cfg.scale;
        mousePos.y /= this.cfg.scale;
        this.lastDrag = mousePos;
    }
}