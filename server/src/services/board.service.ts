import mongoose from 'mongoose';
import { WhiteboardElement } from '@whiteboard/shared';
import { BoardModel, IBoardDocument } from '../models/board.model.js';
import { generateBoardId } from '../utils/id.js';

interface MemoryBoard {
  boardId: string;
  title: string;
  elements: WhiteboardElement[];
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
  markModified: (path: string) => void;
  save: () => Promise<IBoardDocument>;
}

const memoryStore = new Map<string, MemoryBoard>();

const createMemoryDoc = (data: {
  boardId: string;
  title: string;
  elements?: WhiteboardElement[];
  schemaVersion?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): MemoryBoard => {
  const doc: MemoryBoard = {
    boardId: data.boardId,
    title: data.title,
    elements: data.elements || [],
    schemaVersion: data.schemaVersion || 1,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    markModified: () => {},
    save: async () => {
      doc.updatedAt = new Date();
      memoryStore.set(doc.boardId, doc);
      return doc as unknown as IBoardDocument;
    },
  };
  return doc;
};

export class BoardService {
  private static isDbReady(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public static async createBoard(title?: string): Promise<IBoardDocument> {
    const boardId = generateBoardId();
    const cleanTitle = title?.trim() || 'Untitled Board';

    if (this.isDbReady()) {
      const board = new BoardModel({
        boardId,
        title: cleanTitle,
        elements: [],
        schemaVersion: 1,
      });
      return await board.save();
    }

    const doc = createMemoryDoc({ boardId, title: cleanTitle });
    memoryStore.set(boardId, doc);
    return doc as unknown as IBoardDocument;
  }

  public static async getBoard(boardId: string): Promise<IBoardDocument | null> {
    if (this.isDbReady()) {
      return await BoardModel.findOne({ boardId }).exec();
    }
    const mem = memoryStore.get(boardId);
    return mem ? (mem as unknown as IBoardDocument) : null;
  }

  public static async updateBoardMetadata(
    boardId: string,
    title: string
  ): Promise<IBoardDocument | null> {
    const cleanTitle = title.trim();

    if (this.isDbReady()) {
      return await BoardModel.findOneAndUpdate(
        { boardId },
        { $set: { title: cleanTitle } },
        { new: true }
      ).exec();
    }

    const mem = memoryStore.get(boardId);
    if (!mem) return null;
    mem.title = cleanTitle;
    mem.updatedAt = new Date();
    return mem as unknown as IBoardDocument;
  }

  public static async saveElements(
    boardId: string,
    elements: WhiteboardElement[]
  ): Promise<IBoardDocument | null> {
    if (this.isDbReady()) {
      return await BoardModel.findOneAndUpdate(
        { boardId },
        { $set: { elements } },
        { new: true }
      ).exec();
    }

    const mem = memoryStore.get(boardId);
    if (!mem) return null;
    mem.elements = elements;
    mem.updatedAt = new Date();
    return mem as unknown as IBoardDocument;
  }

  public static async applyElementUpdates(
    boardId: string,
    incomingElements: WhiteboardElement[]
  ): Promise<IBoardDocument | null> {
    const board = await this.getBoard(boardId);
    if (!board) {
      return null;
    }

    const elementMap = new Map<string, WhiteboardElement>();
    for (const elem of board.elements) {
      elementMap.set(elem.id, elem);
    }

    for (const incoming of incomingElements) {
      const existing = elementMap.get(incoming.id);
      if (!existing) {
        elementMap.set(incoming.id, incoming);
      } else {
        const incomingVersion = incoming.version ?? 0;
        const existingVersion = existing.version ?? 0;
        const incomingTime = incoming.updatedAt ?? 0;
        const existingTime = existing.updatedAt ?? 0;

        if (incomingVersion > existingVersion || incomingTime >= existingTime) {
          elementMap.set(incoming.id, incoming);
        }
      }
    }

    board.elements = Array.from(elementMap.values()).filter((e) => !e.isDeleted);
    board.markModified('elements');
    return await board.save();
  }

  public static async deleteElements(
    boardId: string,
    elementIds: string[]
  ): Promise<IBoardDocument | null> {
    const idSet = new Set(elementIds);
    const board = await this.getBoard(boardId);
    if (!board) {
      return null;
    }

    board.elements = board.elements.filter((e) => !idSet.has(e.id));
    board.markModified('elements');
    return await board.save();
  }

  public static async clearBoard(boardId: string): Promise<IBoardDocument | null> {
    if (this.isDbReady()) {
      return await BoardModel.findOneAndUpdate(
        { boardId },
        { $set: { elements: [] } },
        { new: true }
      ).exec();
    }

    const mem = memoryStore.get(boardId);
    if (!mem) return null;
    mem.elements = [];
    mem.updatedAt = new Date();
    return mem as unknown as IBoardDocument;
  }
}
