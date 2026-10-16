import { create } from 'zustand';
import { WhiteboardElement } from '@whiteboard/shared';
import { Viewport } from '../canvas/transform.js';
import { generateId } from '../utils/id.js';

export type SaveStatus = 'saved' | 'saving' | 'offline' | 'unsaved';

interface BoardState {
  boardId: string;
  boardTitle: string;
  elements: WhiteboardElement[];
  selectedIds: string[];
  viewport: Viewport;
  saveStatus: SaveStatus;
  isLoaded: boolean;
  copiedElements: WhiteboardElement[];

  setBoard: (id: string, title: string, elements: WhiteboardElement[]) => void;
  setBoardTitle: (title: string) => void;
  setElements: (elements: WhiteboardElement[]) => void;
  addElement: (element: WhiteboardElement) => void;
  updateElements: (elements: WhiteboardElement[]) => void;
  deleteSelected: () => string[];
  deleteElements: (ids: string[]) => void;
  duplicateSelected: () => WhiteboardElement[];
  copySelected: () => void;
  pasteCopied: () => WhiteboardElement[];
  setSelectedIds: (ids: string[]) => void;
  selectElement: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  setViewport: (viewport: Viewport) => void;
  setSaveStatus: (status: SaveStatus) => void;
  clearBoard: () => void;

  applyRemoteUpdates: (incoming: WhiteboardElement[]) => void;
  applyRemoteDelete: (ids: string[]) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boardId: '',
  boardTitle: 'Untitled Board',
  elements: [],
  selectedIds: [],
  viewport: { panX: 0, panY: 0, zoom: 1 },
  saveStatus: 'saved',
  isLoaded: false,
  copiedElements: [],

  setBoard: (id, title, elements) => {
    set({
      boardId: id,
      boardTitle: title,
      elements,
      selectedIds: [],
      isLoaded: true,
      saveStatus: 'saved',
    });
  },

  setBoardTitle: (title) => set({ boardTitle: title, saveStatus: 'unsaved' }),

  setElements: (elements) => set({ elements, saveStatus: 'unsaved' }),

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      saveStatus: 'unsaved',
    })),

  updateElements: (updated) =>
    set((state) => {
      const updateMap = new Map(updated.map((e) => [e.id, e]));
      const nextElements = state.elements.map((existing) =>
        updateMap.get(existing.id) || existing
      );
      return {
        elements: nextElements,
        saveStatus: 'unsaved',
      };
    }),

  deleteSelected: () => {
    const { selectedIds, elements } = get();
    if (selectedIds.length === 0) return [];

    const idSet = new Set(selectedIds);
    set({
      elements: elements.filter((e) => !idSet.has(e.id)),
      selectedIds: [],
      saveStatus: 'unsaved',
    });

    return selectedIds;
  },

  deleteElements: (ids) => {
    const idSet = new Set(ids);
    set((state) => ({
      elements: state.elements.filter((e) => !idSet.has(e.id)),
      selectedIds: state.selectedIds.filter((id) => !idSet.has(id)),
      saveStatus: 'unsaved',
    }));
  },

  duplicateSelected: () => {
    const { selectedIds, elements } = get();
    if (selectedIds.length === 0) return [];

    const duplicates: WhiteboardElement[] = [];
    for (const elem of elements) {
      if (selectedIds.includes(elem.id)) {
        const offset = 20;
        const copy: WhiteboardElement = JSON.parse(JSON.stringify(elem));
        copy.id = generateId();
        copy.x += offset;
        copy.y += offset;
        copy.version = 1;
        copy.updatedAt = Date.now();

        if (copy.type === 'line' || copy.type === 'arrow') {
          copy.points = [
            { x: copy.points[0].x + offset, y: copy.points[0].y + offset },
            { x: copy.points[1].x + offset, y: copy.points[1].y + offset },
          ];
        } else if (copy.type === 'pencil') {
          copy.points = copy.points.map((p) => ({
            x: p.x + offset,
            y: p.y + offset,
          }));
        }

        duplicates.push(copy);
      }
    }

    set((state) => ({
      elements: [...state.elements, ...duplicates],
      selectedIds: duplicates.map((d) => d.id),
      saveStatus: 'unsaved',
    }));

    return duplicates;
  },

  copySelected: () => {
    const { selectedIds, elements } = get();
    const toCopy = elements.filter((e) => selectedIds.includes(e.id));
    set({ copiedElements: JSON.parse(JSON.stringify(toCopy)) });
  },

  pasteCopied: () => {
    const { copiedElements } = get();
    if (copiedElements.length === 0) return [];

    const offset = 30;
    const pasted: WhiteboardElement[] = copiedElements.map((elem) => {
      const copy: WhiteboardElement = JSON.parse(JSON.stringify(elem));
      copy.id = generateId();
      copy.x += offset;
      copy.y += offset;
      copy.version = 1;
      copy.updatedAt = Date.now();

      if (copy.type === 'line' || copy.type === 'arrow') {
        copy.points = [
          { x: copy.points[0].x + offset, y: copy.points[0].y + offset },
          { x: copy.points[1].x + offset, y: copy.points[1].y + offset },
        ];
      } else if (copy.type === 'pencil') {
        copy.points = copy.points.map((p) => ({
          x: p.x + offset,
          y: p.y + offset,
        }));
      }

      return copy;
    });

    set((state) => ({
      elements: [...state.elements, ...pasted],
      selectedIds: pasted.map((p) => p.id),
      saveStatus: 'unsaved',
    }));

    return pasted;
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  selectElement: (id, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        if (state.selectedIds.includes(id)) {
          return { selectedIds: state.selectedIds.filter((item) => item !== id) };
        }
        return { selectedIds: [...state.selectedIds, id] };
      }
      return { selectedIds: [id] };
    });
  },

  clearSelection: () => set({ selectedIds: [] }),

  setViewport: (viewport) => set({ viewport }),

  setSaveStatus: (status) => set({ saveStatus: status }),

  clearBoard: () => set({ elements: [], selectedIds: [], saveStatus: 'unsaved' }),

  applyRemoteUpdates: (incoming) => {
    set((state) => {
      const elementMap = new Map<string, WhiteboardElement>();
      for (const elem of state.elements) {
        elementMap.set(elem.id, elem);
      }

      for (const item of incoming) {
        const existing = elementMap.get(item.id);
        if (!existing) {
          elementMap.set(item.id, item);
        } else {
          const incomingVer = item.version ?? 0;
          const existingVer = existing.version ?? 0;
          const incomingTime = item.updatedAt ?? 0;
          const existingTime = existing.updatedAt ?? 0;

          if (incomingVer > existingVer || incomingTime >= existingTime) {
            elementMap.set(item.id, item);
          }
        }
      }

      return {
        elements: Array.from(elementMap.values()).filter((e) => !e.isDeleted),
      };
    });
  },

  applyRemoteDelete: (ids) => {
    const idSet = new Set(ids);
    set((state) => ({
      elements: state.elements.filter((e) => !idSet.has(e.id)),
      selectedIds: state.selectedIds.filter((id) => !idSet.has(id)),
    }));
  },
}));
