import type { preHandlerAsyncHookHandler } from 'fastify';
import { UserError } from '../utils/errors.js';

export const checkIsUserExists: preHandlerAsyncHookHandler =
  async function checkIsUserExists(request) {
    const params = request.params as { userId: string };

    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(params.userId),
      },
    });

    if (!user) {
      throw new UserError('user-not-exists');
    }
  };
