import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
} from 'lucide-react';
import { StrokeStyle, TextAlign, WhiteboardElement } from '@whiteboard/shared';
import { useBoardStore } from '../store/useBoardStore.js';
import { useToolStore } from '../store/useToolStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';
import {
  STROKE_COLORS,
  FILL_COLORS,
  STROKE_WIDTHS,
  FONT_SIZES,
} from '../utils/colors.js';

interface PropertiesPanelProps {
  onEmitUpdate: (elements: WhiteboardElement[]) => void;
  onEmitDelete: (elementIds: string[]) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  onEmitUpdate,
  onEmitDelete,
}) => {
  const {
    elements,
    selectedIds,
    updateElements,
    deleteSelected,
    duplicateSelected,
  } = useBoardStore();

  const { activeTool, settings, updateSettings } = useToolStore();
  const { pushSnapshot } = useHistoryStore();

  const selectedElements = elements.filter((e) => selectedIds.includes(e.id));
  const hasSelection = selectedElements.length > 0;
  const isTextMode =
    activeTool === 'text' || selectedElements.some((e) => e.type === 'text');

  const currentStrokeColor = hasSelection
    ? selectedElements[0].strokeColor
    : settings.strokeColor;

  const currentFillColor = hasSelection
    ? selectedElements[0].fillColor
    : settings.fillColor;

  const currentStrokeWidth = hasSelection
    ? selectedElements[0].strokeWidth
    : settings.strokeWidth;

  const currentStrokeStyle = hasSelection
    ? selectedElements[0].strokeStyle
    : settings.strokeStyle;

  const handleUpdateProperty = (
    key: string,
    val: unknown
  ) => {
    updateSettings({ [key]: val });
    if (hasSelection) {
      pushSnapshot(elements);
      const updated = selectedElements.map((elem) => {
        const copy: Record<string, unknown> = JSON.parse(JSON.stringify(elem));
        copy[key] = val;
        copy.version = ((copy.version as number) || 1) + 1;
        copy.updatedAt = Date.now();
        return copy as unknown as WhiteboardElement;
      });
      updateElements(updated);
      onEmitUpdate(updated);
    }
  };

  const handleDelete = () => {
    if (!hasSelection) return;
    pushSnapshot(elements);
    const deletedIds = deleteSelected();
    onEmitDelete(deletedIds);
  };

  const handleDuplicate = () => {
    if (!hasSelection) return;
    pushSnapshot(elements);
    const duplicates = duplicateSelected();
    onEmitUpdate(duplicates);
  };

  if (activeTool === 'eraser') {
    return null;
  }

  return (
    <aside
      aria-label="Shape and Tool Properties"
      className="absolute top-20 left-3 z-20 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-panel dark:shadow-panel-dark border border-slate-200 dark:border-slate-800 flex flex-col gap-3.5 text-xs text-slate-700 dark:text-slate-300"
    >
      <div>
        <span className="font-semibold block mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
          Stroke Color
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {STROKE_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleUpdateProperty('strokeColor', color)}
              className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 flex items-center justify-center ${
                currentStrokeColor === color
                  ? 'border-indigo-600 scale-105 shadow-sm ring-2 ring-indigo-400/30'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`Stroke color ${color}`}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="font-semibold block mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
          Background / Fill
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {FILL_COLORS.map((color) => {
            const isTransparent = color === 'transparent';
            const isSelected = currentFillColor === color;

            return (
              <button
                key={color}
                onClick={() => handleUpdateProperty('fillColor', color)}
                className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 flex items-center justify-center relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-600 scale-105 shadow-sm ring-2 ring-indigo-400/30'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
                style={{ backgroundColor: isTransparent ? 'transparent' : color }}
                title={isTransparent ? 'Transparent' : color}
                aria-label={`Fill color ${color}`}
              >
                {isTransparent && (
                  <div className="w-full h-[1.5px] bg-rose-500 rotate-45" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className="font-semibold block mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
          Stroke Width
        </span>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width}
              onClick={() => handleUpdateProperty('strokeWidth', width)}
              className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors ${
                currentStrokeWidth === width
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'
              }`}
              title={`Stroke width ${width}px`}
            >
              <div
                className="bg-current rounded-full"
                style={{ width: `${Math.min(width * 2, 16)}px`, height: `${width}px` }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="font-semibold block mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
          Stroke Style
        </span>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['solid', 'dashed', 'dotted'] as StrokeStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => handleUpdateProperty('strokeStyle', style)}
              className={`flex-1 py-1 text-[11px] capitalize rounded-lg transition-colors ${
                currentStrokeStyle === style
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'hover:bg-slate-200/60 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {isTextMode && (
        <>
          <div>
            <span className="font-semibold block mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              Font Size
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleUpdateProperty('fontSize', size)}
                  className={`flex-1 py-1 text-[11px] rounded-lg transition-colors ${
                    settings.fontSize === size
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-750'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold block mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              Text Align
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(
                [
                  { align: 'left', icon: AlignLeft },
                  { align: 'center', icon: AlignCenter },
                  { align: 'right', icon: AlignRight },
                ] as const
              ).map(({ align, icon: Icon }) => (
                <button
                  key={align}
                  onClick={() =>
                    handleUpdateProperty('textAlign', align as TextAlign)
                  }
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-colors ${
                    settings.textAlign === align
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-750'
                  }`}
                  title={`Align ${align}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {hasSelection && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-colors font-medium text-[11px]"
            title="Duplicate selected (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-xl transition-colors"
            title="Delete selected (Del)"
            aria-label="Delete selected element"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
