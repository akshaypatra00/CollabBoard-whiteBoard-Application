import { StrokeStyle, TextAlign } from './tool.js';
export interface Point {
    x: number;
    y: number;
    pressure?: number;
}
export interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
}
export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotation';
export interface BaseElement {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    strokeStyle: StrokeStyle;
    opacity: number;
    rotation: number;
    version: number;
    updatedAt: number;
    isDeleted?: boolean;
}
export interface RectangleElement extends BaseElement {
    type: 'rectangle';
    borderRadius?: number;
}
export interface EllipseElement extends BaseElement {
    type: 'ellipse';
}
export interface LineElement extends BaseElement {
    type: 'line';
    points: [Point, Point];
}
export interface ArrowElement extends BaseElement {
    type: 'arrow';
    points: [Point, Point];
}
export interface PencilElement extends BaseElement {
    type: 'pencil';
    points: Point[];
}
export interface TextElement extends BaseElement {
    type: 'text';
    text: string;
    fontSize: number;
    fontFamily: string;
    textAlign: TextAlign;
}
export type WhiteboardElement = RectangleElement | EllipseElement | LineElement | ArrowElement | PencilElement | TextElement;
export type ElementType = WhiteboardElement['type'];
//# sourceMappingURL=element.d.ts.map