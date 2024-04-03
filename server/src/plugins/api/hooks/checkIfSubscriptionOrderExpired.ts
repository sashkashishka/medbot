import type { preHandlerAsyncHookHandler } from 'fastify';
import { isPast, isValid } from 'date-fns';
import { SubscriptionOrderExpired } from '../utils/errors.js';

export const checkIfSubscriptionOrderExpired: preHandlerAsyncHookHandler =
  async function checkIfSubscriptionOrderExpired(request) {
    const subscriptionEndsAt = request.$order?.subscriptionEndsAt;

    if (isValid(new Date(subscriptionEndsAt)) && isPast(subscriptionEndsAt)) {
      throw new SubscriptionOrderExpired(request.$order);
    }
  };

export const checkIfSubscriptionOrderExpired2: preHandlerAsyncHookHandler =
  async function checkIfSubscriptionOrderExpired2(request) {
    const params = request.params as { userId: string };

    const order = await this.prisma.order.findFirst({
      where: {
        user: { id: Number(params.userId) },
        status: 'ACTIVE',
        subscriptionEndsAt: {
          not: null,
          lt: new Date().toISOString(),
        },
      },
    });

    if (order) {
      throw new SubscriptionOrderExpired(order);
    }
  };
