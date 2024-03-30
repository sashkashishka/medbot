import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../utils/errors.js';
import type { iCacheEntity } from '../utils/progressive-delay.js';

export const checkIfBlockedByRateLimiter: preHandlerAsyncHookHandler =
  async function checkIfBlockedByRateLimiter(request) {
    // TODO: check that proper ip is passed. not proxy ip
    const checkResult = this.rateLimiter(request.ip);

    if (checkResult.blockedUntil) {
      throw new OrderError<Pick<iCacheEntity, 'blockedUntil' | 'reason'>>(
        'too-many-requests',
        { blockedUntil: checkResult.blockedUntil, reason: checkResult.reason },
      );
    }
  };
