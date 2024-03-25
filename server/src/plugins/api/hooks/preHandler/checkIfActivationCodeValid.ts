import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { OrderError } from '../../utils/errors.js';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $activationCode?: Prisma.ActivationCodeUncheckedCreateInput;
  }
}

export const checkIfActivationCodeValid: preHandlerAsyncHookHandler =
  async function checkIfActivationCodeValid(request) {
    const params = request.params as { code: string };

    const code = await this.prisma.activationCode.findFirst({
      where: {
        code: Number(params.code),
      },
    });

    if (!code) {
      throw new OrderError('invalid-activation-code');
    }

    request.$activationCode = code;
  };
