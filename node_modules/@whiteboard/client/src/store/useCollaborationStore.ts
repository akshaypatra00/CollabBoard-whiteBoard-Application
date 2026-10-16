import { create } from 'zustand';
import { RemoteCursor } from '@whiteboard/shared';
import { generateId } from '../utils/id.js';
import { getRandomCursorColor } from '../utils/colors.js';

interface CollaborationState {
  clientId: string;
  userName: string;
  userColor: string;
  remoteCursors: Map<string, RemoteCursor>;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  errorMessage: string | null;
  setUserName: (name: string) => void;
  setConnectionStatus: (
    status: 'connecting' | 'connected' | 'disconnected' | 'error',
    error?: string
  ) => void;
  updateRemoteCursor: (cursor: RemoteCursor) => void;
  removeRemoteCursor: (clientId: string) => void;
  clearRemoteCursors: () => void;
}

const getStoredUser = () => {
  const storedId = sessionStorage.getItem('collab_client_id');
  const storedName = localStorage.getItem('collab_user_name');
  const storedColor = sessionStorage.getItem('collab_user_color');

  const clientId = storedId || generateId(8);
  const userName = storedName || `User-${clientId.slice(0, 4)}`;
  const userColor = storedColor || getRandomCursorColor();

  sessionStorage.setItem('collab_client_id', clientId);
  sessionStorage.setItem('collab_user_color', userColor);

  return { clientId, userName, userColor };
};

const initialUser = getStoredUser();

export const useCollaborationStore = create<CollaborationState>((set) => ({
  clientId: initialUser.clientId,
  userName: initialUser.userName,
  userColor: initialUser.userColor,
  remoteCursors: new Map(),
  connectionStatus: 'disconnected',
  errorMessage: null,

  setUserName: (name) => {
    localStorage.setItem('collab_user_name', name);
    set({ userName: name });
  },

  setConnectionStatus: (status, error) =>
    set({
      connectionStatus: status,
      errorMessage: error || null,
    }),

  updateRemoteCursor: (cursor) =>
    set((state) => {
      const nextMap = new Map(state.remoteCursors);
      nextMap.set(cursor.clientId, cursor);
      return { remoteCursors: nextMap };
    }),

  removeRemoteCursor: (clientId) =>
    set((state) => {
      const nextMap = new Map(state.remoteCursors);
      nextMap.delete(clientId);
      return { remoteCursors: nextMap };
    }),

  clearRemoteCursors: () => set({ remoteCursors: new Map() }),
}));
