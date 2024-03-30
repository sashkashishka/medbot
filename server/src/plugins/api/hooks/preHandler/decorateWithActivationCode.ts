import type { Prisma } from '@prisma/client';
import type { preHandlerAsyncHookHandler } from 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $activationCode?: Prisma.ActivationCodeUncheckedCreateInput;
  }
}

export const decorateWithActivationCode: preHandlerAsyncHookHandler =
  async function decorateWithActivationCode(request) {
    const source = request.params as { code: string };

    const code = await this.prisma.activationCode.findFirst({
      where: {
        code: Number(source.code),
      },
    });

    request.$activationCode = code;
  };
