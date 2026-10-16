import { BoundingBox, Point, ResizeHandle } from '@whiteboard/shared';
import { distance } from '../utils/geometry.js';

export const HANDLE_SIZE = 8;
export const ROTATION_HANDLE_OFFSET = 24;

export interface HandlePosition {
  handle: ResizeHandle;
  x: number;
  y: number;
}

export const getBoundingBoxHandles = (box: BoundingBox): HandlePosition[] => {
  const { minX, minY, maxX, maxY } = box;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return [
    { handle: 'nw', x: minX, y: minY },
    { handle: 'n', x: midX, y: minY },
    { handle: 'ne', x: maxX, y: minY },
    { handle: 'e', x: maxX, y: midY },
    { handle: 'se', x: maxX, y: maxY },
    { handle: 's', x: midX, y: maxY },
    { handle: 'sw', x: minX, y: maxY },
    { handle: 'w', x: minX, y: midY },
    { handle: 'rotation', x: midX, y: minY - ROTATION_HANDLE_OFFSET },
  ];
};

export const getHandleAtPoint = (
  point: Point,
  box: BoundingBox,
  zoom: number
): ResizeHandle | null => {
  const handles = getBoundingBoxHandles(box);
  const hitRadius = (HANDLE_SIZE * 1.5) / zoom;

  for (const h of handles) {
    if (distance(point, { x: h.x, y: h.y }) <= hitRadius) {
      return h.handle;
    }
  }

  return null;
};

export const getCursorForHandle = (handle: ResizeHandle): string => {
  switch (handle) {
    case 'nw':
    case 'se':
      return 'nwse-resize';
    case 'ne':
    case 'sw':
      return 'nesw-resize';
    case 'n':
    case 's':
      return 'ns-resize';
    case 'e':
    case 'w':
      return 'ew-resize';
    case 'rotation':
      return 'grab';
  }
};
