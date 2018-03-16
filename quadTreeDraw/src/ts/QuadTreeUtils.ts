import {Point2} from "ce-common";
import {Direction, QuadTree, QuadTreeNode} from "./QuadTree";
import {QuadTreeDrawConfig} from "./Config";

export class QuadTreeUtils {
    static getRandomQuadTree(){
        let quad = new QuadTree();
        let cfg = QuadTreeDrawConfig.getInstance();
        quad.root = QuadTreeUtils.getRandomQuadTreeNode(new Bounds(cfg.quadTreeCenter, cfg.quadTreeSideLength), Direction.SW);
        return quad;
    }

    static getRandomQuadTreeNode(bounds: Bounds, direction: Direction): QuadTreeNode{
        if(bounds.width < QuadTreeDrawConfig.getInstance().minSideLength) {
            return undefined;
        }
        let node = new QuadTreeNode();
        // TODO really new bounds?
        let nwBase = new Bounds(new Point2(bounds.base.x - bounds.width / 2, bounds.base.y - bounds.width / 2), bounds.width / 2);
        let neBase = new Bounds(new Point2(bounds.base.x + bounds.width / 2, bounds.base.y - bounds.width / 2), bounds.width / 2);
        let swBase = new Bounds(new Point2(bounds.base.x - bounds.width / 2, bounds.base.y + bounds.width / 2), bounds.width / 2);
        let seBase = new Bounds(new Point2(bounds.base.x + bounds.width / 2, bounds.base.y + bounds.width / 2), bounds.width / 2);
        node.SW = this.getRandomQuadTreeNode(swBase, Direction.SW);
        node.SE = this.getRandomQuadTreeNode(seBase, Direction.SE);
        node.NW = this.getRandomQuadTreeNode(nwBase, Direction.NW);
        node.NE = this.getRandomQuadTreeNode(neBase, Direction.NE);
        node.base = bounds.base;
        node.weLieIn = direction;
        node.side = bounds.width;
        return node;
    }
}

export class Bounds{
    private _base: Point2;
    private _width: number;


    constructor(base: Point2, width: number) {
        this._base = base;
        this._width = width;
    }


    get base(): Point2 {
        return this._base;
    }

    set base(value: Point2) {
        this._base = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }
}