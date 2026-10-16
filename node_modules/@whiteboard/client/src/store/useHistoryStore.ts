import { create } from 'zustand';
import { WhiteboardElement } from '@whiteboard/shared';

interface HistoryState {
  undoStack: WhiteboardElement[][];
  redoStack: WhiteboardElement[][];
  canUndo: boolean;
  canRedo: boolean;
  pushSnapshot: (elements: WhiteboardElement[]) => void;
  undo: (currentElements: WhiteboardElement[]) => WhiteboardElement[] | null;
  redo: (currentElements: WhiteboardElement[]) => WhiteboardElement[] | null;
  clearHistory: () => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  canUndo: false,
  canRedo: false,

  pushSnapshot: (elements: WhiteboardElement[]) => {
    const clone = JSON.parse(JSON.stringify(elements));
    set((state) => {
      const nextUndo = [...state.undoStack, clone].slice(-MAX_HISTORY);
      return {
        undoStack: nextUndo,
        redoStack: [],
        canUndo: nextUndo.length > 0,
        canRedo: false,
      };
    });
  },

  undo: (currentElements: WhiteboardElement[]) => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;

    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);
    const newRedo = [...redoStack, JSON.parse(JSON.stringify(currentElements))];

    set({
      undoStack: newUndo,
      redoStack: newRedo,
      canUndo: newUndo.length > 0,
      canRedo: true,
    });

    return previous;
  },

  redo: (currentElements: WhiteboardElement[]) => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;

    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);
    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentElements))];

    set({
      undoStack: newUndo,
      redoStack: newRedo,
      canUndo: true,
      canRedo: newRedo.length > 0,
    });

    return next;
  },

  clearHistory: () => {
    set({
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
    });
  },
}));
