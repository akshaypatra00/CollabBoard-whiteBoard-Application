import { BoardService } from '../services/board.service.js';
import { logger } from '../utils/logger.js';
export class SocketManager {
    static rooms = new Map();
    static socketToBoard = new Map();
    static getRoom(boardId) {
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
    static addClient(boardId, socketId, client) {
        const room = this.getRoom(boardId);
        room.clients.set(client.clientId, {
            ...client,
            socketId,
        });
        this.socketToBoard.set(socketId, boardId);
    }
    static removeClient(socketId) {
        const boardId = this.socketToBoard.get(socketId);
        if (!boardId) {
            return null;
        }
        this.socketToBoard.delete(socketId);
        const room = this.rooms.get(boardId);
        if (!room) {
            return null;
        }
        let removedClientId = null;
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
    static isClientInBoard(socketId, boardId) {
        const currentBoard = this.socketToBoard.get(socketId);
        return currentBoard === boardId;
    }
    static queuePendingUpdates(boardId, elements) {
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
    static async flushPendingSaves(boardId) {
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
        }
        catch (error) {
            logger.error(`Error saving pending updates for board ${boardId}`, error);
        }
    }
    static getActiveClients(boardId) {
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
