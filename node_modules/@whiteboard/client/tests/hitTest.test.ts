import { describe, it, expect } from 'vitest';
import {
  isPointOnElement,
  getElementAtPoint,
  getElementsByMarquee,
} from '../src/canvas/hitTest.js';
import {
  RectangleElement,
  EllipseElement,
  LineElement,
  WhiteboardElement,
} from '@whiteboard/shared';

describe('Hit Testing Utilities', () => {
  const filledRect: RectangleElement = {
    id: 'rect-filled',
    type: 'rectangle',
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    strokeColor: '#000000',
    fillColor: '#ff0000',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 100,
    rotation: 0,
    version: 1,
    updatedAt: Date.now(),
  };

  const line: LineElement = {
    id: 'line-1',
    type: 'line',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ],
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 4,
    strokeStyle: 'solid',
    opacity: 100,
    rotation: 0,
    version: 1,
    updatedAt: Date.now(),
  };

  it('detects point inside filled rectangle', () => {
    expect(isPointOnElement({ x: 50, y: 50 }, filledRect, 1)).toBe(true);
    expect(isPointOnElement({ x: 5, y: 50 }, filledRect, 1)).toBe(true);
    expect(isPointOnElement({ x: 150, y: 150 }, filledRect, 1)).toBe(false);
  });

  it('detects point on line segment within tolerance', () => {
    expect(isPointOnElement({ x: 50, y: 50 }, line, 1)).toBe(true);
    expect(isPointOnElement({ x: 50, y: 53 }, line, 1)).toBe(true);
    expect(isPointOnElement({ x: 50, y: 70 }, line, 1)).toBe(false);
  });

  it('returns top-most element when elements overlap', () => {
    const ellipse: EllipseElement = {
      id: 'ellipse-top',
      type: 'ellipse',
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      strokeColor: '#000000',
      fillColor: '#00ff00',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const elements: WhiteboardElement[] = [filledRect, ellipse];
    const hit = getElementAtPoint({ x: 50, y: 50 }, elements, 1);
    expect(hit?.id).toBe('ellipse-top');
  });

  it('finds elements contained or intersecting marquee selection', () => {
    const elements: WhiteboardElement[] = [filledRect, line];
    const marquee = {
      minX: 0,
      minY: 0,
      maxX: 50,
      maxY: 50,
      width: 50,
      height: 50,
    };

    const found = getElementsByMarquee(marquee, elements);
    expect(found.length).toBe(2);
    expect(found.map((e) => e.id)).toContain('rect-filled');
    expect(found.map((e) => e.id)).toContain('line-1');
  });
});
