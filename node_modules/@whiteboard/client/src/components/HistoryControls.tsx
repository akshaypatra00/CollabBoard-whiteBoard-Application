import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { useHistoryStore } from '../store/useHistoryStore.js';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({
  onUndo,
  onRedo,
}) => {
  const { canUndo, canRedo } = useHistoryStore();

  return (
    <div className="absolute bottom-4 left-48 z-20 hidden sm:flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-panel dark:shadow-panel-dark border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-1.5 rounded-xl transition-colors ${
          canUndo
            ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            : 'opacity-40 cursor-not-allowed'
        }`}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-1.5 rounded-xl transition-colors ${
          canRedo
            ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            : 'opacity-40 cursor-not-allowed'
        }`}
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <RotateCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
