import React from 'react';
import {
  MousePointer,
  Pencil,
  Square,
  Circle,
  ArrowUpRight,
  Minus,
  Type,
  Eraser,
} from 'lucide-react';
import { ToolType } from '@whiteboard/shared';
import { useToolStore } from '../store/useToolStore.js';
import { useBoardStore } from '../store/useBoardStore.js';

interface ToolItem {
  id: ToolType;
  label: string;
  shortcut: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolItem[] = [
  { id: 'select', label: 'Selection', shortcut: 'V', icon: MousePointer },
  { id: 'pencil', label: 'Pencil', shortcut: 'P', icon: Pencil },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: Square },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: Circle },
  { id: 'arrow', label: 'Arrow', shortcut: 'A', icon: ArrowUpRight },
  { id: 'line', label: 'Line', shortcut: 'L', icon: Minus },
  { id: 'text', label: 'Text', shortcut: 'T', icon: Type },
  { id: 'eraser', label: 'Eraser', shortcut: 'X', icon: Eraser },
];

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useToolStore();
  const { clearSelection } = useBoardStore();

  const handleToolSelect = (toolId: ToolType) => {
    setActiveTool(toolId);
    if (toolId !== 'select') {
      clearSelection();
    }
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <nav
        aria-label="Drawing Tools"
        className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-panel dark:shadow-panel-dark border border-slate-200 dark:border-slate-800 pointer-events-auto"
      >
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`relative p-2 rounded-xl transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
              aria-label={`${tool.label} (${tool.shortcut})`}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span className="sr-only">{tool.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
