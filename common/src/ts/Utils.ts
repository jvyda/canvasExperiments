import {Constants} from "./Constants";
import {Color} from "./ColorUtils";
import {Point2} from "./Point";

export class Utils {
    static formatInterval(date1:Date, date2:Date, message:string) {
        console.log(message + ((date2.getTime() - date1.getTime()) / 1000));
    }

    static initDropdownList(id:string, list:Array<any>){
        let select : HTMLSelectElement;
        let i, option;
        select = <HTMLSelectElement>document.getElementById(id);
        for (i = 0; i < list.length; i += 1) {
            option = document.createElement('option');
            option.value = i + '';
            option.text = list[i].text;
            select.add(option);
        }
    }

    static toRad =  (angle:number) => {
        return angle / 180 * Math.PI;
    };

    static toDeg =  (angle:number) => {
        return angle * 180 / Math.PI;
    };

    static getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent) {
        let rect = canvas.getBoundingClientRect();
        return new Point2(
            evt.clientX - rect.left,
            evt.clientY - rect.top
        );
    };

    static getMousePosJQ(canvas:HTMLCanvasElement, evt: JQuery.Event<any>) {
        let rect = canvas.getBoundingClientRect();
        return new Point2(
            evt.clientX - rect.left,
            evt.clientY - rect.top
        );
    };

    static auPerDayToMPerSecond(value:number) {
        return value / 24 / 3600 * Constants.AU;
    };
    
    static  eventIsKey(event:KeyboardEvent, code:number) {
        return event.keyCode == code || event.charCode == code || event.which == code;
    };

    // taken from here https://gist.github.com/binarymax/4071852
    static floodfill = function (x:number, y:number, fillcolor:Color, ctx:CanvasRenderingContext2D, width:number, height:number, tolerance:number) {
        let img = ctx.getImageData(0, 0, width, height);
        let data = img.data;
        let length = data.length;
        let Q = [];
        let currentIndex = (x + y * width) * 4;
        let rightColorBorder = currentIndex, leftColorBorder = currentIndex, currentRowRightBorder, currentRowLeftBorder,
            rowWidth = width * 4;
        let targetcolor = new Color(
            data[currentIndex],
            data[currentIndex + 1],
            data[currentIndex + 2],
            data[currentIndex + 3]
    );

        if (!Utils.pixelCompare(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
            return false;
        }
        Q.push(currentIndex);
        let used = new FastStorage();
        while (Q.length) {
            currentIndex = Q.pop();
            if (Utils.pixelCompareAndSet(currentIndex, targetcolor, fillcolor, data, length, tolerance)) {
                rightColorBorder = currentIndex;
                leftColorBorder = currentIndex;
                currentRowLeftBorder = ((currentIndex / rowWidth) << 0) * rowWidth - 4; //left bound
                currentRowRightBorder = currentRowLeftBorder + rowWidth + 4;//right bound
                while (currentRowLeftBorder < (leftColorBorder -= 4) && Utils.pixelCompareAndSet(leftColorBorder, targetcolor, fillcolor, data, length, tolerance)) ; //go left until edge hit
                while (currentRowRightBorder > (rightColorBorder += 4) && Utils.pixelCompareAndSet(rightColorBorder, targetcolor, fillcolor, data, length, tolerance)) ; //go right until edge hit
                for (let currentCell = leftColorBorder + 4; currentCell < (rightColorBorder - 4); currentCell += 4) {
                    //queue y-1
                    let lower = currentCell - rowWidth;
                    if (lower >= 0 && Utils.pixelCompare(lower, targetcolor, fillcolor, data, length, tolerance)) {
                        if (!(lower in used)) {
                            Q.push(lower);
                            used[lower] = 1;
                        }
                    }
                    //queue y+1
                    let upper = currentCell + rowWidth;
                    if (upper < length && Utils.pixelCompare(upper, targetcolor, fillcolor, data, length, tolerance)) {
                        if (!(upper in used)) {
                            Q.push(upper);
                            used[upper] = 1;
                        }
                    }
                }
            }
        }
        ctx.putImageData(img, 0, 0);
    };

    static pixelCompare(i:number, targetcolor:Color, fillcolor:Color, data:Uint8ClampedArray, length:number, tolerance:number) {
        if (i < 0 || i >= length) return false; //out of bounds
        if (data[i + 3] === 0) return true;  //surface is invisible

        //target is same as fill
        if (
            (targetcolor.a === fillcolor.a) &&
            (targetcolor.r === fillcolor.r) &&
            (targetcolor.g === fillcolor.g) &&
            (targetcolor.b === fillcolor.b)
        ) {
            return false;
        }


        //target matches surface
        if (
            (targetcolor.a === data[i + 3]) &&
            (targetcolor.r === data[i]) &&
            (targetcolor.g === data[i + 1]) &&
            (targetcolor.b === data[i + 2])
        ) {
            return true;
        }

        /*
        if (
            Math.abs(targetcolor.a - data[i + 3]) <= (255 - tolerance) &&
            Math.abs(targetcolor.r - data[i]) <= tolerance &&
            Math.abs(targetcolor.g - data[i + 1]) <= tolerance &&
            Math.abs(targetcolor.b - data[i + 2]) <= tolerance
        ) return true; //target to surface within tolerance
    */
        let currentColor = new Color(
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3]
    );
        let distance = targetcolor.colorDistanceWithAlpha(currentColor);
        if (distance < tolerance) {
            return true;
        }
        return false; //no match
    };

    static pixelCompareAndSet(i:number, targetcolor:Color, fillcolor:Color, data:Uint8ClampedArray, length:number, tolerance:number) {
        if (Utils.pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
            //fill the color
            data[i] = fillcolor.r;
            data[i + 1] = fillcolor.g;
            data[i + 2] = fillcolor.b;
            data[i + 3] = fillcolor.a;
            return true;
        }
        return false;
    };
}

export class FastStorage {
    [key: number]: number;
}