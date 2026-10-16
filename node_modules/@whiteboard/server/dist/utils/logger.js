import { env } from '../config/env.js';
const formatMessage = (level, message, meta) => {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${typeof meta === 'object' ? JSON.stringify(meta) : meta}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
};
export const logger = {
    info: (message, meta) => {
        console.log(formatMessage('info', message, meta));
    },
    warn: (message, meta) => {
        console.warn(formatMessage('warn', message, meta));
    },
    error: (message, meta) => {
        console.error(formatMessage('error', message, meta));
    },
    debug: (message, meta) => {
        if (env.NODE_ENV !== 'production') {
            console.debug(formatMessage('debug', message, meta));
        }
    },
};
