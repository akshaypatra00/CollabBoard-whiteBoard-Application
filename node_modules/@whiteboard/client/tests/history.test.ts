import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryStore } from '../src/store/useHistoryStore.js';
import { RectangleElement, WhiteboardElement } from '@whiteboard/shared';

describe('History Store (Undo and Redo)', () => {
  const dummyElement: RectangleElement = {
    id: 'el-1',
    type: 'rectangle',
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    strokeColor: '#000',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 100,
    rotation: 0,
    version: 1,
    updatedAt: 1000,
  };

  beforeEach(() => {
    useHistoryStore.getState().clearHistory();
  });

  it('manages undo and redo stacks correctly', () => {
    const store = useHistoryStore.getState();
    expect(store.canUndo).toBe(false);
    expect(store.canRedo).toBe(false);

    const state0: WhiteboardElement[] = [];
    const state1: WhiteboardElement[] = [dummyElement];
    const state2: WhiteboardElement[] = [
      dummyElement,
      { ...dummyElement, id: 'el-2', x: 60 },
    ];

    store.pushSnapshot(state0);
    store.pushSnapshot(state1);

    expect(useHistoryStore.getState().canUndo).toBe(true);
    expect(useHistoryStore.getState().canRedo).toBe(false);

    const undone = useHistoryStore.getState().undo(state2);
    expect(undone).toEqual(state1);
    expect(useHistoryStore.getState().canUndo).toBe(true);
    expect(useHistoryStore.getState().canRedo).toBe(true);

    const redone = useHistoryStore.getState().redo(state1);
    expect(redone).toEqual(state2);
    expect(useHistoryStore.getState().canRedo).toBe(false);
  });

  it('clears redo stack when a new snapshot is recorded', () => {
    const store = useHistoryStore.getState();
    const state0: WhiteboardElement[] = [];
    const state1: WhiteboardElement[] = [dummyElement];

    store.pushSnapshot(state0);
    store.undo(state1);
    expect(useHistoryStore.getState().canRedo).toBe(true);

    store.pushSnapshot([{ ...dummyElement, id: 'el-branch' }]);
    expect(useHistoryStore.getState().canRedo).toBe(false);
  });
});
