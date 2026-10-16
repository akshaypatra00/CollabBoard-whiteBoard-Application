import {
  BoundingBox,
  Point,
  RemoteCursor,
  StrokeStyle,
  WhiteboardElement,
} from '@whiteboard/shared';
import { Viewport } from './transform.js';
import { getBoundingBoxHandles, HANDLE_SIZE } from './handles.js';
import { getMultipleElementsBounds } from '../utils/geometry.js';

interface RenderOptions {
  ctx: CanvasRenderingContext2D;
  dpr: number;
  viewport: Viewport;
  elements: WhiteboardElement[];
  selectedIds: string[];
  previewElement: WhiteboardElement | null;
  marqueeBox: BoundingBox | null;
  eraserPoint: Point | null;
  remoteCursors: RemoteCursor[];
  isDarkTheme: boolean;
}

const applyStrokeStyle = (ctx: CanvasRenderingContext2D, style: StrokeStyle, strokeWidth: number) => {
  if (style === 'dashed') {
    ctx.setLineDash([strokeWidth * 3, strokeWidth * 2]);
  } else if (style === 'dotted') {
    ctx.setLineDash([strokeWidth, strokeWidth * 1.5]);
  } else {
    ctx.setLineDash([]);
  }
};

export const renderElement = (
  ctx: CanvasRenderingContext2D,
  element: WhiteboardElement
): void => {
  if (element.isDeleted) return;

  ctx.save();
  ctx.globalAlpha = (element.opacity ?? 100) / 100;
  ctx.strokeStyle = element.strokeColor;
  ctx.fillStyle = element.fillColor;
  ctx.lineWidth = element.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  applyStrokeStyle(ctx, element.strokeStyle, element.strokeWidth);

  if (element.rotation !== 0) {
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate(element.rotation);
    ctx.translate(-cx, -cy);
  }

  switch (element.type) {
    case 'rectangle': {
      const { x, y, width, height } = element;
      const rx = Math.min(x, x + width);
      const ry = Math.min(y, y + height);
      const rw = Math.abs(width);
      const rh = Math.abs(height);

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(rx, ry, rw, rh, 6);
      } else {
        ctx.rect(rx, ry, rw, rh);
      }

      if (element.fillColor && element.fillColor !== 'transparent') {
        ctx.fill();
      }
      ctx.stroke();
      break;
    }

    case 'ellipse': {
      const cx = element.x + element.width / 2;
      const cy = element.y + element.height / 2;
      const rx = Math.abs(element.width / 2);
      const ry = Math.abs(element.height / 2);

      if (rx > 0 && ry > 0) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (element.fillColor && element.fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      }
      break;
    }

    case 'line': {
      const [p1, p2] = element.points;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      break;
    }

    case 'arrow': {
      const [p1, p2] = element.points;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const headLength = Math.max(12, element.strokeWidth * 4);
      const headAngle = Math.PI / 6;

      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(
        p2.x - headLength * Math.cos(angle - headAngle),
        p2.y - headLength * Math.sin(angle - headAngle)
      );
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(
        p2.x - headLength * Math.cos(angle + headAngle),
        p2.y - headLength * Math.sin(angle + headAngle)
      );
      ctx.stroke();
      break;
    }

    case 'pencil': {
      if (element.points.length === 0) break;
      if (element.points.length === 1) {
        ctx.beginPath();
        ctx.arc(
          element.points[0].x,
          element.points[0].y,
          element.strokeWidth / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = element.strokeColor;
        ctx.fill();
        break;
      }

      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);

      for (let i = 1; i < element.points.length - 1; i++) {
        const xc = (element.points[i].x + element.points[i + 1].x) / 2;
        const yc = (element.points[i].y + element.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(element.points[i].x, element.points[i].y, xc, yc);
      }

      const lastIdx = element.points.length - 1;
      ctx.lineTo(element.points[lastIdx].x, element.points[lastIdx].y);
      ctx.stroke();
      break;
    }

    case 'text': {
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      ctx.textBaseline = 'top';
      ctx.textAlign = element.textAlign;
      ctx.fillStyle = element.strokeColor;

      const lines = element.text.split('\n');
      const lineHeight = element.fontSize * 1.25;

      let drawX = element.x;
      if (element.textAlign === 'center') {
        drawX = element.x + element.width / 2;
      } else if (element.textAlign === 'right') {
        drawX = element.x + element.width;
      }

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], drawX, element.y + i * lineHeight);
      }
      break;
    }
  }

  ctx.restore();
};

const renderSelection = (
  ctx: CanvasRenderingContext2D,
  bounds: BoundingBox,
  zoom: number,
  isDarkTheme: boolean
) => {
  const padding = 6 / zoom;
  const minX = bounds.minX - padding;
  const minY = bounds.minY - padding;
  const maxX = bounds.maxX + padding;
  const maxY = bounds.maxY + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  ctx.save();
  ctx.strokeStyle = isDarkTheme ? '#818cf8' : '#4f46e5';
  ctx.lineWidth = 1.5 / zoom;
  ctx.setLineDash([4 / zoom, 4 / zoom]);
  ctx.strokeRect(minX, minY, width, height);
  ctx.setLineDash([]);

  const paddedBox: BoundingBox = { minX, minY, maxX, maxY, width, height };
  const handles = getBoundingBoxHandles(paddedBox);
  const handleSize = HANDLE_SIZE / zoom;

  for (const h of handles) {
    if (h.handle === 'rotation') {
      ctx.beginPath();
      ctx.moveTo(h.x, minY);
      ctx.lineTo(h.x, h.y);
      ctx.strokeStyle = isDarkTheme ? '#818cf8' : '#4f46e5';
      ctx.lineWidth = 1.5 / zoom;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(h.x, h.y, handleSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = isDarkTheme ? '#1e1e1e' : '#ffffff';
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = isDarkTheme ? '#1e1e1e' : '#ffffff';
      ctx.strokeStyle = isDarkTheme ? '#818cf8' : '#4f46e5';
      ctx.lineWidth = 1.5 / zoom;
      ctx.fillRect(
        h.x - handleSize / 2,
        h.y - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.strokeRect(
        h.x - handleSize / 2,
        h.y - handleSize / 2,
        handleSize,
        handleSize
      );
    }
  }

  ctx.restore();
};

const renderMarquee = (
  ctx: CanvasRenderingContext2D,
  marquee: BoundingBox,
  zoom: number,
  isDarkTheme: boolean
) => {
  ctx.save();
  ctx.fillStyle = isDarkTheme ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)';
  ctx.strokeStyle = isDarkTheme ? '#818cf8' : '#4f46e5';
  ctx.lineWidth = 1 / zoom;
  ctx.setLineDash([3 / zoom, 3 / zoom]);
  ctx.fillRect(marquee.minX, marquee.minY, marquee.width, marquee.height);
  ctx.strokeRect(marquee.minX, marquee.minY, marquee.width, marquee.height);
  ctx.restore();
};

const renderRemoteCursor = (
  ctx: CanvasRenderingContext2D,
  cursor: RemoteCursor,
  zoom: number
) => {
  ctx.save();
  ctx.translate(cursor.x, cursor.y);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 16 / zoom);
  ctx.lineTo(4 / zoom, 12 / zoom);
  ctx.lineTo(9 / zoom, 20 / zoom);
  ctx.lineTo(12 / zoom, 18 / zoom);
  ctx.lineTo(7 / zoom, 10 / zoom);
  ctx.lineTo(12 / zoom, 10 / zoom);
  ctx.closePath();
  ctx.fillStyle = cursor.userColor;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1 / zoom;
  ctx.stroke();

  const fontSize = Math.max(10, 12 / zoom);
  ctx.font = `600 ${fontSize}px sans-serif`;
  const textWidth = ctx.measureText(cursor.userName).width;
  const badgePaddingH = 6 / zoom;
  const badgePaddingV = 3 / zoom;
  const badgeHeight = fontSize + badgePaddingV * 2;
  const badgeWidth = textWidth + badgePaddingH * 2;
  const badgeX = 14 / zoom;
  const badgeY = 14 / zoom;

  ctx.fillStyle = cursor.userColor;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4 / zoom);
    ctx.fill();
  } else {
    ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
  }

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(cursor.userName, badgeX + badgePaddingH, badgeY + badgeHeight / 2);

  ctx.restore();
};

export const renderCanvas = (options: RenderOptions): void => {
  const {
    ctx,
    dpr,
    viewport,
    elements,
    selectedIds,
    previewElement,
    marqueeBox,
    eraserPoint,
    remoteCursors,
    isDarkTheme,
  } = options;

  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.translate(viewport.panX, viewport.panY);
  ctx.scale(viewport.zoom, viewport.zoom);

  for (const element of elements) {
    renderElement(ctx, element);
  }

  if (previewElement) {
    renderElement(ctx, previewElement);
  }

  if (selectedIds.length > 0) {
    const selectedElements = elements.filter(
      (e) => selectedIds.includes(e.id) && !e.isDeleted
    );
    const bounds = getMultipleElementsBounds(selectedElements);
    if (bounds) {
      renderSelection(ctx, bounds, viewport.zoom, isDarkTheme);
    }
  }

  if (marqueeBox) {
    renderMarquee(ctx, marqueeBox, viewport.zoom, isDarkTheme);
  }

  if (eraserPoint) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(eraserPoint.x, eraserPoint.y, 16 / viewport.zoom, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5 / viewport.zoom;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  for (const cursor of remoteCursors) {
    renderRemoteCursor(ctx, cursor, viewport.zoom);
  }

  ctx.restore();
};
