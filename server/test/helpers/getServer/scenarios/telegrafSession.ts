import type { Prisma } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

export async function telegrafSession(
  fastify: FastifyInstance,
  user: Prisma.UserUncheckedCreateInput,
) {
  await fastify.prisma.telegrafSessions.create({
    data: {
      key: `${user.id}:${user.botChatId}`,
      session: 'session',
    },
  });
}
