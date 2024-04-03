import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkIfCanCompleteOrder: preHandlerAsyncHookHandler =
  async function checkIfCanCompleteOrder(request) {
    const params = request.body as { botChatId: string };

    const { botChatId } = params;

    const count = await this.prisma.order.count({
      where: {
        user: {
          botChatId: Number(botChatId),
        },
        status: 'ACTIVE',
      },
    });

    if (count > 0) {
      throw new OrderError('cannot-complete-active-order');
    }
  };
