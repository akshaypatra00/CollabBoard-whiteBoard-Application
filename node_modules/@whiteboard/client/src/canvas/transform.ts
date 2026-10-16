import { Point } from '@whiteboard/shared';

export interface Viewport {
  panX: number;
  panY: number;
  zoom: number;
}

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5.0;

export const screenToWorld = (
  screenPoint: Point,
  viewport: Viewport
): Point => {
  return {
    x: (screenPoint.x - viewport.panX) / viewport.zoom,
    y: (screenPoint.y - viewport.panY) / viewport.zoom,
  };
};

export const worldToScreen = (
  worldPoint: Point,
  viewport: Viewport
): Point => {
  return {
    x: worldPoint.x * viewport.zoom + viewport.panX,
    y: worldPoint.y * viewport.zoom + viewport.panY,
  };
};

export const calculateZoom = (
  currentViewport: Viewport,
  zoomFactor: number,
  pointerScreen: Point
): Viewport => {
  const newZoom = Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, currentViewport.zoom * zoomFactor)
  );

  const newPanX =
    pointerScreen.x -
    (pointerScreen.x - currentViewport.panX) * (newZoom / currentViewport.zoom);
  const newPanY =
    pointerScreen.y -
    (pointerScreen.y - currentViewport.panY) * (newZoom / currentViewport.zoom);

  return {
    panX: newPanX,
    panY: newPanY,
    zoom: newZoom,
  };
};
