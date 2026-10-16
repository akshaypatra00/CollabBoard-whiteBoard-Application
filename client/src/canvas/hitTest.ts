import { BoundingBox, Point, WhiteboardElement } from '@whiteboard/shared';
import {
  distance,
  getElementBounds,
  isPointInsideBounds,
  isPointNearLineSegment,
  boxesIntersect,
  rotatePoint,
} from '../utils/geometry.js';

export const isPointOnElement = (
  rawPoint: Point,
  element: WhiteboardElement,
  zoom: number
): boolean => {
  const threshold = Math.max(element.strokeWidth / 2 + 4, 8) / zoom;
  const bounds = getElementBounds(element);
  const center = {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };

  const point =
    element.rotation !== 0
      ? rotatePoint(rawPoint, center, -element.rotation)
      : rawPoint;

  const hasFill = element.fillColor && element.fillColor !== 'transparent';

  switch (element.type) {
    case 'rectangle': {
      if (hasFill) {
        return (
          point.x >= bounds.minX - threshold &&
          point.x <= bounds.maxX + threshold &&
          point.y >= bounds.minY - threshold &&
          point.y <= bounds.maxY + threshold
        );
      }
      const onLeft =
        Math.abs(point.x - bounds.minX) <= threshold &&
        point.y >= bounds.minY - threshold &&
        point.y <= bounds.maxY + threshold;
      const onRight =
        Math.abs(point.x - bounds.maxX) <= threshold &&
        point.y >= bounds.minY - threshold &&
        point.y <= bounds.maxY + threshold;
      const onTop =
        Math.abs(point.y - bounds.minY) <= threshold &&
        point.x >= bounds.minX - threshold &&
        point.x <= bounds.maxX + threshold;
      const onBottom =
        Math.abs(point.y - bounds.maxY) <= threshold &&
        point.x >= bounds.minX - threshold &&
        point.x <= bounds.maxX + threshold;
      return onLeft || onRight || onTop || onBottom;
    }

    case 'ellipse': {
      const rx = bounds.width / 2;
      const ry = bounds.height / 2;
      if (rx <= 0 || ry <= 0) return false;

      const normX = (point.x - center.x) / rx;
      const normY = (point.y - center.y) / ry;
      const distFromCenter = normX * normX + normY * normY;

      if (hasFill) {
        return distFromCenter <= 1.1;
      }
      return distFromCenter >= 0.8 && distFromCenter <= 1.2;
    }

    case 'line':
    case 'arrow': {
      return isPointNearLineSegment(
        point,
        element.points[0],
        element.points[1],
        threshold
      );
    }

    case 'pencil': {
      if (element.points.length < 2) {
        return (
          element.points.length === 1 &&
          distance(point, element.points[0]) <= threshold
        );
      }
      for (let i = 0; i < element.points.length - 1; i++) {
        if (
          isPointNearLineSegment(
            point,
            element.points[i],
            element.points[i + 1],
            threshold
          )
        ) {
          return true;
        }
      }
      return false;
    }

    case 'text': {
      return isPointInsideBounds(point, bounds);
    }
  }
};

export const getElementAtPoint = (
  point: Point,
  elements: WhiteboardElement[],
  zoom: number
): WhiteboardElement | null => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const elem = elements[i];
    if (!elem.isDeleted && isPointOnElement(point, elem, zoom)) {
      return elem;
    }
  }
  return null;
};

export const getElementsByMarquee = (
  marquee: BoundingBox,
  elements: WhiteboardElement[]
): WhiteboardElement[] => {
  return elements.filter((elem) => {
    if (elem.isDeleted) return false;
    const elemBounds = getElementBounds(elem);
    return boxesIntersect(marquee, elemBounds);
  });
};
