import {
    ComputedTesellation, CircleWithSegments, PointOnStructure, TesselationLayout,
    LineWithSegments, ProgressionDirection, ComputedLine, DirectionConfiguration
} from "./PossibleObjects";
import {TesselationRenderer} from "./TesselationRenderer";
import * as $ from "jquery";
import {TesselationConfig} from "./TesselationConfig";
import {Line, Point2, GeometryUtils, RandomUtil, Utils, Vector2} from "ce-common";

export class EntryPoint {
    execute() {
        let config = new TesselationConfig();
        let possibleTesselation = this.getPossibleObject(config);
        let obj = this.generateActualObject(possibleTesselation, config);
        let canvas: HTMLCanvasElement = <HTMLCanvasElement> $('#canvas')[0];
        canvas.width = config.dimensions.width;
        canvas.height = config.dimensions.height;
        let renderer = new TesselationRenderer(<CanvasRenderingContext2D>canvas.getContext("2d"));
        let centerX = ((config.tilesX / 2) << 0) + 1;
        let centerY = ((config.tilesY / 2) << 0) + 1;

        if (Math.random() < config.mirrorChance) {
            let centerOffset = config.tileSize;
            renderer.renderConfig(possibleTesselation, new Point2(centerX * config.tileSize - centerOffset, centerY * config.tileSize - centerOffset));

            // bottom right
            renderer.translate(new Point2(centerX * config.tileSize - centerOffset, centerY * config.tileSize - centerOffset));
            centerOffset = 0;
            let halfTilesX = centerX + 1;
            let halfTilesY = centerY + 1;
            for (let x = 0; x < halfTilesX; x++) {
                for (let y = 0; y < halfTilesY; y++) {
                    renderer.render(obj, new Point2(x * config.tileSize - centerOffset, y * config.tileSize - centerOffset));
                }
            }
            // bottom left
            renderer.rotate(Utils.toRad(90));
            for (let x = 0; x < halfTilesY; x++) {
                for (let y = 0; y < halfTilesX; y++) {
                    renderer.render(obj, new Point2(x * config.tileSize - centerOffset, y * config.tileSize - centerOffset));
                }
            }

            // top left
            renderer.rotate(Utils.toRad(90));
            for (let x = 0; x < halfTilesX; x++) {
                for (let y = 0; y < halfTilesY; y++) {
                    renderer.render(obj, new Point2(x * config.tileSize - centerOffset, y * config.tileSize - centerOffset));
                }
            }

            // top right
            renderer.rotate(Utils.toRad(90));
            for (let x = 0; x < halfTilesY; x++) {
                for (let y = 0; y < halfTilesX; y++) {
                    renderer.render(obj, new Point2(x * config.tileSize - centerOffset, y * config.tileSize - centerOffset));
                }
            }
        } else {

            let centerOffset = config.tileSize;
            renderer.renderConfig(possibleTesselation, new Point2(centerX * config.tileSize - centerOffset, centerY * config.tileSize - centerOffset));
            // because the shift to actually center it (not only the upper left corner), we need to add one to the tile amount
            for (let x = 0; x < config.tilesX + 1; x++) {
                for (let y = 0; y < config.tilesY + 1; y++) {
                    renderer.render(obj, new Point2(x * config.tileSize - centerOffset, y * config.tileSize - centerOffset));
                }
            }
        }

    }

    getPossibleObject(config: TesselationConfig): TesselationLayout {
        let obj = new TesselationLayout();
        let center = new Point2(config.tileSize / 2, config.tileSize / 2);

        let topLeft = new Point2(center.x - config.tileSize / 2, center.y - config.tileSize / 2);
        let bottomLeft = new Point2(center.x - config.tileSize / 2, center.y + config.tileSize / 2);
        let topRight = new Point2(center.x + config.tileSize / 2, center.y - config.tileSize / 2);
        let bottomRight = new Point2(center.x + config.tileSize / 2, center.y + config.tileSize / 2);
        let topCenter = new Point2(center.x, center.y - config.tileSize / 2);
        let bottomCenter = new Point2(center.x, center.y + config.tileSize / 2);
        let leftCenter = new Point2(center.x - config.tileSize / 2, center.y);
        let rightCenter = new Point2(center.x + config.tileSize / 2, center.y);

        let vLeftStart = new Point2(topLeft.x + config.tileSize * 0.1, topLeft.y);
        let vRightStart = new Point2(topRight.x - config.tileSize * 0.1, topRight.y);
        let vLeftRotatedStart = new Point2(topRight.x, topRight.y + config.tileSize * 0.1);
        let vRightRotatedStart = new Point2(bottomRight.x, bottomRight.y - config.tileSize * 0.1);
        let vLeftInvertedStart = new Point2(bottomLeft.x + config.tileSize * 0.1, bottomLeft.y);
        let vRightInvertedStart = new Point2(bottomRight.x - config.tileSize * 0.1, bottomRight.y);
        let vLeftRotatedInvertedStart = new Point2(topLeft.x, topLeft.y + config.tileSize * 0.1);
        let vRightRotatedInvertedStart = new Point2(bottomLeft.x, bottomLeft.y - config.tileSize * 0.1);


        let topToBottomRightStart = new Point2(topRight.x - config.tileSize * 0.25, topRight.y);
        let topToBottomRightEnd = new Point2(bottomRight.x - config.tileSize * 0.25, bottomRight.y);
        let topToBottomLeftStart = new Point2(topLeft.x + config.tileSize * 0.25, topLeft.y);
        let topToBottomLeftEnd = new Point2(bottomLeft.x + config.tileSize * 0.25, bottomLeft.y);
        let leftToRightTopStart = new Point2(topLeft.x, topLeft.y + config.tileSize * 0.25);
        let leftToRightTopEnd = new Point2(topRight.x, topRight.y + config.tileSize * 0.25);
        let leftToRightBottomStart = new Point2(bottomLeft.x, bottomLeft.y - config.tileSize * 0.25);
        let leftToRightBottomEnd = new Point2(bottomRight.x, bottomRight.y - config.tileSize * 0.25);


        let normalVLeftTopToBottomRightTopIntersection = this.getIntersection(vLeftStart, bottomCenter, topLeft, bottomRight);
        let normalVRightTopToBottomLeftTopIntersection = this.getIntersection(vRightStart, bottomCenter, topRight, bottomLeft);
        let rotatedVRightTopLeftToBottomRightBottomIntersection = this.getIntersection(vRightRotatedStart, leftCenter, topLeft, bottomRight);
        let invertedVLeftTopRightToBottomLeftBottomIntersection = this.getIntersection(vLeftInvertedStart, topCenter, topRight, bottomLeft);

        let leftTopToBottomLeftRightTopIntersection = this.getIntersection(topToBottomLeftStart, topToBottomLeftEnd, leftToRightTopStart, leftToRightTopEnd);
        let rightTopToBottomLeftRightTopIntersection = this.getIntersection(topToBottomRightStart, topToBottomRightEnd, leftToRightTopStart, leftToRightTopEnd);
        let leftTopToBottomLeftRightBottomIntersection = this.getIntersection(topToBottomLeftStart, topToBottomLeftEnd, leftToRightBottomStart, leftToRightBottomEnd);
        let rightTopToBottomLeftRightBottomIntersection = this.getIntersection(topToBottomRightStart, topToBottomRightEnd, leftToRightBottomStart, leftToRightBottomEnd);

        let leftTopToBottomTopIntersectionLineIntersection = this.getIntersection(topToBottomLeftStart, topToBottomLeftEnd, normalVLeftTopToBottomRightTopIntersection, normalVRightTopToBottomLeftTopIntersection);
        let leftTopToBottomBottomIntersectionLineIntersection = this.getIntersection(topToBottomLeftStart, topToBottomLeftEnd, invertedVLeftTopRightToBottomLeftBottomIntersection, rotatedVRightTopLeftToBottomRightBottomIntersection);
        let rightTopToBottomTopIntersectionLineIntersection = this.getIntersection(topToBottomRightStart, topToBottomRightEnd, normalVLeftTopToBottomRightTopIntersection, normalVRightTopToBottomLeftTopIntersection);
        let rightTopToBottomBottomIntersectionLineIntersection = this.getIntersection(topToBottomRightStart, topToBottomRightEnd, invertedVLeftTopRightToBottomLeftBottomIntersection, rotatedVRightTopLeftToBottomRightBottomIntersection);

        let normalVLeftTopToBottomTopIntersection = this.getIntersection(vLeftStart, bottomCenter, topToBottomLeftStart, topToBottomLeftEnd);
        let normalVRightToptoBottomTopIntersection = this.getIntersection(vRightStart, bottomCenter, topToBottomRightStart, topToBottomRightEnd);
        let invertedVLeftTopToBottomBottomIntersection = this.getIntersection(vLeftInvertedStart, topCenter, topToBottomLeftStart, topToBottomLeftEnd);
        let invertedVRightTopToBottomBottomIntersection = this.getIntersection(vRightInvertedStart, topCenter, topToBottomRightStart, topToBottomRightEnd);


        let radius = config.tileSize / 2;
        // circle
        let circle: CircleWithSegments = new CircleWithSegments(center, radius);
        let circleSegments = 4;
        for (let arc = 0; arc < 2 * Math.PI; arc += 2 * Math.PI / circleSegments) {
            let newPoint = GeometryUtils.getPointInAngle(arc, center, radius);
            circle.addDockingPoint(newPoint);
        }
        obj.structures.push(circle);

        let topCenterToRightCenter = new LineWithSegments(topCenter, rightCenter);
        topCenterToRightCenter.addDockingPoint(rightTopToBottomTopIntersectionLineIntersection);
        obj.structures.push(topCenterToRightCenter);

        let rightCenterToBottomCenter = new LineWithSegments(rightCenter, bottomCenter);
        rightCenterToBottomCenter.addDockingPoint(rightTopToBottomBottomIntersectionLineIntersection);
        obj.structures.push(rightCenterToBottomCenter);

        let bottomCenterToLeftCenter = new LineWithSegments(bottomCenter, leftCenter);
        bottomCenterToLeftCenter.addDockingPoint(leftTopToBottomBottomIntersectionLineIntersection);
        obj.structures.push(bottomCenterToLeftCenter);

        let leftCenterToTopCenter = new LineWithSegments(leftCenter, topCenter);
        leftCenterToTopCenter.addDockingPoint(leftTopToBottomTopIntersectionLineIntersection);
        obj.structures.push(leftCenterToTopCenter);

        let topLeftToBottomRight = new LineWithSegments(topLeft, bottomRight);
        topLeftToBottomRight.addDockingPoint(normalVLeftTopToBottomRightTopIntersection);
        topLeftToBottomRight.addDockingPoint(leftTopToBottomLeftRightTopIntersection);
        topLeftToBottomRight.addDockingPoint(center);
        topLeftToBottomRight.addDockingPoint(rightTopToBottomLeftRightBottomIntersection);
        topLeftToBottomRight.addDockingPoint(rotatedVRightTopLeftToBottomRightBottomIntersection);
        obj.structures.push(topLeftToBottomRight);

        let topRightToBottomLeft = new LineWithSegments(topRight, bottomLeft);
        topRightToBottomLeft.addDockingPoint(normalVRightTopToBottomLeftTopIntersection);
        topRightToBottomLeft.addDockingPoint(rightTopToBottomLeftRightTopIntersection);
        topRightToBottomLeft.addDockingPoint(center);
        topRightToBottomLeft.addDockingPoint(leftTopToBottomLeftRightBottomIntersection);
        topRightToBottomLeft.addDockingPoint(invertedVLeftTopRightToBottomLeftBottomIntersection);
        obj.structures.push(topRightToBottomLeft);

        let horizontal = new LineWithSegments(leftCenter, rightCenter);
        horizontal.addDockingPoint(center);
        obj.structures.push(horizontal);

        let vertical = new LineWithSegments(topCenter, bottomCenter);
        vertical.addDockingPoint(center);
        obj.structures.push(vertical);

        let vLeft = new LineWithSegments(vLeftStart, bottomCenter);
        vLeft.addDockingPoint(normalVLeftTopToBottomRightTopIntersection);
        vLeft.addDockingPoint(normalVLeftTopToBottomTopIntersection);
        obj.structures.push(vLeft);

        let vRight = new LineWithSegments(vRightStart, bottomCenter);
        vRight.addDockingPoint(normalVRightTopToBottomLeftTopIntersection);
        vRight.addDockingPoint(normalVRightToptoBottomTopIntersection);
        obj.structures.push(vRight);

        let vLeftRotated = new LineWithSegments(vLeftRotatedStart, leftCenter);
        vLeftRotated.addDockingPoint(normalVRightTopToBottomLeftTopIntersection);
        obj.structures.push(vLeftRotated);

        let vRightRotated = new LineWithSegments(vRightRotatedStart, leftCenter);
        vRightRotated.addDockingPoint(rotatedVRightTopLeftToBottomRightBottomIntersection);
        obj.structures.push(vRightRotated);

        let vLeftInverted = new LineWithSegments(vLeftInvertedStart, topCenter);
        vLeftInverted.addDockingPoint(invertedVLeftTopRightToBottomLeftBottomIntersection);
        vLeftInverted.addDockingPoint(invertedVLeftTopToBottomBottomIntersection);
        obj.structures.push(vLeftInverted);

        let vRightInverted = new LineWithSegments(vRightInvertedStart, topCenter);
        vRightInverted.addDockingPoint(rotatedVRightTopLeftToBottomRightBottomIntersection);
        vRightInverted.addDockingPoint(invertedVRightTopToBottomBottomIntersection);
        obj.structures.push(vRightInverted);

        let vLeftRotatedInverted = new LineWithSegments(vLeftRotatedInvertedStart, rightCenter);
        vLeftRotatedInverted.addDockingPoint(normalVLeftTopToBottomRightTopIntersection);
        obj.structures.push(vLeftRotatedInverted);

        let vRightRotatedInverted = new LineWithSegments(vRightRotatedInvertedStart, rightCenter);
        vRightRotatedInverted.addDockingPoint(invertedVLeftTopRightToBottomLeftBottomIntersection);
        obj.structures.push(vRightRotatedInverted);

        let topInterSectionLine = new LineWithSegments(normalVLeftTopToBottomRightTopIntersection, normalVRightTopToBottomLeftTopIntersection);
        topInterSectionLine.addDockingPoint(leftTopToBottomTopIntersectionLineIntersection);
        topInterSectionLine.addDockingPoint(rightTopToBottomTopIntersectionLineIntersection);
        obj.structures.push(topInterSectionLine);

        let bottomIntersectionLine = new LineWithSegments(invertedVLeftTopRightToBottomLeftBottomIntersection, rotatedVRightTopLeftToBottomRightBottomIntersection);
        bottomIntersectionLine.addDockingPoint(leftTopToBottomBottomIntersectionLineIntersection);
        bottomIntersectionLine.addDockingPoint(rightTopToBottomBottomIntersectionLineIntersection);
        obj.structures.push(bottomIntersectionLine);

        let leftIntersectionLine = new LineWithSegments(normalVLeftTopToBottomRightTopIntersection, invertedVLeftTopRightToBottomLeftBottomIntersection);

        obj.structures.push(leftIntersectionLine);

        let rightIntersectionLine = new LineWithSegments(normalVRightTopToBottomLeftTopIntersection, rotatedVRightTopLeftToBottomRightBottomIntersection);
        obj.structures.push(rightIntersectionLine);

        let topToBottomLeft = new LineWithSegments(topToBottomLeftStart, topToBottomLeftEnd);
        topToBottomLeft.addDockingPoint(normalVLeftTopToBottomTopIntersection);
        topToBottomLeft.addDockingPoint(invertedVLeftTopToBottomBottomIntersection);
        topToBottomLeft.addDockingPoint(leftTopToBottomTopIntersectionLineIntersection);
        topToBottomLeft.addDockingPoint(leftTopToBottomBottomIntersectionLineIntersection);
        obj.structures.push(topToBottomLeft);

        let topToBottomRight = new LineWithSegments(topToBottomRightStart, topToBottomRightEnd);
        topToBottomRight.addDockingPoint(normalVRightToptoBottomTopIntersection);
        topToBottomRight.addDockingPoint(invertedVRightTopToBottomBottomIntersection);
        topToBottomRight.addDockingPoint(rightTopToBottomBottomIntersectionLineIntersection);
        topToBottomRight.addDockingPoint(rightTopToBottomTopIntersectionLineIntersection);
        obj.structures.push(topToBottomRight);

        let leftToRightTop = new LineWithSegments(leftToRightTopStart, leftToRightTopEnd);
        leftToRightTop.addDockingPoint(leftTopToBottomLeftRightTopIntersection);
        leftToRightTop.addDockingPoint(rightTopToBottomLeftRightTopIntersection);
        obj.structures.push(leftToRightTop);

        let leftToRightBottom = new LineWithSegments(leftToRightBottomStart, leftToRightBottomEnd);
        leftToRightBottom.addDockingPoint(leftTopToBottomLeftRightBottomIntersection);
        leftToRightBottom.addDockingPoint(rightTopToBottomLeftRightBottomIntersection);
        obj.structures.push(leftToRightBottom);


        return obj;
    }

    getIntersection(pointA: Point2, pointB: Point2, pointC: Point2, pointD: Point2): Point2 {
        let s1_x, s1_y, s2_x, s2_y;
        s1_x = pointB.x - pointA.x;
        s1_y = pointB.y - pointA.y;
        s2_x = pointD.x - pointC.x;
        s2_y = pointD.y - pointC.y;

        let s, t;
        s = (-s1_y * (pointA.x - pointC.x) + s1_x * (pointA.y - pointC.y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (pointA.y - pointC.y) - s2_y * (pointA.x - pointC.x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            let i_x = pointA.x + (t * s1_x);
            let i_y = pointA.y + (t * s1_y);
            return new Point2(i_x, i_y);
        }

        return undefined;
    }

    generateActualObject(basedOf: TesselationLayout, config: TesselationConfig): ComputedTesellation {
        let obj = new ComputedTesellation();
        let dirs = [ProgressionDirection.DOWN, ProgressionDirection.LEFT, ProgressionDirection.RIGHT, ProgressionDirection.UP, ProgressionDirection.QUARTER];
        // because quarter does not harmony with the oder directions (imo), we determine it once, and overrule the individual random decision
        let useQuarter = Math.random() < config.specialQuarterChance;
        for (let line = 0; line < config.lineAmount; line++) {
            let directionEnum = RandomUtil.randomElement(dirs);
            if(useQuarter){
                directionEnum = ProgressionDirection.QUARTER;
            }
            let chosenDirection = this.directonConfig.find((mapper) => mapper.dir == directionEnum);
            obj.computedLines.push(this.getComputedLine(chosenDirection.getStatPoint(config), basedOf, config, chosenDirection));
        }
        return obj;
    }

    private directonConfig: Array<DirectionConfiguration> = [
        new DirectionConfiguration(ProgressionDirection.LEFT, (pointA: Point2, pointB: Point2) => {
                return pointA.x > pointB.x
            },
            (pointA: Point2, cfg: TesselationConfig) => {
                return new Point2(pointA.x - cfg.tileSize, pointA.y)
            },
            (cfg: TesselationConfig) => {
                return new Point2(cfg.tileSize, cfg.tileSize / 2)
            }),
        new DirectionConfiguration(ProgressionDirection.DOWN, (pointA: Point2, pointB: Point2) => {
                return pointA.y < pointB.y
            },
            (pointA: Point2, cfg: TesselationConfig) => {
                return new Point2(pointA.x, pointA.y + cfg.tileSize)
            },
            (cfg: TesselationConfig) => {
                return new Point2(cfg.tileSize / 2, 0)
            }),
        new DirectionConfiguration(ProgressionDirection.RIGHT, (pointA: Point2, pointB: Point2) => {
                return pointA.x < pointB.x
            },
            (pointA: Point2, cfg: TesselationConfig) => {
                return new Point2(pointA.x + cfg.tileSize, pointA.y)
            },
            (cfg: TesselationConfig) => {
                return new Point2(0, cfg.tileSize / 2)
            }),
        new DirectionConfiguration(ProgressionDirection.UP, (pointA: Point2, pointB: Point2) => {
                return pointA.y > pointB.y
            },
            (pointA: Point2, cfg: TesselationConfig) => {
                return new Point2(pointA.x, pointA.y - cfg.tileSize)
            },
            (cfg: TesselationConfig) => {
                return new Point2(cfg.tileSize / 2, cfg.tileSize)
            }),
        new DirectionConfiguration(ProgressionDirection.QUARTER, (pointA: Point2, pointB: Point2, cfg: TesselationConfig) => {
                return pointB.x > cfg.tileSize / 2 && pointB.y < cfg.tileSize / 2 && pointA.x >= pointB.x;
            },
            (pointA: Point2, cfg: TesselationConfig) => {
                return new Point2(cfg.tileSize / 2 , cfg.tileSize * 0.25)
            },
            (cfg: TesselationConfig) => {
                return new Point2(cfg.tileSize, cfg.tileSize * 0.25)
            })
    ];

    private getComputedLine(startPoint: Point2, basedOf: TesselationLayout, config: TesselationConfig, dir: DirectionConfiguration): ComputedLine {
        let counter = 0;
        let currentPoint = startPoint;
        let newComputedLine: ComputedLine = new ComputedLine();

        do {
            let nextPoint = basedOf.getNextPoint(currentPoint, config.maxJumpDistance, dir, config);
            // TODO think about refactoring, I dont like this exist condition here
            if (!nextPoint) {
                break;
            }
            newComputedLine.lines.push(new Line(currentPoint, nextPoint));
            counter++;
            currentPoint = nextPoint;
        } while (counter < config.jumpAmount);
        newComputedLine.lines.push(new Line(currentPoint, dir.getPointInConnectingPosition(startPoint, config)));

        if(dir.dir == ProgressionDirection.QUARTER){
            // quarter creates the elements in the top right corner
            let copiedLines: Array<Line> = [];
            let center = new Point2(config.tileSize/2, config.tileSize/2);
            newComputedLine.lines.forEach((existingLine) => {
                copiedLines.push(new Line(GeometryUtils.getPointRotatedAroundPointByAngle(existingLine.start, center, Utils.toRad(270)), GeometryUtils.getPointRotatedAroundPointByAngle(existingLine.end, center, Utils.toRad(270))))
            });
            newComputedLine.lines.forEach((existingLine) => {
                copiedLines.push(new Line(GeometryUtils.getPointRotatedAroundPointByAngle(existingLine.start, center, Utils.toRad(180)), GeometryUtils.getPointRotatedAroundPointByAngle(existingLine.end, center, Utils.toRad(180))))
            });
            newComputedLine.lines.forEach((existingLine) => {
                copiedLines.push(new Line(GeometryUtils.getPointRotatedAroundPointByAngle(existingLine.start, center, Utils.toRad(90)), GeometryUtils.getPointRotatedAroundPointByAngle(existingLine.end, center, Utils.toRad(90))))
            });
            newComputedLine.lines.push.apply(newComputedLine.lines, copiedLines);
        }

        // TODO this needs some fixing, which point is needed?
        //newComputedLine.lines[newComputedLine.lines.length - 1].end = directionConfig.getPointInConnectingPosition();

        return newComputedLine;
    }
}