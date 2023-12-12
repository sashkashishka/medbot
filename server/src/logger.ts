import { pino, LoggerOptions } from 'pino';

function getLogger() {
  const options: LoggerOptions = {
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  };
  if (process.env.NODE_ENV === 'production') {
    options.transport = {
      target: 'pino/file',
      options: {
        destination: './logs/runtime.log',
      },
    };
  }
  return pino(options);
}

export const logger = getLogger();
export const medbotLogger = logger.child({ medbot: true });
