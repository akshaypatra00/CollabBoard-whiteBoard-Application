import { useEffect } from 'react';
import { useBoardStore } from '../store/useBoardStore.js';
import { useToolStore } from '../store/useToolStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';

interface ShortcutOptions {
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const useKeyboardShortcuts = (options: ShortcutOptions) => {
  const { setActiveTool } = useToolStore();
  const { clearSelection } = useBoardStore();
  const { canUndo, canRedo } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';

      if (isInput) return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) options.onRedo();
        } else {
          if (canUndo) options.onUndo();
        }
        return;
      }

      if (isCtrlOrCmd && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        if (canRedo) options.onRedo();
        return;
      }

      if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        options.onCopy();
        return;
      }

      if (isCtrlOrCmd && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        options.onPaste();
        return;
      }

      if (isCtrlOrCmd && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        options.onDuplicate();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        options.onDelete();
        return;
      }

      if (e.key === 'Escape') {
        clearSelection();
        setActiveTool('select');
        return;
      }

      if (isCtrlOrCmd && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        options.onZoomIn();
        return;
      }

      if (isCtrlOrCmd && e.key === '-') {
        e.preventDefault();
        options.onZoomOut();
        return;
      }

      if (isCtrlOrCmd && e.key === '0') {
        e.preventDefault();
        options.onResetZoom();
        return;
      }

      if (!isCtrlOrCmd && !e.altKey) {
        const selectTool = (tool: 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'text' | 'eraser') => {
          setActiveTool(tool);
          if (tool !== 'select') {
            clearSelection();
          }
        };
        switch (e.key.toLowerCase()) {
          case 'v':
          case '1':
            selectTool('select');
            break;
          case 'p':
          case '2':
            selectTool('pencil');
            break;
          case 'r':
          case '3':
            selectTool('rectangle');
            break;
          case 'o':
          case '4':
            selectTool('ellipse');
            break;
          case 'l':
          case '5':
            selectTool('line');
            break;
          case 'a':
          case '6':
            selectTool('arrow');
            break;
          case 't':
          case '7':
            selectTool('text');
            break;
          case 'x':
          case '8':
            selectTool('eraser');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActiveTool, clearSelection, canUndo, canRedo, options]);
};
