import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../../utils/errors.js';

export const cannotUpdateDoneOrder: preHandlerAsyncHookHandler =
  async function cannotUpdateDoneOrder(request) {
    if (request.$order?.status === 'DONE') {
      throw new OrderError('cannot-update-not-active-order');
    }
  };
