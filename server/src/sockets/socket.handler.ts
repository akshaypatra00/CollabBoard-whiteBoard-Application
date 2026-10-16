import { Server, Socket } from 'socket.io';
import {
  SOCKET_EVENTS,
  JoinBoardSchema,
  ElementCreateEventSchema,
  ElementUpdateEventSchema,
  ElementDeleteEventSchema,
  BoardClearEventSchema,
  BoardMetadataUpdateEventSchema,
  CursorMoveEventSchema,
} from '@whiteboard/shared';
import { BoardService } from '../services/board.service.js';
import { SocketManager } from './socket.manager.js';
import { logger } from '../utils/logger.js';

export const registerSocketHandlers = (io: Server, socket: Socket): void => {
  logger.debug(`Socket connected: ${socket.id}`);

  socket.on(SOCKET_EVENTS.JOIN_BOARD, async (data: unknown) => {
    const parseResult = JoinBoardSchema.safeParse(data);
    if (!parseResult.success) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'INVALID_JOIN_PAYLOAD',
        message: 'Invalid payload for joining board',
      });
      return;
    }

    const { boardId, clientId, userName, userColor } = parseResult.data;

    try {
      let board = await BoardService.getBoard(boardId);
      if (!board) {
        board = await BoardService.createBoard('Untitled Board');
      }

      await socket.join(boardId);
      SocketManager.addClient(boardId, socket.id, {
        clientId,
        userName,
        userColor,
      });

      socket.emit(SOCKET_EVENTS.BOARD_STATE, {
        boardId: board.boardId,
        title: board.title,
        elements: board.elements,
        schemaVersion: board.schemaVersion,
        updatedAt: board.updatedAt.toISOString(),
      });

      logger.info(`Client ${clientId} (${userName}) joined board ${boardId}`);
    } catch (error) {
      logger.error(`Error joining board ${boardId}`, error);
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'JOIN_ERROR',
        message: 'Failed to join whiteboard session',
      });
    }
  });

  socket.on(SOCKET_EVENTS.ELEMENT_CREATE, (data: unknown) => {
    const parseResult = ElementCreateEventSchema.safeParse(data);
    if (!parseResult.success) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'INVALID_ELEMENT_CREATE',
        message: 'Invalid element create payload',
      });
      return;
    }

    const { boardId, element } = parseResult.data;
    if (!SocketManager.isClientInBoard(socket.id, boardId)) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'UNAUTHORIZED_BOARD_ACTION',
        message: 'Not authorized for this board room',
      });
      return;
    }

    SocketManager.queuePendingUpdates(boardId, [element]);
    socket.to(boardId).emit(SOCKET_EVENTS.ELEMENT_CREATE, { boardId, element });
  });

  socket.on(SOCKET_EVENTS.ELEMENT_UPDATE, (data: unknown) => {
    const parseResult = ElementUpdateEventSchema.safeParse(data);
    if (!parseResult.success) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'INVALID_ELEMENT_UPDATE',
        message: 'Invalid element update payload',
      });
      return;
    }

    const { boardId, elements } = parseResult.data;
    if (!SocketManager.isClientInBoard(socket.id, boardId)) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'UNAUTHORIZED_BOARD_ACTION',
        message: 'Not authorized for this board room',
      });
      return;
    }

    SocketManager.queuePendingUpdates(boardId, elements);
    socket.to(boardId).emit(SOCKET_EVENTS.ELEMENT_UPDATE, { boardId, elements });
  });

  socket.on(SOCKET_EVENTS.ELEMENT_DELETE, async (data: unknown) => {
    const parseResult = ElementDeleteEventSchema.safeParse(data);
    if (!parseResult.success) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'INVALID_ELEMENT_DELETE',
        message: 'Invalid element delete payload',
      });
      return;
    }

    const { boardId, elementIds } = parseResult.data;
    if (!SocketManager.isClientInBoard(socket.id, boardId)) {
      socket.emit(SOCKET_EVENTS.SYNC_ERROR, {
        code: 'UNAUTHORIZED_BOARD_ACTION',
        message: 'Not authorized for this board room',
      });
      return;
    }

    try {
      await BoardService.deleteElements(boardId, elementIds);
      socket
        .to(boardId)
        .emit(SOCKET_EVENTS.ELEMENT_DELETE, { boardId, elementIds });
    } catch (error) {
      logger.error(`Error deleting elements in board ${boardId}`, error);
    }
  });

  socket.on(SOCKET_EVENTS.BOARD_CLEAR, async (data: unknown) => {
    const parseResult = BoardClearEventSchema.safeParse(data);
    if (!parseResult.success) {
      return;
    }

    const { boardId } = parseResult.data;
    if (!SocketManager.isClientInBoard(socket.id, boardId)) {
      return;
    }

    try {
      await BoardService.clearBoard(boardId);
      socket.to(boardId).emit(SOCKET_EVENTS.BOARD_CLEAR, { boardId });
    } catch (error) {
      logger.error(`Error clearing board ${boardId}`, error);
    }
  });

  socket.on(SOCKET_EVENTS.BOARD_METADATA_UPDATE, async (data: unknown) => {
    const parseResult = BoardMetadataUpdateEventSchema.safeParse(data);
    if (!parseResult.success) {
      return;
    }

    const { boardId, title } = parseResult.data;
    if (!SocketManager.isClientInBoard(socket.id, boardId)) {
      return;
    }

    try {
      await BoardService.updateBoardMetadata(boardId, title);
      socket
        .to(boardId)
        .emit(SOCKET_EVENTS.BOARD_METADATA_UPDATE, { boardId, title });
    } catch (error) {
      logger.error(`Error updating title in board ${boardId}`, error);
    }
  });

  socket.on(SOCKET_EVENTS.CURSOR_MOVE, (data: unknown) => {
    const parseResult = CursorMoveEventSchema.safeParse(data);
    if (!parseResult.success) {
      return;
    }

    const { boardId } = parseResult.data;
    if (!SocketManager.isClientInBoard(socket.id, boardId)) {
      return;
    }

    socket.to(boardId).emit(SOCKET_EVENTS.CURSOR_MOVE, parseResult.data);
  });

  socket.on('disconnect', () => {
    const removal = SocketManager.removeClient(socket.id);
    if (removal) {
      socket
        .to(removal.boardId)
        .emit(SOCKET_EVENTS.CLIENT_LEFT, { clientId: removal.clientId });
      logger.debug(
        `Client ${removal.clientId} left board ${removal.boardId} on disconnect`
      );
    }
  });
};
