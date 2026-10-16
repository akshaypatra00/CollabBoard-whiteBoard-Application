import React from 'react';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore.js';
import { getMultipleElementsBounds } from '../utils/geometry.js';

export const ZoomControls: React.FC = () => {
  const { viewport, setViewport, elements } = useBoardStore();

  const handleZoom = (factor: number) => {
    const centerScreen = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    const newZoom = Math.min(5.0, Math.max(0.1, viewport.zoom * factor));
    const newPanX =
      centerScreen.x -
      (centerScreen.x - viewport.panX) * (newZoom / viewport.zoom);
    const newPanY =
      centerScreen.y -
      (centerScreen.y - viewport.panY) * (newZoom / viewport.zoom);

    setViewport({ panX: newPanX, panY: newPanY, zoom: newZoom });
  };

  const handleResetZoom = () => {
    setViewport({ panX: 0, panY: 0, zoom: 1 });
  };

  const handleFitToContent = () => {
    const active = elements.filter((e) => !e.isDeleted);
    if (active.length === 0) {
      handleResetZoom();
      return;
    }

    const bounds = getMultipleElementsBounds(active);
    if (!bounds) return;

    const padding = 80;
    const availableW = window.innerWidth - padding * 2;
    const availableH = window.innerHeight - padding * 2;

    const zoomW = availableW / Math.max(bounds.width, 100);
    const zoomH = availableH / Math.max(bounds.height, 100);
    const fitZoom = Math.min(1.5, Math.max(0.2, Math.min(zoomW, zoomH)));

    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;

    const panX = window.innerWidth / 2 - centerX * fitZoom;
    const panY = window.innerHeight / 2 - centerY * fitZoom;

    setViewport({ panX, panY, zoom: fitZoom });
  };

  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-panel dark:shadow-panel-dark border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
      <button
        onClick={() => handleZoom(0.85)}
        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Zoom Out (Ctrl -)"
        aria-label="Zoom Out"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={handleResetZoom}
        className="px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium min-w-[48px] text-center transition-colors"
        title="Reset Zoom (Ctrl 0)"
      >
        {zoomPercent}%
      </button>

      <button
        onClick={() => handleZoom(1.15)}
        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Zoom In (Ctrl +)"
        aria-label="Zoom In"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5" />

      <button
        onClick={handleFitToContent}
        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Fit to Content"
        aria-label="Fit to Content"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
