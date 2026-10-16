import { WhiteboardElement } from '@whiteboard/shared';
import { getMultipleElementsBounds } from '../utils/geometry.js';
import { renderElement } from './renderer.js';

export interface ExportOptions {
  elements: WhiteboardElement[];
  boardTitle: string;
  isDarkTheme: boolean;
  withBackground?: boolean;
}

export const exportToPng = (options: ExportOptions): void => {
  const { elements, boardTitle, isDarkTheme, withBackground = true } = options;

  const activeElements = elements.filter((e) => !e.isDeleted);
  if (activeElements.length === 0) {
    return;
  }

  const bounds = getMultipleElementsBounds(activeElements);
  if (!bounds) {
    return;
  }

  const padding = 50;
  const scale = 2;

  const exportWidth = bounds.width + padding * 2;
  const exportHeight = bounds.height + padding * 2;

  const offscreen = document.createElement('canvas');
  offscreen.width = exportWidth * scale;
  offscreen.height = exportHeight * scale;

  const ctx = offscreen.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.scale(scale, scale);

  if (withBackground) {
    ctx.fillStyle = isDarkTheme ? '#121212' : '#ffffff';
    ctx.fillRect(0, 0, exportWidth, exportHeight);
  }

  ctx.translate(-bounds.minX + padding, -bounds.minY + padding);

  for (const element of activeElements) {
    renderElement(ctx, element);
  }

  const dataUrl = offscreen.toDataURL('image/png');
  const link = document.createElement('a');
  const safeTitle = boardTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.download = `${safeTitle || 'whiteboard'}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
