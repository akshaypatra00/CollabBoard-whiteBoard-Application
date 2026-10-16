import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Users,
  Layers,
  Share2,
} from 'lucide-react';
import { BoardSummary } from '@whiteboard/shared';
import { api } from '../services/api.js';
import { storage } from '../services/storage.js';
import { useTheme } from '../hooks/useTheme.js';
import { RecentBoards } from '../components/RecentBoards.js';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [recentBoards, setRecentBoards] = useState<BoardSummary[]>([]);
  const [boardUrlInput, setBoardUrlInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setRecentBoards(storage.getRecentBoards());
  }, []);

  const handleCreateBoard = async () => {
    try {
      setIsCreating(true);
      setErrorMessage(null);
      const newBoard = await api.createBoard('Untitled Board');
      storage.saveRecentBoard({
        id: newBoard.id,
        title: newBoard.title,
        updatedAt: new Date().toISOString(),
        elementCount: 0,
      });
      navigate(`/board/${newBoard.id}`);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to create new board'
      );
      setIsCreating(false);
    }
  };

  const handleOpenExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardUrlInput.trim()) return;

    let targetId = boardUrlInput.trim();
    if (targetId.includes('/board/')) {
      const match = targetId.match(/\/board\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        targetId = match[1];
      }
    }

    if (targetId) {
      navigate(`/board/${targetId}`);
    }
  };

  const handleRemoveRecent = (id: string) => {
    storage.removeRecentBoard(id);
    setRecentBoards(storage.getRecentBoards());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg
              className="w-5 h-5"
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
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            CollabBoard
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time collaborative whiteboard</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Brainstorm, sketch, and collaborate effortlessly.
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400">
            Zero sign-up required. Create an infinite canvas, share your unique
            URL with teammates, and draw together in real-time.
          </p>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-2xl">
              {errorMessage}
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleCreateBoard}
              disabled={isCreating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Creating Board...' : 'Create New Board'}</span>
            </button>

            <form
              onSubmit={handleOpenExisting}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <input
                type="text"
                value={boardUrlInput}
                onChange={(e) => setBoardUrlInput(e.target.value)}
                placeholder="Paste board URL or ID..."
                className="w-full sm:w-64 px-4 py-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 shadow-xs"
              />
              <button
                type="submit"
                className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors shrink-0 shadow-xs"
                title="Open board"
                aria-label="Open board"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recently Opened Boards
            </h2>
          </div>
          <RecentBoards boards={recentBoards} onRemove={handleRemoveRecent} />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Live Collaboration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-user real-time room syncing with live remote cursors and
              instant vector stroke updates.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Native 2D Canvas Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hand-crafted native HTML Canvas 2D engine with smooth zooming,
              infinite panning, hit testing, and high-DPI rendering.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Instant Shareable Links
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No passwords, accounts, or friction. Copy your unique link to
              invite anyone immediately.
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/50 dark:border-slate-850">
        CollabBoard • Production-grade real-time whiteboard built with React,
        Canvas 2D API, Zustand, Express, and Socket.IO.
      </footer>
    </div>
  );
};
