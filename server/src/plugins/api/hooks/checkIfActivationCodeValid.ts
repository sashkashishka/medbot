import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';

export const checkIfActivationCodeValid: preHandlerAsyncHookHandler =
  async function checkIfActivationCodeValid(request) {
    if (!request.$activationCode) {
      throw new OrderError('invalid-activation-code');
    }
  };
