import type { preHandlerAsyncHookHandler } from 'fastify';

export const validateIsMedbot: preHandlerAsyncHookHandler =
  async function validateIsMedbot(req) {
    const headers = req.headers;
    const token = headers['x-token'];

    if (this.config.TG_BOT_TOKEN !== token) {
      throw new Error('Invalid token');
    }
  };
