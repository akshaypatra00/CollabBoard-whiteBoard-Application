import mongoose from 'mongoose';
import { BoardModel } from '../models/board.model.js';
import { generateBoardId } from '../utils/id.js';
const memoryStore = new Map();
const createMemoryDoc = (data) => {
    const doc = {
        boardId: data.boardId,
        title: data.title,
        elements: data.elements || [],
        schemaVersion: data.schemaVersion || 1,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
        markModified: () => { },
        save: async () => {
            doc.updatedAt = new Date();
            memoryStore.set(doc.boardId, doc);
            return doc;
        },
    };
    return doc;
};
export class BoardService {
    static isDbReady() {
        return mongoose.connection.readyState === 1;
    }
    static async createBoard(title) {
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
        return doc;
    }
    static async getBoard(boardId) {
        if (this.isDbReady()) {
            return await BoardModel.findOne({ boardId }).exec();
        }
        const mem = memoryStore.get(boardId);
        return mem ? mem : null;
    }
    static async updateBoardMetadata(boardId, title) {
        const cleanTitle = title.trim();
        if (this.isDbReady()) {
            return await BoardModel.findOneAndUpdate({ boardId }, { $set: { title: cleanTitle } }, { new: true }).exec();
        }
        const mem = memoryStore.get(boardId);
        if (!mem)
            return null;
        mem.title = cleanTitle;
        mem.updatedAt = new Date();
        return mem;
    }
    static async saveElements(boardId, elements) {
        if (this.isDbReady()) {
            return await BoardModel.findOneAndUpdate({ boardId }, { $set: { elements } }, { new: true }).exec();
        }
        const mem = memoryStore.get(boardId);
        if (!mem)
            return null;
        mem.elements = elements;
        mem.updatedAt = new Date();
        return mem;
    }
    static async applyElementUpdates(boardId, incomingElements) {
        const board = await this.getBoard(boardId);
        if (!board) {
            return null;
        }
        const elementMap = new Map();
        for (const elem of board.elements) {
            elementMap.set(elem.id, elem);
        }
        for (const incoming of incomingElements) {
            const existing = elementMap.get(incoming.id);
            if (!existing) {
                elementMap.set(incoming.id, incoming);
            }
            else {
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
    static async deleteElements(boardId, elementIds) {
        const idSet = new Set(elementIds);
        const board = await this.getBoard(boardId);
        if (!board) {
            return null;
        }
        board.elements = board.elements.filter((e) => !idSet.has(e.id));
        board.markModified('elements');
        return await board.save();
    }
    static async clearBoard(boardId) {
        if (this.isDbReady()) {
            return await BoardModel.findOneAndUpdate({ boardId }, { $set: { elements: [] } }, { new: true }).exec();
        }
        const mem = memoryStore.get(boardId);
        if (!mem)
            return null;
        mem.elements = [];
        mem.updatedAt = new Date();
        return mem;
    }
}
