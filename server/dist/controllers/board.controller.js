import { BoardService } from '../services/board.service.js';
import { AppError } from '../middleware/error.middleware.js';
export class BoardController {
    static async createBoard(req, res, next) {
        try {
            const { title } = req.body;
            const board = await BoardService.createBoard(title);
            res.status(201).json({
                success: true,
                data: {
                    id: board.boardId,
                    title: board.title,
                    elements: board.elements,
                    schemaVersion: board.schemaVersion,
                    createdAt: board.createdAt,
                    updatedAt: board.updatedAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getBoard(req, res, next) {
        try {
            const { id } = req.params;
            const board = await BoardService.getBoard(id);
            if (!board) {
                throw new AppError(`Board with ID "${id}" not found`, 404);
            }
            res.status(200).json({
                success: true,
                data: {
                    id: board.boardId,
                    title: board.title,
                    elements: board.elements,
                    schemaVersion: board.schemaVersion,
                    createdAt: board.createdAt,
                    updatedAt: board.updatedAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateBoardMetadata(req, res, next) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const board = await BoardService.updateBoardMetadata(id, title);
            if (!board) {
                throw new AppError(`Board with ID "${id}" not found`, 404);
            }
            res.status(200).json({
                success: true,
                data: {
                    id: board.boardId,
                    title: board.title,
                    updatedAt: board.updatedAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async saveBoardElements(req, res, next) {
        try {
            const { id } = req.params;
            const { elements } = req.body;
            const board = await BoardService.saveElements(id, elements);
            if (!board) {
                throw new AppError(`Board with ID "${id}" not found`, 404);
            }
            res.status(200).json({
                success: true,
                data: {
                    id: board.boardId,
                    elementCount: board.elements.length,
                    updatedAt: board.updatedAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async exportBoard(req, res, next) {
        try {
            const { id } = req.params;
            const board = await BoardService.getBoard(id);
            if (!board) {
                throw new AppError(`Board with ID "${id}" not found`, 404);
            }
            res.setHeader('Content-Disposition', `attachment; filename="whiteboard-${board.boardId}.json"`);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                id: board.boardId,
                title: board.title,
                elements: board.elements,
                schemaVersion: board.schemaVersion,
                exportedAt: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    }
}
