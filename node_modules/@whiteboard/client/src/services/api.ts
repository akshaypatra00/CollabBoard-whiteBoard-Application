import { Board, WhiteboardElement } from '@whiteboard/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const api = {
  createBoard: async (title?: string): Promise<Board> => {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create board (${response.status})`);
    }

    const json: ApiResponse<Board> = await response.json();
    return json.data;
  },

  getBoard: async (id: string): Promise<Board> => {
    const response = await fetch(`${API_BASE_URL}/boards/${id}`);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to load board (${response.status})`);
    }

    const json: ApiResponse<Board> = await response.json();
    return json.data;
  },

  updateMetadata: async (id: string, title: string): Promise<{ id: string; title: string }> => {
    const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update board title (${response.status})`);
    }

    const json: ApiResponse<{ id: string; title: string }> = await response.json();
    return json.data;
  },

  saveElements: async (
    id: string,
    elements: WhiteboardElement[]
  ): Promise<{ id: string; elementCount: number }> => {
    const response = await fetch(`${API_BASE_URL}/boards/${id}/elements`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elements }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save board elements (${response.status})`);
    }

    const json: ApiResponse<{ id: string; elementCount: number }> = await response.json();
    return json.data;
  },
};
