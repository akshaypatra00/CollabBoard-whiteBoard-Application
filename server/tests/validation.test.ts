import { describe, it, expect } from 'vitest';
import {
  WhiteboardElementSchema,
  BoardIdSchema,
  JoinBoardSchema,
  ElementCreateEventSchema,
  CursorMoveEventSchema,
} from '@whiteboard/shared';

describe('Schema and Payload Validation', () => {
  it('validates rectangle element successfully', () => {
    const validRect = {
      id: 'rect-12345',
      type: 'rectangle',
      x: 100,
      y: 150,
      width: 200,
      height: 100,
      strokeColor: '#1e1e1e',
      fillColor: '#ffc9c9',
      strokeWidth: 4,
      strokeStyle: 'dashed',
      opacity: 80,
      rotation: 0,
      version: 1,
      updatedAt: 1700000000000,
    };

    const result = WhiteboardElementSchema.safeParse(validRect);
    expect(result.success).toBe(true);
  });

  it('validates text element with specific properties', () => {
    const validText = {
      id: 'text-12345',
      type: 'text',
      x: 50,
      y: 50,
      width: 120,
      height: 30,
      text: 'Hello World',
      fontSize: 24,
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 1,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: 1700000000000,
    };

    const result = WhiteboardElementSchema.safeParse(validText);
    expect(result.success).toBe(true);
  });

  it('rejects pencil elements exceeding max point limit', () => {
    const excessivePoints = Array.from({ length: 3001 }, (_, i) => ({
      x: i,
      y: i,
    }));

    const invalidPencil = {
      id: 'pencil-oversized',
      type: 'pencil',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      points: excessivePoints,
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 2,
      strokeStyle: 'solid',
      opacity: 100,
      rotation: 0,
      version: 1,
      updatedAt: 1700000000000,
    };

    const result = WhiteboardElementSchema.safeParse(invalidPencil);
    expect(result.success).toBe(false);
  });

  it('validates board IDs and rejects invalid format', () => {
    expect(BoardIdSchema.safeParse('validBoard_123').success).toBe(true);
    expect(BoardIdSchema.safeParse('ab').success).toBe(false);
    expect(BoardIdSchema.safeParse('bad/board/id').success).toBe(false);
    expect(BoardIdSchema.safeParse('bad?query=1').success).toBe(false);
  });

  it('validates socket event payloads', () => {
    const joinPayload = {
      boardId: 'testBoard123',
      clientId: 'client-1',
      userName: 'Alice',
      userColor: '#e03131',
    };
    expect(JoinBoardSchema.safeParse(joinPayload).success).toBe(true);

    const cursorPayload = {
      boardId: 'testBoard123',
      clientId: 'client-1',
      userName: 'Alice',
      userColor: '#e03131',
      x: 100.5,
      y: 200.5,
    };
    expect(CursorMoveEventSchema.safeParse(cursorPayload).success).toBe(true);

    const invalidCreate = {
      boardId: 'testBoard123',
      element: { invalid: true },
    };
    expect(ElementCreateEventSchema.safeParse(invalidCreate).success).toBe(false);
  });
});
