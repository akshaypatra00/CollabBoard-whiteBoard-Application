import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
export class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: `Endpoint ${req.method} ${req.originalUrl} not found`,
    });
};
export const errorHandler = (err, req, res, _next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal server error';
    logger.error(`Error processing ${req.method} ${req.url}: ${message}`, {
        stack: env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};
