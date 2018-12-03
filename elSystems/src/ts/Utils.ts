export class Utils {
    static degToRad(deg: number){
        return deg * Math.PI / 180;
    }

    static randomElement(array: any){
        return array[(Math.random() * array.length << 0)];
    }

    static createRainbowColors(frequency: number, alpha=255){
        var colors = [];
        var most = 2 * Math.PI / frequency;
        for (var i = 0; i < most; ++i) {
            var red   = Math.sin(frequency * i + 0) * 127 + 128;
            var green = Math.sin(frequency * i + 2) * 127 + 128;
            var blue  = Math.sin(frequency * i + 4) * 127 + 128;
            var color = {r: red << 0, g: green << 0, b: blue << 0, a: alpha, styleRGB: ''};
            color.styleRGB = '#' + Utils.d2h(color.r) + Utils.d2h(color.g) + Utils.d2h(color.b);
            colors.push(color)
        }
        return colors;
    }

    static d2h(d: number) {
        return (d / 256 + 1 / 512).toString(16).substring(2, 4);
    }
}