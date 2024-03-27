import { type FastifyInstance } from 'fastify';
import { user as userFixture } from '../fixtures/user.js';

export async function user(fastify: FastifyInstance) {
  await fastify.prisma.user.create({
    data: userFixture,
  });
}
