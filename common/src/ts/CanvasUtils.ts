

import {Point2} from "./Point";
import {Color} from "./ColorUtils";
import * as $ from 'jquery';

export class CanvasUtils {
    private width: number;
    private height:number;
    private data: ImageData;


    constructor(width: number, height: number, data?: ImageData) {
        this.width = width;
        this.height = height;
        this.data = data;
    }

    getCoordinates(index:number) {
        return new Point2(index / 4 % this.width, Math.floor((index / 4 / this.width)))
    }

    getIndexForCoordinate(x:number, y:number):number {
        return (y * this.width + x) * 4;
    }

    downloadCanvas(name:string, vanvas_obj:HTMLCanvasElement, btnId:string){
        let downloadBtn = <HTMLAnchorElement>$(btnId)[0];
        downloadBtn.download = name + '_' + new Date().toISOString() + '.png';

        let imageData = vanvas_obj.toDataURL('image/png', 1);
        let blob = this.dataURLtoBlob(imageData);
        downloadBtn.href = URL.createObjectURL(blob);
    }

    // http://stackoverflow.com/questions/23150333/html5-javascript-dataurl-to-blob-blob-to-dataurl
    dataURLtoBlob = (dataurl:string) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    };

    static trackTransforms = function (ctx:MyCanvasRenderingContext2D) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        let xform:SVGMatrix = svg.createSVGMatrix();
        ctx.getTransform = function () {
            return xform;
        };

        let savedTransforms : Array<SVGMatrix>= [];
        let save = ctx.save;
        ctx.save = function () {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };
        let restore = ctx.restore;
        ctx.restore = function () {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        let scale = ctx.scale;
        ctx.scale = function (sx:number, sy:number) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };
        let rotate = ctx.rotate;
        ctx.rotate = function (radians:number) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };
        let translate = ctx.translate;
        ctx.translate = function (dx:number, dy:number) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };
        let transform = ctx.transform;
        ctx.transform = function (a:number, b:number, c:number, d:number, e:number, f:number) {
            let m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };
        let setTransform = ctx.setTransform;
        ctx.setTransform = function (a:number, b:number, c:number, d:number, e:number, f:number) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };
        let pt = svg.createSVGPoint();
        ctx.transformedPoint = function (x:number, y:number) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    };

    setCoordinateToColor(x:number, y:number, color:Color) {
        let indexForCoordinate:number = this.getIndexForCoordinate(x, y) << 0;
        this.data.data[indexForCoordinate] = color.r;
        this.data.data[indexForCoordinate + 1] = color.g;
        this.data.data[indexForCoordinate + 2] = color.b;
        this.data.data[indexForCoordinate + 3] = color.a * 255;
    };
}

export class MyCanvasRenderingContext2D extends CanvasRenderingContext2D {
    transformedPoint(x: number, y:number): SVGPoint{
        return undefined;
    }

    getTransform() :SVGMatrix{
        return undefined;
    }
}
