import { z } from 'zod';
import { BoardIdSchema } from './board.schema.js';
import {
  WhiteboardElementSchema,
  WhiteboardElementsArraySchema,
} from './element.schema.js';

export const JoinBoardSchema = z.object({
  boardId: BoardIdSchema,
  clientId: z.string().min(1).max(64),
  userName: z.string().min(1).max(50),
  userColor: z.string().min(3).max(30),
});

export const ElementCreateEventSchema = z.object({
  boardId: BoardIdSchema,
  element: WhiteboardElementSchema,
});

export const ElementUpdateEventSchema = z.object({
  boardId: BoardIdSchema,
  elements: WhiteboardElementsArraySchema,
});

export const ElementDeleteEventSchema = z.object({
  boardId: BoardIdSchema,
  elementIds: z.array(z.string().min(1).max(64)).max(500),
});

export const BoardClearEventSchema = z.object({
  boardId: BoardIdSchema,
});

export const BoardMetadataUpdateEventSchema = z.object({
  boardId: BoardIdSchema,
  title: z.string().min(1).max(100),
});

export const CursorMoveEventSchema = z.object({
  boardId: BoardIdSchema,
  clientId: z.string().min(1).max(64),
  userName: z.string().min(1).max(50),
  userColor: z.string().min(3).max(30),
  x: z.number().finite(),
  y: z.number().finite(),
});
