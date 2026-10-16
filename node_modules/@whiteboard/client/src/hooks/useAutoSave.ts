import { useEffect, useRef } from 'react';
import { useBoardStore } from '../store/useBoardStore.js';
import { api } from '../services/api.js';
import { storage } from '../services/storage.js';

export const useAutoSave = () => {
  const { boardId, boardTitle, elements, saveStatus, setSaveStatus, isLoaded } =
    useBoardStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoaded || !boardId || saveStatus !== 'unsaved') {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await api.saveElements(boardId, elements);
        setSaveStatus('saved');

        storage.saveRecentBoard({
          id: boardId,
          title: boardTitle,
          updatedAt: new Date().toISOString(),
          elementCount: elements.length,
        });
      } catch {
        setSaveStatus('offline');
      }
    }, 1200);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [boardId, boardTitle, elements, saveStatus, isLoaded, setSaveStatus]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (useBoardStore.getState().saveStatus === 'unsaved') {
        const state = useBoardStore.getState();
        navigator.sendBeacon(
          `${import.meta.env.VITE_API_URL || '/api'}/boards/${state.boardId}/elements`,
          JSON.stringify({ elements: state.elements })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
