import {Point2, Quad} from "ce-common";
import {Bounds} from "./QuadTreeUtils";
import {QuadTreeDrawConfig} from "./Config";

export class QuadTree {
    private _root: QuadTreeNode;


    constructor() {
        let config = QuadTreeDrawConfig.getInstance();
        this.root = new QuadTreeNode(new Bounds(config.quadTreeCenter, config.quadTreeSideLength));
    }

    get root(): QuadTreeNode {
        return this._root;
    }

    set root(value: QuadTreeNode) {
        this._root = value;
    }

    addSquare(rect: Quad): void {
        this.root.addSquare(rect);
    }
}

export class QuadTreeNode {
    private _base: Point2;
    private _NE: QuadTreeNode;
    private _SE: QuadTreeNode;
    private _NW: QuadTreeNode;
    private _SW: QuadTreeNode;
    private _side: number;

    constructor(bounds: Bounds = undefined) {
        this._base = bounds ? bounds.base : undefined;
        this._side = bounds ? bounds.width : undefined;
    }


    getResponsibleChild(point: Point2, add: boolean = false) {
        if (point.x > this.base.x) {
            if (point.y < this.base.y) {
                if (add && !this.NE) {
                    this.splitIntoDirection(Direction.NE)
                }
                return this.NE;
            } else {
                if (add && !this.SE) {
                    this.splitIntoDirection(Direction.SE)
                }
                return this.SE;
            }
        } else {
            if (point.y < this.base.y) {
                if (add && !this.NW) {
                    this.splitIntoDirection(Direction.NW)
                }
                return this.NW;
            } else {
                if (add && !this.SW) {
                    this.splitIntoDirection(Direction.SW)
                }
                return this.SW;
            }
        }
    }

    splitIntoDirection(direction: Direction) {
        switch (direction) {
            case Direction.NE:
                this.NE = new QuadTreeNode(this.getBounds(Direction.NE));
                break;
            case Direction.NW:
                this.NW = new QuadTreeNode(this.getBounds(Direction.NW));
                break;
            case Direction.SE:
                this.SE = new QuadTreeNode(this.getBounds(Direction.SE));
                break;
            case Direction.SW:
                this.SW = new QuadTreeNode(this.getBounds(Direction.SW));
                break;
        }
    }

    getBounds(direction: Direction) {
        switch (direction) {
            case Direction.NW:
                return new Bounds(new Point2(this.base.x - this.side / 2, this.base.y - this.side / 2), this._side / 2);
            case Direction.NE:
                return new Bounds(new Point2(this.base.x + this.side / 2, this.base.y - this.side / 2), this._side / 2);
            case Direction.SW:
                return new Bounds(new Point2(this.base.x - this.side / 2, this.base.y + this.side / 2), this._side / 2);
            case Direction.SE:
                return new Bounds(new Point2(this.base.x + this.side / 2, this.base.y + this.side / 2), this._side / 2);
        }
    }

    addSquare(toAdd: Quad) {
        let node = this.getResponsibleChild(toAdd.center, true);
        if (this.side > toAdd.side) {
            node.addSquare(toAdd);
        }
    }

    get base(): Point2 {
        return this._base;
    }

    set base(value: Point2) {
        this._base = value;
    }

    get NE(): QuadTreeNode {
        return this._NE;
    }

    set NE(value: QuadTreeNode) {
        this._NE = value;
    }

    get SE(): QuadTreeNode {
        return this._SE;
    }

    set SE(value: QuadTreeNode) {
        this._SE = value;
    }

    get NW(): QuadTreeNode {
        return this._NW;
    }

    set NW(value: QuadTreeNode) {
        this._NW = value;
    }

    get SW(): QuadTreeNode {
        return this._SW;
    }

    set SW(value: QuadTreeNode) {
        this._SW = value;
    }


    get side(): number {
        return this._side;
    }

    set side(value: number) {
        this._side = value;
    }
}

export enum Direction {
    NE, SE, NW, SW
}