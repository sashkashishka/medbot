import type { preHandlerAsyncHookHandler } from 'fastify';
import { isPast, isValid } from 'date-fns';
import { OrderError } from '../utils/errors.js';

export const checkIfSubscriptionOrderExpired: preHandlerAsyncHookHandler =
  async function checkIfSubscriptionOrderExpired(request) {
    const subscriptionEndsAt = request.$order?.subscriptionEndsAt;

    if (isValid(new Date(subscriptionEndsAt)) && isPast(subscriptionEndsAt)) {
      throw new OrderError('subscription-expired', { order: request.$order });
    }
  };
