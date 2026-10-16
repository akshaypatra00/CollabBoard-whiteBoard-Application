import { z } from 'zod';

export const StrokeStyleSchema = z.enum(['solid', 'dashed', 'dotted']);
export const TextAlignSchema = z.enum(['left', 'center', 'right']);

export const PointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  pressure: z.number().min(0).max(1).optional(),
});

const colorRegex = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|transparent)$/;

export const BaseElementSchema = z.object({
  id: z.string().min(1).max(64),
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite(),
  height: z.number().finite(),
  strokeColor: z.string().regex(colorRegex).default('#1e1e1e'),
  fillColor: z.string().regex(colorRegex).default('transparent'),
  strokeWidth: z.number().min(1).max(32).default(2),
  strokeStyle: StrokeStyleSchema.default('solid'),
  opacity: z.number().min(0).max(100).default(100),
  rotation: z.number().finite().default(0),
  version: z.number().int().nonnegative().default(1),
  updatedAt: z.number().int().positive().default(() => Date.now()),
  isDeleted: z.boolean().optional(),
});

export const RectangleElementSchema = BaseElementSchema.extend({
  type: z.literal('rectangle'),
  borderRadius: z.number().min(0).max(100).optional(),
});

export const EllipseElementSchema = BaseElementSchema.extend({
  type: z.literal('ellipse'),
});

export const LineElementSchema = BaseElementSchema.extend({
  type: z.literal('line'),
  points: z.tuple([PointSchema, PointSchema]),
});

export const ArrowElementSchema = BaseElementSchema.extend({
  type: z.literal('arrow'),
  points: z.tuple([PointSchema, PointSchema]),
});

export const PencilElementSchema = BaseElementSchema.extend({
  type: z.literal('pencil'),
  points: z.array(PointSchema).min(1).max(3000),
});

export const TextElementSchema = BaseElementSchema.extend({
  type: z.literal('text'),
  text: z.string().max(10000),
  fontSize: z.number().min(8).max(128).default(20),
  fontFamily: z.string().max(64).default('sans-serif'),
  textAlign: TextAlignSchema.default('left'),
});

export const WhiteboardElementSchema = z.discriminatedUnion('type', [
  RectangleElementSchema,
  EllipseElementSchema,
  LineElementSchema,
  ArrowElementSchema,
  PencilElementSchema,
  TextElementSchema,
]);

export const WhiteboardElementsArraySchema = z.array(WhiteboardElementSchema).max(10000);
