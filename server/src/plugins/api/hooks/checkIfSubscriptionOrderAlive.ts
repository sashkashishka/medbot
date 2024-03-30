import { isFuture } from 'date-fns';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkIfSubscriptionOrderAlive: preHandlerAsyncHookHandler =
  async function checkIfSubscriptionOrderAlive(request) {
    if (isFuture(request.$order?.subscriptionEndsAt)) {
      throw new OrderError('cannot-complete-non-expired-subscription');
    }
  };
