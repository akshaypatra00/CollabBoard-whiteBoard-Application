import { RemoteCursor, WhiteboardElement } from '@whiteboard/shared';
import { BoardService } from '../services/board.service.js';
import { logger } from '../utils/logger.js';

interface RoomClient {
  socketId: string;
  clientId: string;
  userName: string;
  userColor: string;
}

interface RoomData {
  boardId: string;
  clients: Map<string, RoomClient>;
  pendingUpdates: Map<string, WhiteboardElement>;
  saveTimeout: NodeJS.Timeout | null;
}

export class SocketManager {
  private static rooms = new Map<string, RoomData>();
  private static socketToBoard = new Map<string, string>();

  public static getRoom(boardId: string): RoomData {
    let room = this.rooms.get(boardId);
    if (!room) {
      room = {
        boardId,
        clients: new Map(),
        pendingUpdates: new Map(),
        saveTimeout: null,
      };
      this.rooms.set(boardId, room);
    }
    return room;
  }

  public static addClient(
    boardId: string,
    socketId: string,
    client: { clientId: string; userName: string; userColor: string }
  ): void {
    const room = this.getRoom(boardId);
    room.clients.set(client.clientId, {
      ...client,
      socketId,
    });
    this.socketToBoard.set(socketId, boardId);
  }

  public static removeClient(
    socketId: string
  ): { boardId: string; clientId: string } | null {
    const boardId = this.socketToBoard.get(socketId);
    if (!boardId) {
      return null;
    }

    this.socketToBoard.delete(socketId);
    const room = this.rooms.get(boardId);
    if (!room) {
      return null;
    }

    let removedClientId: string | null = null;
    for (const [cId, client] of room.clients.entries()) {
      if (client.socketId === socketId) {
        removedClientId = cId;
        room.clients.delete(cId);
        break;
      }
    }

    if (room.clients.size === 0) {
      this.flushPendingSaves(boardId);
      this.rooms.delete(boardId);
    }

    return removedClientId ? { boardId, clientId: removedClientId } : null;
  }

  public static isClientInBoard(socketId: string, boardId: string): boolean {
    const currentBoard = this.socketToBoard.get(socketId);
    return currentBoard === boardId;
  }

  public static queuePendingUpdates(
    boardId: string,
    elements: WhiteboardElement[]
  ): void {
    const room = this.getRoom(boardId);
    for (const elem of elements) {
      room.pendingUpdates.set(elem.id, elem);
    }

    if (room.saveTimeout) {
      clearTimeout(room.saveTimeout);
    }

    room.saveTimeout = setTimeout(() => {
      this.flushPendingSaves(boardId);
    }, 1500);
  }

  public static async flushPendingSaves(boardId: string): Promise<void> {
    const room = this.rooms.get(boardId);
    if (!room || room.pendingUpdates.size === 0) {
      return;
    }

    const updates = Array.from(room.pendingUpdates.values());
    room.pendingUpdates.clear();
    room.saveTimeout = null;

    try {
      await BoardService.applyElementUpdates(boardId, updates);
      logger.debug(`Flushed ${updates.length} element updates to database for board ${boardId}`);
    } catch (error) {
      logger.error(`Error saving pending updates for board ${boardId}`, error);
    }
  }

  public static getActiveClients(boardId: string): RemoteCursor[] {
    const room = this.rooms.get(boardId);
    if (!room) {
      return [];
    }

    return Array.from(room.clients.values()).map((c) => ({
      clientId: c.clientId,
      userName: c.userName,
      userColor: c.userColor,
      x: 0,
      y: 0,
      lastSeen: Date.now(),
    }));
  }
}
