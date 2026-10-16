import { Router } from 'express';
import { isDatabaseConnected } from '../config/db.js';
export const healthRouter = Router();
healthRouter.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: isDatabaseConnected() ? 'connected' : 'disconnected',
    });
});
