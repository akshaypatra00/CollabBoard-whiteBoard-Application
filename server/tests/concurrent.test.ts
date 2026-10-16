import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BoardService } from '../src/services/board.service.js';
import { SocketManager } from '../src/sockets/socket.manager.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { RectangleElement } from '@whiteboard/shared';

describe('Concurrent Updates and Room Isolation', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('applies Last-Write-Wins (LWW) conflict resolution policy', async () => {
    const board = await BoardService.createBoard('Concurrent Test Board');
    const boardId = board.boardId;

    const v1: RectangleElement = {
      id: 'concurrent-rect-1',
      type: 'rectangle',
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: 1000,
    };

    await BoardService.applyElementUpdates(boardId, [v1]);
    let current = await BoardService.getBoard(boardId);
    expect(current?.elements[0].x).toBe(10);
    expect(current?.elements[0].version).toBe(1);

    const v2Newer: RectangleElement = {
      ...v1,
      x: 200,
      version: 2,
      updatedAt: 2000,
    };
    await BoardService.applyElementUpdates(boardId, [v2Newer]);
    current = await BoardService.getBoard(boardId);
    expect(current?.elements[0].x).toBe(200);
    expect(current?.elements[0].version).toBe(2);

    const vStale: RectangleElement = {
      ...v1,
      x: 50,
      version: 1,
      updatedAt: 500,
    };
    await BoardService.applyElementUpdates(boardId, [vStale]);
    current = await BoardService.getBoard(boardId);
    expect(current?.elements[0].x).toBe(200);
    expect(current?.elements[0].version).toBe(2);
  });

  it('enforces board room isolation for connected sockets', () => {
    const socketId1 = 'socket-user-1';
    const socketId2 = 'socket-user-2';

    SocketManager.addClient('board-alpha', socketId1, {
      clientId: 'client-1',
      userName: 'Alice',
      userColor: '#ff0000',
    });

    SocketManager.addClient('board-beta', socketId2, {
      clientId: 'client-2',
      userName: 'Bob',
      userColor: '#00ff00',
    });

    expect(SocketManager.isClientInBoard(socketId1, 'board-alpha')).toBe(true);
    expect(SocketManager.isClientInBoard(socketId1, 'board-beta')).toBe(false);

    expect(SocketManager.isClientInBoard(socketId2, 'board-beta')).toBe(true);
    expect(SocketManager.isClientInBoard(socketId2, 'board-alpha')).toBe(false);

    const removed = SocketManager.removeClient(socketId1);
    expect(removed?.boardId).toBe('board-alpha');
    expect(SocketManager.isClientInBoard(socketId1, 'board-alpha')).toBe(false);
  });
});
