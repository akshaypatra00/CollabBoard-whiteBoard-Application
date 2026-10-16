import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    title: 'Tools',
    items: [
      { key: 'V / 1', desc: 'Select tool' },
      { key: 'P / 2', desc: 'Pencil tool' },
      { key: 'R / 3', desc: 'Rectangle' },
      { key: 'O / 4', desc: 'Ellipse' },
      { key: 'A / 6', desc: 'Arrow' },
      { key: 'L / 5', desc: 'Line' },
      { key: 'T / 7', desc: 'Text tool' },
      { key: 'X / 8', desc: 'Eraser' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { key: 'Ctrl + Z', desc: 'Undo' },
      { key: 'Ctrl + Y', desc: 'Redo' },
      { key: 'Ctrl + C', desc: 'Copy selected' },
      { key: 'Ctrl + V', desc: 'Paste' },
      { key: 'Ctrl + D', desc: 'Duplicate' },
      { key: 'Delete', desc: 'Delete selected' },
      { key: 'Space + Drag', desc: 'Pan canvas' },
      { key: 'Ctrl + Scroll', desc: 'Zoom in / out' },
      { key: 'Esc', desc: 'Reset selection' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h2 id="shortcuts-dialog-title" className="text-base font-bold">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                {group.title}
              </span>
              <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-0.5"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[10px] text-slate-800 dark:text-slate-200 shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
