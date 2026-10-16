import { z } from 'zod';
import { WhiteboardElementsArraySchema } from './element.schema.js';
export const BoardIdSchema = z
    .string()
    .min(6)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/);
export const CreateBoardSchema = z.object({
    title: z.string().min(1).max(100).optional(),
});
export const UpdateBoardMetadataSchema = z.object({
    title: z.string().min(1).max(100),
});
export const SaveBoardElementsSchema = z.object({
    elements: WhiteboardElementsArraySchema,
});
//# sourceMappingURL=board.schema.js.map