import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, TextElement, WhiteboardElement } from '@whiteboard/shared';
import { useBoardStore } from '../store/useBoardStore.js';
import { useCollaborationStore } from '../store/useCollaborationStore.js';
import { useToolStore } from '../store/useToolStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';
import { useCanvasPointer } from '../hooks/useCanvasPointer.js';
import { renderCanvas } from './renderer.js';
import { worldToScreen } from './transform.js';
import { generateId } from '../utils/id.js';

interface CanvasProps {
  isDarkTheme: boolean;
  onEmitCreate: (element: WhiteboardElement) => void;
  onEmitUpdate: (elements: WhiteboardElement[]) => void;
  onEmitDelete: (elementIds: string[]) => void;
  onEmitCursorMove: (x: number, y: number) => void;
}

interface InlineTextEditorState {
  elementId?: string;
  worldPoint: Point;
  screenPoint: Point;
  initialText: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  isDarkTheme,
  onEmitCreate,
  onEmitUpdate,
  onEmitDelete,
  onEmitCursorMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { elements, selectedIds, viewport, addElement, updateElements } =
    useBoardStore();
  const { remoteCursors } = useCollaborationStore();
  const { settings, setActiveTool } = useToolStore();
  const { pushSnapshot } = useHistoryStore();

  const [textEditor, setTextEditor] = useState<InlineTextEditorState | null>(null);
  const [editorText, setEditorText] = useState<string>('');

  const openTextEditor = useCallback(
    (worldPoint: Point, existingElement?: TextElement) => {
      const screenPoint = worldToScreen(worldPoint, viewport);
      setTextEditor({
        elementId: existingElement?.id,
        worldPoint,
        screenPoint,
        initialText: existingElement ? existingElement.text : '',
      });
      setEditorText(existingElement ? existingElement.text : '');
    },
    [viewport]
  );

  const {
    previewElement,
    marqueeBox,
    eraserPoint,
    cursorStyle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useCanvasPointer({
    canvasRef,
    onEmitCreate,
    onEmitUpdate,
    onEmitDelete,
    onEmitCursorMove,
    onOpenTextEditor: openTextEditor,
  });

  const commitTextEditor = () => {
    if (!textEditor) return;

    const trimmed = editorText.trim();
    if (!trimmed) {
      setTextEditor(null);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let textWidth = 100;
    let textHeight = settings.fontSize * 1.3;

    if (ctx) {
      ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
      const lines = trimmed.split('\n');
      textWidth = Math.max(...lines.map((l) => ctx.measureText(l).width), 40);
      textHeight = lines.length * settings.fontSize * 1.3;
    }

    if (textEditor.elementId) {
      const existing = elements.find((e) => e.id === textEditor.elementId);
      if (existing && existing.type === 'text') {
        const updated: TextElement = {
          ...existing,
          text: trimmed,
          width: textWidth,
          height: textHeight,
          version: (existing.version || 1) + 1,
          updatedAt: Date.now(),
        };
        pushSnapshot(elements);
        updateElements([updated]);
        onEmitUpdate([updated]);
      }
    } else {
      const newElem: TextElement = {
        id: generateId(),
        type: 'text',
        x: textEditor.worldPoint.x,
        y: textEditor.worldPoint.y,
        width: textWidth,
        height: textHeight,
        text: trimmed,
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        textAlign: settings.textAlign,
        strokeColor: settings.strokeColor,
        fillColor: 'transparent',
        strokeWidth: 1,
        strokeStyle: 'solid',
        opacity: settings.opacity,
        rotation: 0,
        version: 1,
        updatedAt: Date.now(),
      };
      pushSnapshot(elements);
      addElement(newElem);
      onEmitCreate(newElem);
      setActiveTool('select');
    }

    setTextEditor(null);
  };

  useEffect(() => {
    if (textEditor && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [textEditor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      renderCanvas({
        ctx,
        dpr,
        viewport,
        elements,
        selectedIds,
        previewElement,
        marqueeBox,
        eraserPoint,
        remoteCursors: Array.from(remoteCursors.values()),
        isDarkTheme,
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    viewport,
    elements,
    selectedIds,
    previewElement,
    marqueeBox,
    eraserPoint,
    remoteCursors,
    isDarkTheme,
  ]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none touch-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ cursor: cursorStyle }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      />

      {textEditor && (
        <div
          className="absolute z-30"
          style={{
            left: `${textEditor.screenPoint.x}px`,
            top: `${textEditor.screenPoint.y}px`,
          }}
        >
          <textarea
            ref={textAreaRef}
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            onBlur={commitTextEditor}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setTextEditor(null);
              } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                commitTextEditor();
              }
            }}
            placeholder="Type text..."
            className="p-1 outline-none border border-indigo-500 rounded bg-white/90 dark:bg-slate-900/90 shadow-lg resize-none min-w-[140px] min-h-[40px]"
            style={{
              fontSize: `${settings.fontSize * viewport.zoom}px`,
              fontFamily: settings.fontFamily,
              color: settings.strokeColor,
              lineHeight: 1.25,
            }}
          />
        </div>
      )}
    </div>
  );
};
