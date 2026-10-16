import { BoundingBox, Point, WhiteboardElement } from '@whiteboard/shared';

export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const rotatePoint = (point: Point, center: Point, angleRad: number): Point => {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos),
  };
};

export const isPointNearLineSegment = (
  p: Point,
  a: Point,
  b: Point,
  threshold: number
): boolean => {
  const lineLen = distance(a, b);
  if (lineLen === 0) {
    return distance(p, a) <= threshold;
  }

  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (lineLen * lineLen))
  );

  const projection: Point = {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
  };

  return distance(p, projection) <= threshold;
};

export const getElementBounds = (element: WhiteboardElement): BoundingBox => {
  switch (element.type) {
    case 'rectangle':
    case 'ellipse':
    case 'text': {
      const minX = Math.min(element.x, element.x + element.width);
      const maxX = Math.max(element.x, element.x + element.width);
      const minY = Math.min(element.y, element.y + element.height);
      const maxY = Math.max(element.y, element.y + element.height);
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: Math.abs(maxX - minX),
        height: Math.abs(maxY - minY),
      };
    }
    case 'line':
    case 'arrow': {
      const p1 = element.points[0];
      const p2 = element.points[1];
      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: Math.max(1, maxX - minX),
        height: Math.max(1, maxY - minY),
      };
    }
    case 'pencil': {
      if (element.points.length === 0) {
        return {
          minX: element.x,
          minY: element.y,
          maxX: element.x + 1,
          maxY: element.y + 1,
          width: 1,
          height: 1,
        };
      }
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const p of element.points) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      return {
        minX,
        minY,
        maxX,
        maxY,
        width: Math.max(1, maxX - minX),
        height: Math.max(1, maxY - minY),
      };
    }
  }
};

export const getMultipleElementsBounds = (
  elements: WhiteboardElement[]
): BoundingBox | null => {
  if (elements.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const elem of elements) {
    const bounds = getElementBounds(elem);
    if (bounds.minX < minX) minX = bounds.minX;
    if (bounds.minY < minY) minY = bounds.minY;
    if (bounds.maxX > maxX) maxX = bounds.maxX;
    if (bounds.maxY > maxY) maxY = bounds.maxY;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const isPointInsideBounds = (point: Point, box: BoundingBox): boolean => {
  return (
    point.x >= box.minX &&
    point.x <= box.maxX &&
    point.y >= box.minY &&
    point.y <= box.maxY
  );
};

export const boxesIntersect = (b1: BoundingBox, b2: BoundingBox): boolean => {
  return (
    b1.minX <= b2.maxX &&
    b1.maxX >= b2.minX &&
    b1.minY <= b2.maxY &&
    b1.maxY >= b2.minY
  );
};
