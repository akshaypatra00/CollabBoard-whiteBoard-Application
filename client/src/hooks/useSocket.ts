import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  SOCKET_EVENTS,
  WhiteboardElement,
  RemoteCursor,
  BoardStatePayload,
  ElementCreatePayload,
  ElementUpdatePayload,
  ElementDeletePayload,
  BoardMetadataUpdatePayload,
  CursorMovePayload,
  ClientLeftPayload,
} from '@whiteboard/shared';
import { useBoardStore } from '../store/useBoardStore.js';
import { useCollaborationStore } from '../store/useCollaborationStore.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const useSocket = (boardId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { clientId, userName, userColor, setConnectionStatus, updateRemoteCursor, removeRemoteCursor } =
    useCollaborationStore();
  const {
    setBoard,
    applyRemoteUpdates,
    applyRemoteDelete,
    clearBoard,
    setBoardTitle,
  } = useBoardStore();

  useEffect(() => {
    if (!boardId) return;

    setConnectionStatus('connecting');
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit(SOCKET_EVENTS.JOIN_BOARD, {
        boardId,
        clientId,
        userName,
        userColor,
      });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      setConnectionStatus('error', error.message);
    });

    socket.on(SOCKET_EVENTS.BOARD_STATE, (state: BoardStatePayload) => {
      setBoard(state.boardId, state.title, state.elements);
    });

    socket.on(SOCKET_EVENTS.ELEMENT_CREATE, (data: ElementCreatePayload) => {
      applyRemoteUpdates([data.element]);
    });

    socket.on(SOCKET_EVENTS.ELEMENT_UPDATE, (data: ElementUpdatePayload) => {
      applyRemoteUpdates(data.elements);
    });

    socket.on(SOCKET_EVENTS.ELEMENT_DELETE, (data: ElementDeletePayload) => {
      applyRemoteDelete(data.elementIds);
    });

    socket.on(SOCKET_EVENTS.BOARD_CLEAR, () => {
      clearBoard();
    });

    socket.on(SOCKET_EVENTS.BOARD_METADATA_UPDATE, (data: BoardMetadataUpdatePayload) => {
      setBoardTitle(data.title);
    });

    socket.on(SOCKET_EVENTS.CURSOR_MOVE, (cursor: CursorMovePayload) => {
      if (cursor.clientId === clientId) return;
      const remoteCursor: RemoteCursor = {
        clientId: cursor.clientId,
        userName: cursor.userName,
        userColor: cursor.userColor,
        x: cursor.x,
        y: cursor.y,
        lastSeen: Date.now(),
      };
      updateRemoteCursor(remoteCursor);
    });

    socket.on(SOCKET_EVENTS.CLIENT_LEFT, (data: ClientLeftPayload) => {
      removeRemoteCursor(data.clientId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    boardId,
    clientId,
    userName,
    userColor,
    setConnectionStatus,
    setBoard,
    applyRemoteUpdates,
    applyRemoteDelete,
    clearBoard,
    setBoardTitle,
    updateRemoteCursor,
    removeRemoteCursor,
  ]);

  const emitCreateElement = useCallback(
    (element: WhiteboardElement) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(SOCKET_EVENTS.ELEMENT_CREATE, { boardId, element });
      }
    },
    [boardId]
  );

  const emitUpdateElements = useCallback(
    (elements: WhiteboardElement[]) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(SOCKET_EVENTS.ELEMENT_UPDATE, { boardId, elements });
      }
    },
    [boardId]
  );

  const emitDeleteElements = useCallback(
    (elementIds: string[]) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(SOCKET_EVENTS.ELEMENT_DELETE, { boardId, elementIds });
      }
    },
    [boardId]
  );

  const emitClearBoard = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(SOCKET_EVENTS.BOARD_CLEAR, { boardId });
    }
  }, [boardId]);

  const emitUpdateTitle = useCallback(
    (title: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(SOCKET_EVENTS.BOARD_METADATA_UPDATE, { boardId, title });
      }
    },
    [boardId]
  );

  const emitCursorMove = useCallback(
    (x: number, y: number) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(SOCKET_EVENTS.CURSOR_MOVE, {
          boardId,
          clientId,
          userName,
          userColor,
          x,
          y,
        });
      }
    },
    [boardId, clientId, userName, userColor]
  );

  return {
    emitCreateElement,
    emitUpdateElements,
    emitDeleteElements,
    emitClearBoard,
    emitUpdateTitle,
    emitCursorMove,
  };
};
