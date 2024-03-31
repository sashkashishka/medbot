import type { preHandlerAsyncHookHandler } from 'fastify';
import { UserError } from '../utils/errors.js';

export const checkIsUserExists: preHandlerAsyncHookHandler =
  async function checkIsUserExists(request) {
    const params = request.params as { userId: string };

    const count = await this.prisma.user.count({
      where: {
        id: Number(params.userId),
      },
    });

    if (count === 0) {
      throw new UserError('user-not-exists');
    }
  };
