import { createHmac } from 'node:crypto';
import type { preHandlerAsyncHookHandler } from 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $tgQueryId?: string;
  }
}

export const tgHashValidator: preHandlerAsyncHookHandler =
  async function tgHashValidator(req) {
    const headers = req.headers;
    const urlParams = new URLSearchParams(headers['x-webapp-info'] as string);

    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secret = createHmac('sha256', 'WebAppData').update(
      this.config.TG_BOT_TOKEN,
    );
    const calculatedHash = createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new Error('Hash validation failed');
    }

    req.$tgQueryId = urlParams.get('query_id');
  };

export const verifyIsFromTg: preHandlerAsyncHookHandler =
  async function verifyIsFromTg(req) {
    const headers = req.headers;
    const token = headers['x-token'];

    if (this.config.TG_BOT_TOKEN !== token) {
      throw new Error('Invalid token');
    }
  };

export const verifyJwt: preHandlerAsyncHookHandler = async function verifyJwt(
  req,
) {
  // TODO verify token via JWT or something else
  // ...
};
