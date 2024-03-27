import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { UserError } from '../../utils/errors.js';

export const checkDuplicateUser: preHandlerAsyncHookHandler =
  async function checkDuplicateUser(request) {
    const body = request.body as Prisma.UserUncheckedCreateInput;

    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(body.id),
      },
    });

    if (user) {
      throw new UserError('duplicate-user');
    }
  };
