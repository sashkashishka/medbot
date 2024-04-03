import type { RouteOptions } from 'fastify';
import { checkIfCanCompleteOrder } from '../../hooks/checkIfCanCompleteOrder.js';

interface iParams {
  orderType: 'one-time' | 'subscription';
}

interface iBody {
  userId: number;
  botChatId: number;
}

export const tgCompleteOrderRoute: RouteOptions = {
  method: 'PATCH',
  url: '/bot/order/complete/:orderType',
  schema: {
    params: {
      type: 'object',
      properties: {
        orderType: { type: 'string', enum: ['one-time', 'subscription'] },
      },
    },
    body: {
      type: 'object',
      required: ['botChatId'],
      properties: {
        userId: { type: 'number' },
        botChatId: { type: 'number' },
      },
    },
  },
  preHandler: [checkIfCanCompleteOrder],
  async handler(req) {
    const params = req.params as iParams;
    const body = req.body as iBody;

    let tgAction = this.medbotSdk.completeOneTimeOrder;

    if (params.orderType === 'subscription') {
      tgAction = this.medbotSdk.completeSubscriptionOrder;
    }

    await Promise.all([
      this.prisma.telegrafSessions.deleteMany({
        where: {
          key: `${body.userId}:${body.botChatId}`,
        },
      }),
      tgAction(body.botChatId),
    ]);

    return { done: true };
  },
};
