import { Router } from 'express';
import { z } from 'zod';
import { BoardController } from '../controllers/board.controller.js';
import {
  validateBody,
  validateParams,
} from '../middleware/validate.middleware.js';
import {
  createBoardRateLimiter,
  boardWriteRateLimiter,
} from '../middleware/rate-limiter.middleware.js';
import {
  CreateBoardSchema,
  UpdateBoardMetadataSchema,
  SaveBoardElementsSchema,
  BoardIdSchema,
} from '@whiteboard/shared';

const BoardParamsSchema = z.object({
  id: BoardIdSchema,
});

export const boardRouter = Router();

boardRouter.post(
  '/',
  createBoardRateLimiter,
  validateBody(CreateBoardSchema),
  BoardController.createBoard
);

boardRouter.get(
  '/:id',
  validateParams(BoardParamsSchema),
  BoardController.getBoard
);

boardRouter.patch(
  '/:id',
  validateParams(BoardParamsSchema),
  validateBody(UpdateBoardMetadataSchema),
  BoardController.updateBoardMetadata
);

boardRouter.put(
  '/:id/elements',
  boardWriteRateLimiter,
  validateParams(BoardParamsSchema),
  validateBody(SaveBoardElementsSchema),
  BoardController.saveBoardElements
);

boardRouter.get(
  '/:id/export',
  validateParams(BoardParamsSchema),
  BoardController.exportBoard
);
