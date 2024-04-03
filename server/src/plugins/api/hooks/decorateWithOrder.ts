import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $order?: Prisma.OrderUncheckedCreateInput;
  }
}

export function createDecorateWithOrder(
  src: 'params' | 'body' | 'query',
): preHandlerAsyncHookHandler {
  return async function decorateWithOrder(request) {
    const source = request[src] as { orderId: string };

    const order = await this.prisma.order.findFirst({
      where: {
        id: Number(source.orderId),
      },
    });

    request.$order = order;
  };
}
