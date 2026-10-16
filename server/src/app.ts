import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { globalRateLimiter } from './middleware/rate-limiter.middleware.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { healthRouter } from './routes/health.routes.js';
import { boardRouter } from './routes/board.routes.js';

export const createApp = (): Express => {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  const allowedOrigins = [env.CORS_ORIGIN, env.CLIENT_URL, 'http://localhost:5173'];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(globalRateLimiter);

  app.use('/api', healthRouter);
  app.use('/api/boards', boardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
