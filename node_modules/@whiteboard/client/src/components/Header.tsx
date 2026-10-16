import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Share2,
  Download,
  Sun,
  Moon,
  Trash2,
  HelpCircle,
  Pencil,
  Check,
} from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore.js';
import { useCollaborationStore } from '../store/useCollaborationStore.js';
import { exportToPng } from '../canvas/export.js';

interface HeaderProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenShare: () => void;
  onOpenShortcuts: () => void;
  onUpdateTitle: (title: string) => void;
  onClearBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkTheme,
  onToggleTheme,
  onOpenShare,
  onOpenShortcuts,
  onUpdateTitle,
  onClearBoard,
}) => {
  const { boardTitle, setBoardTitle, elements, saveStatus } = useBoardStore();
  const { connectionStatus } = useCollaborationStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(boardTitle);

  const handleTitleSubmit = () => {
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== boardTitle) {
      setBoardTitle(trimmed);
      onUpdateTitle(trimmed);
    } else {
      setTitleInput(boardTitle);
    }
    setIsEditingTitle(false);
  };

  const handleExport = () => {
    exportToPng({
      elements,
      boardTitle,
      isDarkTheme,
    });
  };

  return (
    <header className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-panel dark:shadow-panel-dark border border-slate-200 dark:border-slate-800 pointer-events-auto">
        <Link
          to="/"
          className="flex items-center gap-2 group outline-none"
          title="Back to Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 hidden sm:inline tracking-tight text-sm">
            CollabBoard
          </span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5" />

        <div className="flex items-center gap-1.5">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleInput(boardTitle);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                maxLength={60}
                className="text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded outline-none border border-indigo-500 w-32 sm:w-48"
              />
              <button
                onClick={handleTitleSubmit}
                className="p-1 text-emerald-600 hover:text-emerald-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTitleInput(boardTitle);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              title="Click to rename board"
            >
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {boardTitle}
              </span>
              <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'connecting'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-rose-500'
              }`}
            />
            <span className="capitalize">{connectionStatus}</span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">•</span>

          <span
            className={`font-medium ${
              saveStatus === 'saved'
                ? 'text-emerald-600 dark:text-emerald-400'
                : saveStatus === 'saving'
                  ? 'text-amber-600 dark:text-amber-400 animate-pulse'
                  : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {saveStatus === 'saved'
              ? 'Saved'
              : saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'unsaved'
                  ? 'Unsaved changes'
                  : 'Offline'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-panel dark:shadow-panel-dark border border-slate-200 dark:border-slate-800 pointer-events-auto">
        <button
          onClick={onClearBoard}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Board"
          aria-label="Clear Board"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleExport}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Export as PNG"
          aria-label="Export as PNG"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Keyboard Shortcuts"
          aria-label="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-colors"
          aria-label="Share Board"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
};
