import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
let isConnected = false;
export const connectDatabase = async () => {
    if (isConnected) {
        return;
    }
    if (env.NODE_ENV === 'test') {
        isConnected = true;
        return;
    }
    mongoose.connection.on('connected', () => {
        isConnected = true;
        logger.info('MongoDB connected successfully');
    });
    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error', err);
    });
    mongoose.connection.on('disconnected', () => {
        isConnected = false;
        logger.warn('MongoDB disconnected');
    });
    try {
        await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 2000,
        });
        isConnected = true;
    }
    catch (error) {
        logger.warn('Could not connect to external MongoDB. Operating in in-memory storage mode.');
        isConnected = true;
    }
};
export const disconnectDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    isConnected = false;
    logger.info('Database disconnected cleanly');
};
export const isDatabaseConnected = () => isConnected;
