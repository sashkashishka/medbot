import type { preHandlerAsyncHookHandler } from 'fastify';
import { UserError } from '../../utils/errors.js';

export const checkUserExists: preHandlerAsyncHookHandler =
  async function checkUserExists(request) {
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
