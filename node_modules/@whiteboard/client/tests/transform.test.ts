import { describe, it, expect } from 'vitest';
import {
  screenToWorld,
  worldToScreen,
  calculateZoom,
  MIN_ZOOM,
  MAX_ZOOM,
} from '../src/canvas/transform.js';

describe('Coordinate and Viewport Transformations', () => {
  it('converts screen to world coordinates correctly with pan and zoom', () => {
    const viewport = { panX: 100, panY: 50, zoom: 2 };
    const screen = { x: 300, y: 250 };
    const world = screenToWorld(screen, viewport);

    expect(world.x).toBe(100);
    expect(world.y).toBe(100);
  });

  it('converts world to screen coordinates correctly', () => {
    const viewport = { panX: 100, panY: 50, zoom: 2 };
    const world = { x: 100, y: 100 };
    const screen = worldToScreen(world, viewport);

    expect(screen.x).toBe(300);
    expect(screen.y).toBe(250);
  });

  it('keeps world point invariant when zooming at pointer location', () => {
    const initialVp = { panX: 50, panY: 30, zoom: 1 };
    const pointerScreen = { x: 400, y: 300 };
    const worldBefore = screenToWorld(pointerScreen, initialVp);

    const newVp = calculateZoom(initialVp, 1.5, pointerScreen);
    const worldAfter = screenToWorld(pointerScreen, newVp);

    expect(Math.round(worldBefore.x)).toBe(Math.round(worldAfter.x));
    expect(Math.round(worldBefore.y)).toBe(Math.round(worldAfter.y));
  });

  it('clamps zoom within MIN_ZOOM and MAX_ZOOM bounds', () => {
    const viewport = { panX: 0, panY: 0, zoom: 1 };
    const pointer = { x: 100, y: 100 };

    const zoomedOut = calculateZoom(viewport, 0.001, pointer);
    expect(zoomedOut.zoom).toBe(MIN_ZOOM);

    const zoomedIn = calculateZoom(viewport, 50, pointer);
    expect(zoomedIn.zoom).toBe(MAX_ZOOM);
  });
});
