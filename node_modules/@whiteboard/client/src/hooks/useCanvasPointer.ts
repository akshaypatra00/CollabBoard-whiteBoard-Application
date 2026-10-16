import { useRef, useState, useEffect } from 'react';
import {
  BoundingBox,
  Point,
  ResizeHandle,
  WhiteboardElement,
} from '@whiteboard/shared';
import { useBoardStore } from '../store/useBoardStore.js';
import { useToolStore } from '../store/useToolStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';
import {
  calculateZoom,
  screenToWorld,
} from '../canvas/transform.js';
import { getElementAtPoint, getElementsByMarquee } from '../canvas/hitTest.js';
import { getHandleAtPoint, getCursorForHandle } from '../canvas/handles.js';
import {
  getElementBounds,
  getMultipleElementsBounds,
} from '../utils/geometry.js';
import { generateId } from '../utils/id.js';

type InteractionMode =
  | 'idle'
  | 'panning'
  | 'drawing'
  | 'dragging'
  | 'resizing'
  | 'marquee'
  | 'erasing';

interface UseCanvasPointerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onEmitCreate: (element: WhiteboardElement) => void;
  onEmitUpdate: (elements: WhiteboardElement[]) => void;
  onEmitDelete: (elementIds: string[]) => void;
  onEmitCursorMove: (x: number, y: number) => void;
  onOpenTextEditor?: (worldPoint: Point) => void;
}

export const useCanvasPointer = ({
  canvasRef,
  onEmitCreate,
  onEmitUpdate,
  onEmitDelete,
  onEmitCursorMove,
  onOpenTextEditor,
}: UseCanvasPointerProps) => {
  const {
    elements,
    selectedIds,
    viewport,
    setViewport,
    addElement,
    updateElements,
    deleteElements,
    selectElement,
    setSelectedIds,
    clearSelection,
  } = useBoardStore();

  const { activeTool, settings, setActiveTool } = useToolStore();
  const { pushSnapshot } = useHistoryStore();

  const [previewElement, setPreviewElement] =
    useState<WhiteboardElement | null>(null);
  const [marqueeBox, setMarqueeBox] = useState<BoundingBox | null>(null);
  const [eraserPoint, setEraserPoint] = useState<Point | null>(null);
  const [cursorStyle, setCursorStyle] = useState<string>('default');

  const modeRef = useRef<InteractionMode>('idle');
  const startScreenRef = useRef<Point>({ x: 0, y: 0 });
  const startWorldRef = useRef<Point>({ x: 0, y: 0 });
  const activeHandleRef = useRef<ResizeHandle | null>(null);
  const dragOffsetsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  );
  const initialElementsSnapshotRef = useRef<WhiteboardElement[]>([]);
  const isSpacePressedRef = useRef<boolean>(false);
  const lastCursorEmitRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        isSpacePressedRef.current = true;
        setCursorStyle('grab');
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
        setCursorStyle('default');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: e.clientX, y: e.clientY };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(e);
    const worldPoint = screenToWorld(screenPoint, viewport);

    startScreenRef.current = screenPoint;
    startWorldRef.current = worldPoint;

    if (e.button === 1 || isSpacePressedRef.current) {
      modeRef.current = 'panning';
      setCursorStyle('grabbing');
      return;
    }

    if (activeTool === 'select') {
      const selectedElements = elements.filter(
        (el) => selectedIds.includes(el.id) && !el.isDeleted
      );
      const selBounds = getMultipleElementsBounds(selectedElements);

      if (selBounds) {
        const handle = getHandleAtPoint(worldPoint, selBounds, viewport.zoom);
        if (handle) {
          modeRef.current = 'resizing';
          activeHandleRef.current = handle;
          initialElementsSnapshotRef.current = JSON.parse(
            JSON.stringify(elements)
          );
          return;
        }
      }

      const hitElement = getElementAtPoint(worldPoint, elements, viewport.zoom);
      if (hitElement) {
        initialElementsSnapshotRef.current = JSON.parse(
          JSON.stringify(elements)
        );
        const isMulti = e.shiftKey;
        if (!selectedIds.includes(hitElement.id) && !isMulti) {
          selectElement(hitElement.id, false);
        } else if (isMulti) {
          selectElement(hitElement.id, true);
        }

        modeRef.current = 'dragging';
        const currentSelected = isMulti
          ? [...selectedIds, hitElement.id]
          : selectedIds.includes(hitElement.id)
            ? selectedIds
            : [hitElement.id];

        const offsets = new Map<string, { x: number; y: number }>();
        for (const id of currentSelected) {
          const el = elements.find((item) => item.id === id);
          if (el) {
            offsets.set(id, { x: el.x - worldPoint.x, y: el.y - worldPoint.y });
          }
        }
        dragOffsetsRef.current = offsets;
        return;
      }

      clearSelection();
      modeRef.current = 'marquee';
      setMarqueeBox({
        minX: worldPoint.x,
        minY: worldPoint.y,
        maxX: worldPoint.x,
        maxY: worldPoint.y,
        width: 0,
        height: 0,
      });
      return;
    }

    if (activeTool === 'eraser') {
      modeRef.current = 'erasing';
      setEraserPoint(worldPoint);
      const hit = getElementAtPoint(worldPoint, elements, viewport.zoom);
      if (hit) {
        pushSnapshot(elements);
        deleteElements([hit.id]);
        onEmitDelete([hit.id]);
      }
      return;
    }

    if (activeTool === 'text') {
      if (onOpenTextEditor) {
        onOpenTextEditor(worldPoint);
      }
      return;
    }

    modeRef.current = 'drawing';
    const id = generateId();
    const base = {
      id,
      x: worldPoint.x,
      y: worldPoint.y,
      width: 0,
      height: 0,
      strokeColor: settings.strokeColor,
      fillColor: settings.fillColor,
      strokeWidth: settings.strokeWidth,
      strokeStyle: settings.strokeStyle,
      opacity: settings.opacity,
      rotation: 0,
      version: 1,
      updatedAt: Date.now(),
    };

    let newElem: WhiteboardElement | null = null;
    if (activeTool === 'rectangle') {
      newElem = { ...base, type: 'rectangle' };
    } else if (activeTool === 'ellipse') {
      newElem = { ...base, type: 'ellipse' };
    } else if (activeTool === 'line') {
      newElem = { ...base, type: 'line', points: [worldPoint, worldPoint] };
    } else if (activeTool === 'arrow') {
      newElem = { ...base, type: 'arrow', points: [worldPoint, worldPoint] };
    } else if (activeTool === 'pencil') {
      newElem = {
        ...base,
        type: 'pencil',
        points: [{ x: worldPoint.x, y: worldPoint.y, pressure: e.pressure || 0.5 }],
      };
    }

    if (newElem) {
      setPreviewElement(newElem);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(e);
    const worldPoint = screenToWorld(screenPoint, viewport);

    const now = Date.now();
    if (now - lastCursorEmitRef.current > 40) {
      lastCursorEmitRef.current = now;
      onEmitCursorMove(worldPoint.x, worldPoint.y);
    }

    if (modeRef.current === 'idle') {
      if (isSpacePressedRef.current) {
        setCursorStyle('grab');
      } else if (activeTool === 'select') {
        const selectedElements = elements.filter(
          (el) => selectedIds.includes(el.id) && !el.isDeleted
        );
        const selBounds = getMultipleElementsBounds(selectedElements);
        if (selBounds) {
          const handle = getHandleAtPoint(worldPoint, selBounds, viewport.zoom);
          if (handle) {
            setCursorStyle(getCursorForHandle(handle));
            return;
          }
        }
        const hit = getElementAtPoint(worldPoint, elements, viewport.zoom);
        setCursorStyle(hit ? 'move' : 'default');
      } else if (activeTool === 'eraser') {
        setCursorStyle('crosshair');
      } else {
        setCursorStyle('crosshair');
      }
      return;
    }

    if (modeRef.current === 'panning') {
      const dx = screenPoint.x - startScreenRef.current.x;
      const dy = screenPoint.y - startScreenRef.current.y;
      startScreenRef.current = screenPoint;
      setViewport({
        ...viewport,
        panX: viewport.panX + dx,
        panY: viewport.panY + dy,
      });
      return;
    }

    if (modeRef.current === 'dragging') {
      const updated: WhiteboardElement[] = [];
      for (const [id, offset] of dragOffsetsRef.current.entries()) {
        const el = elements.find((item) => item.id === id);
        if (!el) continue;

        const newX = worldPoint.x + offset.x;
        const newY = worldPoint.y + offset.y;
        const dx = newX - el.x;
        const dy = newY - el.y;

        const copy: WhiteboardElement = JSON.parse(JSON.stringify(el));
        copy.x = newX;
        copy.y = newY;
        copy.version = (copy.version || 1) + 1;
        copy.updatedAt = Date.now();

        if (copy.type === 'line' || copy.type === 'arrow') {
          copy.points = [
            { x: copy.points[0].x + dx, y: copy.points[0].y + dy },
            { x: copy.points[1].x + dx, y: copy.points[1].y + dy },
          ];
        } else if (copy.type === 'pencil') {
          copy.points = copy.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          }));
        }

        updated.push(copy);
      }

      if (updated.length > 0) {
        updateElements(updated);
      }
      return;
    }

    if (modeRef.current === 'resizing') {
      const handle = activeHandleRef.current;
      if (!handle) return;

      const selected = elements.filter((el) => selectedIds.includes(el.id));
      if (selected.length !== 1) return;

      const target = selected[0];
      const startW = startWorldRef.current;
      const dx = worldPoint.x - startW.x;
      const dy = worldPoint.y - startW.y;

      const copy: WhiteboardElement = JSON.parse(JSON.stringify(target));
      copy.version = (copy.version || 1) + 1;
      copy.updatedAt = Date.now();

      if (handle === 'se') {
        copy.width = Math.max(10, copy.width + dx);
        copy.height = Math.max(10, copy.height + dy);
      } else if (handle === 'e') {
        copy.width = Math.max(10, copy.width + dx);
      } else if (handle === 's') {
        copy.height = Math.max(10, copy.height + dy);
      } else if (handle === 'nw') {
        copy.x += dx;
        copy.y += dy;
        copy.width = Math.max(10, copy.width - dx);
        copy.height = Math.max(10, copy.height - dy);
      } else if (handle === 'ne') {
        copy.y += dy;
        copy.width = Math.max(10, copy.width + dx);
        copy.height = Math.max(10, copy.height - dy);
      } else if (handle === 'sw') {
        copy.x += dx;
        copy.width = Math.max(10, copy.width - dx);
        copy.height = Math.max(10, copy.height + dy);
      } else if (handle === 'w') {
        copy.x += dx;
        copy.width = Math.max(10, copy.width - dx);
      } else if (handle === 'n') {
        copy.y += dy;
        copy.height = Math.max(10, copy.height - dy);
      }

      startWorldRef.current = worldPoint;
      updateElements([copy]);
      return;
    }

    if (modeRef.current === 'marquee') {
      const start = startWorldRef.current;
      const minX = Math.min(start.x, worldPoint.x);
      const minY = Math.min(start.y, worldPoint.y);
      const maxX = Math.max(start.x, worldPoint.x);
      const maxY = Math.max(start.y, worldPoint.y);
      setMarqueeBox({
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
      });
      return;
    }

    if (modeRef.current === 'erasing') {
      setEraserPoint(worldPoint);
      const hit = getElementAtPoint(worldPoint, elements, viewport.zoom);
      if (hit) {
        deleteElements([hit.id]);
        onEmitDelete([hit.id]);
      }
      return;
    }

    if (modeRef.current === 'drawing' && previewElement) {
      const copy: WhiteboardElement = JSON.parse(
        JSON.stringify(previewElement)
      );
      const start = startWorldRef.current;

      if (copy.type === 'rectangle' || copy.type === 'ellipse') {
        copy.x = Math.min(start.x, worldPoint.x);
        copy.y = Math.min(start.y, worldPoint.y);
        copy.width = Math.abs(worldPoint.x - start.x);
        copy.height = Math.abs(worldPoint.y - start.y);
      } else if (copy.type === 'line' || copy.type === 'arrow') {
        copy.points[1] = worldPoint;
        copy.width = Math.abs(worldPoint.x - start.x);
        copy.height = Math.abs(worldPoint.y - start.y);
      } else if (copy.type === 'pencil') {
        copy.points.push({
          x: worldPoint.x,
          y: worldPoint.y,
          pressure: e.pressure || 0.5,
        });
        const bounds = getElementBounds(copy);
        copy.x = bounds.minX;
        copy.y = bounds.minY;
        copy.width = bounds.width;
        copy.height = bounds.height;
      }

      setPreviewElement(copy);
    }
  };

  const handlePointerUp = () => {
    if (modeRef.current === 'panning') {
      modeRef.current = 'idle';
      setCursorStyle(isSpacePressedRef.current ? 'grab' : 'default');
      return;
    }

    if (modeRef.current === 'dragging') {
      pushSnapshot(initialElementsSnapshotRef.current);
      const modified = elements.filter((el) =>
        dragOffsetsRef.current.has(el.id)
      );
      onEmitUpdate(modified);
      modeRef.current = 'idle';
      return;
    }

    if (modeRef.current === 'resizing') {
      pushSnapshot(initialElementsSnapshotRef.current);
      const modified = elements.filter((el) => selectedIds.includes(el.id));
      onEmitUpdate(modified);
      activeHandleRef.current = null;
      modeRef.current = 'idle';
      return;
    }

    if (modeRef.current === 'marquee' && marqueeBox) {
      const found = getElementsByMarquee(marqueeBox, elements);
      setSelectedIds(found.map((e) => e.id));
      setMarqueeBox(null);
      modeRef.current = 'idle';
      return;
    }

    if (modeRef.current === 'erasing') {
      setEraserPoint(null);
      modeRef.current = 'idle';
      return;
    }

    if (modeRef.current === 'drawing' && previewElement) {
      const finalElement = previewElement;
      setPreviewElement(null);
      modeRef.current = 'idle';

      const isValid =
        (finalElement.type === 'pencil' && finalElement.points.length > 0) ||
        (finalElement.type !== 'pencil' &&
          (finalElement.width > 2 || finalElement.height > 2));

      if (isValid) {
        pushSnapshot(elements);
        addElement(finalElement);
        onEmitCreate(finalElement);
        if (activeTool !== 'pencil') {
          setSelectedIds([finalElement.id]);
          setActiveTool('select');
        } else {
          clearSelection();
        }
      }
    }

    modeRef.current = 'idle';
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const screenPoint = getCanvasPoint(
      e as unknown as React.PointerEvent<HTMLCanvasElement>
    );

    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newVp = calculateZoom(viewport, zoomFactor, screenPoint);
      setViewport(newVp);
    } else {
      setViewport({
        ...viewport,
        panX: viewport.panX - e.deltaX,
        panY: viewport.panY - e.deltaY,
      });
    }
  };

  return {
    previewElement,
    marqueeBox,
    eraserPoint,
    cursorStyle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
};
