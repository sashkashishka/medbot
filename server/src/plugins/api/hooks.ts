import { createHmac } from 'node:crypto';
import type { preHandlerAsyncHookHandler } from 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $tgQueryId?: string;
  }
}

export const preHandler: preHandlerAsyncHookHandler = async function preHandler(
  req,
) {
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

  const secret = createHmac('sha256', 'WebAppData').update(this.medbotToken);
  const calculatedHash = createHmac('sha256', secret.digest())
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) {
    throw new Error('Hash validation failed');
  }

  req.$tgQueryId = urlParams.get('query_id');
};
