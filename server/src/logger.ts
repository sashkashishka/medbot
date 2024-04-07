import { pino, type LoggerOptions } from 'pino';

function getLogger() {
  const options: LoggerOptions = {
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  };
  // if (process.env.NODE_ENV === 'production') {
  //   options.transport = {
  //     target: 'pino/file',
  //     options: {
  //       destination: `./logs/fastify/runtime-${process.env.ENV}.log`,
  //     },
  //   };
  // }
  return pino(options);
}

export const logger = getLogger();
export const medbotLogger = logger.child({ medbot: true });
