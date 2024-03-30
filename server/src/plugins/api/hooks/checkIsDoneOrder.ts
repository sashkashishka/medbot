import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkIsDoneOrder: preHandlerAsyncHookHandler =
  async function checkIsDoneOrder(request) {
    if (request.$order?.status === 'DONE') {
      throw new OrderError('cannot-update-not-active-order');
    }
  };
