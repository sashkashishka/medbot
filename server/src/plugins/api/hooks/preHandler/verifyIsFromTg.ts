import type { preHandlerAsyncHookHandler } from 'fastify';

export const verifyIsFromTg: preHandlerAsyncHookHandler =
  async function verifyIsFromTg(req) {
    const headers = req.headers;
    const token = headers['x-token'];

    if (this.config.TG_BOT_TOKEN !== token) {
      throw new Error('Invalid token');
    }
  };
