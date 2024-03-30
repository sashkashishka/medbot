import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../../utils/errors.js';
import { isPast } from 'date-fns';

export const checkIfActivationCodeExpired: preHandlerAsyncHookHandler =
  async function checkIfActivationCodeExpired(request) {
    const code = request.$activationCode;

    if (isPast(code?.invalidAt)) {
      throw new OrderError('code-expired');
    }
  };
