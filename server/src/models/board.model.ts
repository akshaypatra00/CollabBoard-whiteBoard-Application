import mongoose, { Document, Model, Schema } from 'mongoose';
import { WhiteboardElement } from '@whiteboard/shared';

export interface IBoardDocument extends Document {
  boardId: string;
  title: string;
  elements: WhiteboardElement[];
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoardDocument>(
  {
    boardId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Board',
      trim: true,
      maxlength: 100,
    },
    elements: {
      type: [Schema.Types.Mixed],
      default: [],
    } as unknown as WhiteboardElement[],
    schemaVersion: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BoardModel: Model<IBoardDocument> = mongoose.model<IBoardDocument>(
  'Board',
  BoardSchema
);
