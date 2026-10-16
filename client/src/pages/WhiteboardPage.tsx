import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Plus, Home } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';
import { useSocket } from '../hooks/useSocket.js';
import { useAutoSave } from '../hooks/useAutoSave.js';
import { useTheme } from '../hooks/useTheme.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { api } from '../services/api.js';
import { storage } from '../services/storage.js';
import { Header } from '../components/Header.js';
import { Toolbar } from '../components/Toolbar.js';
import { PropertiesPanel } from '../components/PropertiesPanel.js';
import { ZoomControls } from '../components/ZoomControls.js';
import { HistoryControls } from '../components/HistoryControls.js';
import { ShareModal } from '../components/ShareModal.js';
import { ShortcutsModal } from '../components/ShortcutsModal.js';
import { Canvas } from '../canvas/Canvas.js';

export const WhiteboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const boardId = id || '';

  const { isDark, toggleTheme } = useTheme();
  const {
    elements,
    setBoard,
    setElements,
    setBoardTitle,
    deleteSelected,
    duplicateSelected,
    copySelected,
    pasteCopied,
    clearBoard,
    viewport,
    setViewport,
  } = useBoardStore();

  const { pushSnapshot, undo, redo } = useHistoryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const {
    emitCreateElement,
    emitUpdateElements,
    emitDeleteElements,
    emitClearBoard,
    emitUpdateTitle,
    emitCursorMove,
  } = useSocket(boardId);

  useAutoSave();

  useEffect(() => {
    let isMounted = true;
    const loadBoard = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const board = await api.getBoard(boardId);
        if (isMounted) {
          setBoard(board.id, board.title, board.elements);
          storage.saveRecentBoard({
            id: board.id,
            title: board.title,
            updatedAt: new Date().toISOString(),
            elementCount: board.elements.length,
          });
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : 'Failed to load whiteboard'
          );
          setIsLoading(false);
        }
      }
    };

    if (boardId) {
      loadBoard();
    }

    return () => {
      isMounted = false;
    };
  }, [boardId, setBoard]);

  const handleUndo = () => {
    const prev = undo(elements);
    if (prev) {
      setElements(prev);
      emitUpdateElements(prev);
    }
  };

  const handleRedo = () => {
    const next = redo(elements);
    if (next) {
      setElements(next);
      emitUpdateElements(next);
    }
  };

  const handleDelete = () => {
    pushSnapshot(elements);
    const deleted = deleteSelected();
    emitDeleteElements(deleted);
  };

  const handleDuplicate = () => {
    pushSnapshot(elements);
    const duplicates = duplicateSelected();
    emitUpdateElements(duplicates);
  };

  const handlePaste = () => {
    pushSnapshot(elements);
    const pasted = pasteCopied();
    emitUpdateElements(pasted);
  };

  const handleClearBoard = () => {
    if (elements.length === 0) return;
    if (window.confirm('Are you sure you want to clear the entire whiteboard?')) {
      pushSnapshot(elements);
      clearBoard();
      emitClearBoard();
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setBoardTitle(newTitle);
    emitUpdateTitle(newTitle);
  };

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: handleDelete,
    onDuplicate: handleDuplicate,
    onCopy: copySelected,
    onPaste: handlePaste,
    onZoomIn: () =>
      setViewport({ ...viewport, zoom: Math.min(5, viewport.zoom * 1.15) }),
    onZoomOut: () =>
      setViewport({ ...viewport, zoom: Math.max(0.1, viewport.zoom * 0.85) }),
    onResetZoom: () => setViewport({ ...viewport, zoom: 1 }),
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading whiteboard...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-6 text-center">
        <div className="w-14 h-14 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold mb-2">Could Not Load Whiteboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          {loadError}. The board may have been removed or the link is incorrect.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
          <button
            onClick={async () => {
              const newBoard = await api.createBoard('Untitled Board');
              window.location.href = `/board/${newBoard.id}`;
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Board</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-canvas-light dark:bg-canvas-dark text-slate-800 dark:text-slate-100 select-none">
      <Header
        isDarkTheme={isDark}
        onToggleTheme={toggleTheme}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onUpdateTitle={handleTitleChange}
        onClearBoard={handleClearBoard}
      />

      <Toolbar />
      <PropertiesPanel
        onEmitUpdate={emitUpdateElements}
        onEmitDelete={emitDeleteElements}
      />
      <ZoomControls />
      <HistoryControls onUndo={handleUndo} onRedo={handleRedo} />

      <Canvas
        isDarkTheme={isDark}
        onEmitCreate={emitCreateElement}
        onEmitUpdate={emitUpdateElements}
        onEmitDelete={emitDeleteElements}
        onEmitCursorMove={emitCursorMove}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        boardId={boardId}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
