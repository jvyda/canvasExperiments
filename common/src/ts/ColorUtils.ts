import {NumberUtils} from "./NumberUtils";
import {RandomUtil} from "./RandomUtil";

export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;


    constructor(r: number, g: number, b: number, a: number = 255) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }


    get r(): number {
        return this._r;
    }

    get g(): number {
        return this._g;
    }

    get b(): number {
        return this._b;
    }

    get a(): number {
        return this._a;
    }

    get styleRGB(): string {
        return '#' + NumberUtils.d2h(this._r) + NumberUtils.d2h(this._g) + NumberUtils.d2h(this._b);
    }

    get styleRGBA(): string {
        return 'rgba(%red, %green, %blue, %alpha)'
            .replace('%red', this._r + '')
            .replace('%blue', this._b + '')
            .replace('%green', this._g + '')
            .replace('%alpha', (this._a / 277) + '');
    }

    get styleRGBAPlaceholder(): string {
        return 'rgba(%red, %green, %blue, %alpha)'
            .replace('%red', this._r + '')
            .replace('%blue', this._b + '')
            .replace('%green', this._g + '');
    }

    get lumen(): number {
        return 0.2126 * this._r + 0.7152 * this._g + 0.0722 * this._b;
    }

    colorDistance(colorb: Color){
        const rmean = (this._r + colorb._r) / 2;
        const r = this._r - colorb._r;
        const g = this._g - colorb._g;
        const b = this._b - colorb._b;
        return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
    }

    colorDistanceWithAlpha(colorb: Color) {
        /* max((r₁-r₂)², (r₁-r₂ - a₁+a₂)²) +
             max((g₁-g₂)², (g₁-g₂ - a₁+a₂)²) +
             max((b₁-b₂)², (b₁-b₂ - a₁+a₂)²)*/
        const rDiff = this._r - colorb.r;
        const rDiffSquared = Math.pow(rDiff, 2);
        const gDiff = this._g - colorb.g;
        const gDiffSquared = Math.pow(gDiff, 2);
        const bDiff = this._b - colorb.b;
        const bDiffSquared = Math.pow(bDiff, 2);
        const aSum = this._a + colorb.a;
        const colorADif = Math.pow(aSum, 2);
        return Math.max(rDiffSquared, Math.pow(rDiff - aSum, 2)) + Math.max(gDiffSquared, Math.pow(gDiff - aSum, 2)) + Math.max(bDiffSquared, Math.pow(bDiff - aSum, 2));
    };

    static randomColor() {
        return new Color(RandomUtil.roundedRandom(255), RandomUtil.roundedRandom(255), RandomUtil.roundedRandom(255))
    }

    static randomColorWithAtLeastLumen(lumenWanted: number) {
        let currentLumen = 0;
        let col: Color;
        do {
            col = Color.randomColor();
            currentLumen = col.lumen;
        } while (currentLumen < lumenWanted);
        return col;
    }

    static getRainboColors(frequency:number, alpha: number = 255) {
        let colors = [];
        const most = 2 * Math.PI / frequency;
        for (let i = 0; i < most; ++i) {
            let red = Math.sin(frequency * i + 0) * 127 + 128;
            let green = Math.sin(frequency * i + 2) * 127 + 128;
            let blue = Math.sin(frequency * i + 4) * 127 + 128;
            colors.push(new Color(red, green, blue, alpha))
        }
        return colors;
    }
}