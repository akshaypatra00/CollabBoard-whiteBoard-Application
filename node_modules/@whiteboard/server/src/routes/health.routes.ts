import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../config/db.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
  });
});
