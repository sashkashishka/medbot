import path from 'node:path';
import { pino, type LoggerOptions } from 'pino';

function getLogger() {
  const options: LoggerOptions = {
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  };
  if (process.env.NODE_ENV === 'production') {
    options.transport = {
      target: 'pino/file',
      options: {
        destination: path.resolve(import.meta.dirname, `logs/fastify/runtime.log`),
      },
    };
  }
  return pino(options);
}

export const logger = getLogger();
export const medbotLogger = logger.child({ medbot: true });
