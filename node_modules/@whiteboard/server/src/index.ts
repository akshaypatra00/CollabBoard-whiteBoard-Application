import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { registerSocketHandlers } from './sockets/socket.handler.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();
    const server = http.createServer(app);

    const io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 30000,
      pingInterval: 10000,
    });

    io.on('connection', (socket) => {
      registerSocketHandlers(io, socket);
    });

    server.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        io.close();
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal server startup error', error);
    process.exit(1);
  }
};

startServer();
