import { describe, it, expect } from 'vitest';
import {
  distance,
  rotatePoint,
  isPointNearLineSegment,
  getElementBounds,
  getMultipleElementsBounds,
  boxesIntersect,
} from '../src/utils/geometry.js';
import { RectangleElement, LineElement, PencilElement } from '@whiteboard/shared';

describe('Geometry Utilities', () => {
  it('calculates Euclidean distance correctly', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(distance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0);
  });

  it('rotates a point around a center point', () => {
    const center = { x: 0, y: 0 };
    const point = { x: 10, y: 0 };
    const rotated = rotatePoint(point, center, Math.PI / 2);
    expect(Math.round(rotated.x)).toBe(0);
    expect(Math.round(rotated.y)).toBe(10);
  });

  it('detects if point is near a line segment', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };

    expect(isPointNearLineSegment({ x: 50, y: 2 }, p1, p2, 5)).toBe(true);
    expect(isPointNearLineSegment({ x: 50, y: 10 }, p1, p2, 5)).toBe(false);
    expect(isPointNearLineSegment({ x: 105, y: 0 }, p1, p2, 4)).toBe(false);
  });

  it('calculates bounding box for rectangle', () => {
    const rect: RectangleElement = {
      id: 'rect-1',
      type: 'rectangle',
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      strokeColor: '#000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const bounds = getElementBounds(rect);
    expect(bounds).toEqual({
      minX: 10,
      minY: 20,
      maxX: 110,
      maxY: 70,
      width: 100,
      height: 50,
    });
  });

  it('calculates bounding box for negative width/height rectangle', () => {
    const rect: RectangleElement = {
      id: 'rect-2',
      type: 'rectangle',
      x: 100,
      y: 100,
      width: -40,
      height: -30,
      strokeColor: '#000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const bounds = getElementBounds(rect);
    expect(bounds).toEqual({
      minX: 60,
      minY: 70,
      maxX: 100,
      maxY: 100,
      width: 40,
      height: 30,
    });
  });

  it('calculates bounding box for line and pencil points', () => {
    const line: LineElement = {
      id: 'line-1',
      type: 'line',
      x: 0,
      y: 0,
      width: 50,
      height: 80,
      points: [
        { x: 10, y: 90 },
        { x: 60, y: 10 },
      ],
      strokeColor: '#000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const bounds = getElementBounds(line);
    expect(bounds.minX).toBe(10);
    expect(bounds.maxX).toBe(60);
    expect(bounds.minY).toBe(10);
    expect(bounds.maxY).toBe(90);

    const pencil: PencilElement = {
      id: 'pencil-1',
      type: 'pencil',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points: [
        { x: 15, y: 25 },
        { x: 5, y: 80 },
        { x: 100, y: 40 },
      ],
      strokeColor: '#000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const pencilBounds = getElementBounds(pencil);
    expect(pencilBounds.minX).toBe(5);
    expect(pencilBounds.maxX).toBe(100);
    expect(pencilBounds.minY).toBe(25);
    expect(pencilBounds.maxY).toBe(80);
  });

  it('calculates multiple elements bounding box and checks intersection', () => {
    const rect1: RectangleElement = {
      id: '1',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      strokeColor: '#000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const rect2: RectangleElement = {
      id: '2',
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      strokeColor: '#000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    const multi = getMultipleElementsBounds([rect1, rect2]);
    expect(multi).toEqual({
      minX: 0,
      minY: 0,
      maxX: 150,
      maxY: 150,
      width: 150,
      height: 150,
    });

    const b1 = getElementBounds(rect1);
    const b2 = getElementBounds(rect2);
    expect(boxesIntersect(b1, b2)).toBe(false);

    const bOverlap = { minX: 25, minY: 25, maxX: 75, maxY: 75, width: 50, height: 50 };
    expect(boxesIntersect(b1, bOverlap)).toBe(true);
  });
});
