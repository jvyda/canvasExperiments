import {QuadTree, QuadTreeNode} from "./QuadTree";
import {MyCanvasRenderingContext2D, Point2} from 'ce-common';
import {QuadTreeDrawConfig} from "./Config";

export abstract class Renderer {
    protected ctx: MyCanvasRenderingContext2D;


    constructor(ctx: MyCanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    abstract render(object:any): void;
}

export class QuadTreeRenderer extends Renderer {

    private cfg: QuadTreeDrawConfig;
    constructor(ctx: MyCanvasRenderingContext2D) {
        super(ctx);
    }

    render(object: QuadTree): void {
        let root = object.root;
        this.cfg = QuadTreeDrawConfig.getInstance();
        this.renderNode(root);
    }

    renderNode(object: QuadTreeNode): void {
        if(!object) {
            return;
        }

        if(object.side < (1/this.cfg.scale)){
            return;
        }

        // base it on local values, for rotating featuree
        let xStartvalue = object.base.x;
        let yStartValue = object.base.y;
        let xOffset = 0;
        let yOffset = 0;
        let centerPoint = new Point2(0, 0);
        let leftPoint = new Point2(0 - object.side, 0);
        let upperPoint = new Point2(0, 0 - object.side);
        let rightPoint = new Point2(0 + object.side, 0);
        let bottomPoint = new Point2(0, 0 + object.side);


        this.ctx.beginPath();
        this.ctx.translate(xStartvalue, yStartValue);
        this.ctx.rotate(this.cfg.rotate);
        this.ctx.lineWidth = this.cfg.strokeWidth / this.cfg.scale;
        this.ctx.moveTo(centerPoint.x, centerPoint.y);
        this.ctx.lineTo(rightPoint.x, centerPoint.y);
        this.ctx.moveTo(centerPoint.x, centerPoint.y);
        this.ctx.lineTo(centerPoint.x, bottomPoint.y);
        this.ctx.moveTo(centerPoint.x, centerPoint.y);
        this.ctx.lineTo(leftPoint.x, centerPoint.y);
        this.ctx.moveTo(centerPoint.x, centerPoint.y);
        this.ctx.lineTo(centerPoint.x, upperPoint.y);
        this.ctx.rotate(-this.cfg.rotate);
        this.ctx.translate(-xStartvalue, -yStartValue);
        this.ctx.stroke();

        this.renderNode(object.NE);
        this.renderNode(object.SE);
        this.renderNode(object.NW);
        this.renderNode(object.SW);

    }

}