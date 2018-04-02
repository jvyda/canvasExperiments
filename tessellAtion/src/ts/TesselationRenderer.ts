import {
    CircleWithSegments, ComputedTesellation, LineWithSegments, Structure,
    TesselationLayout
} from "./PossibleObjects";
import {Point2} from "ce-common";

export class TesselationRenderer {

    protected ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }


    public render(objectToRender: ComputedTesellation, base?: Point2){
        if(!base){
            base = new Point2(0, 0);
        }
        let computedLines = objectToRender.computedLines;
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        computedLines.forEach((computedLine) => {
            computedLine.lines.forEach((line) => {
                this.ctx.moveTo(base.x + line.end.x, base.y + line.end.y);
                this.ctx.lineTo(base.x +  line.start.x,base.y +  line.start.y);
            })
        });
        this.ctx.stroke();
    }

    public renderConfig(objectToRender: TesselationLayout, base?: Point2){
        if(!base){
            base = new Point2(0, 0);
        }
        let color = 'black';
        let objects = objectToRender.structures;
        objects.forEach((renderableObject) => {
            if(renderableObject instanceof CircleWithSegments){
                let actualObj = <CircleWithSegments> renderableObject;
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.ctx.arc(base.x + actualObj.center.x, base.y + actualObj.center.y, actualObj.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
                /*this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.renderLine(base, renderableObject);
                this.ctx.lineTo(base.x + renderableObject.dockingPoints[0].point.x, base.y + renderableObject.dockingPoints[0].point.y);
                this.ctx.stroke();*/
            }
            if(renderableObject instanceof LineWithSegments){
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.renderLine(base, renderableObject);
                this.ctx.stroke();
            }
        })
    }

    private renderLine(base: Point2, renderableObject: Structure) {
        this.ctx.moveTo(base.x + renderableObject.dockingPoints[0].point.x, base.y + renderableObject.dockingPoints[0].point.y);
        for (let dockingIndex = 1; dockingIndex < renderableObject.dockingPoints.length; dockingIndex++) {
            this.ctx.lineTo(base.x + renderableObject.dockingPoints[dockingIndex].point.x, base.y + renderableObject.dockingPoints[dockingIndex].point.y);
        }
    }
}