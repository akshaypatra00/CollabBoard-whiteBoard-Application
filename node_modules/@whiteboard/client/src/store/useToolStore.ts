import { create } from 'zustand';
import { ToolType, ToolSettings } from '@whiteboard/shared';

interface ToolState {
  activeTool: ToolType;
  settings: ToolSettings;
  setActiveTool: (tool: ToolType) => void;
  updateSettings: (partial: Partial<ToolSettings>) => void;
}

const defaultSettings: ToolSettings = {
  strokeColor: '#1e1e1e',
  fillColor: 'transparent',
  strokeWidth: 2,
  strokeStyle: 'solid',
  opacity: 100,
  fontSize: 20,
  fontFamily: 'Inter, sans-serif',
  textAlign: 'left',
};

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'select',
  settings: defaultSettings,
  setActiveTool: (tool) => set({ activeTool: tool }),
  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),
}));
