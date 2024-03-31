import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { UserError } from '../utils/errors.js';

export const checkDuplicateUser: preHandlerAsyncHookHandler =
  async function checkDuplicateUser(request) {
    const body = request.body as Prisma.UserUncheckedCreateInput;

    const count = await this.prisma.user.count({
      where: {
        id: Number(body.id),
      },
    });

    if (count > 0) {
      throw new UserError('duplicate-user');
    }
  };
