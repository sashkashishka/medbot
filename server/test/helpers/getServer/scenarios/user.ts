import { type FastifyInstance } from 'fastify';
import {
  user as userFixture,
  user2 as userFixture2,
} from '../fixtures/user.js';

export async function user(fastify: FastifyInstance) {
  await fastify.prisma.user.create({
    data: userFixture,
  });
}

export async function user2(fastify: FastifyInstance) {
  await fastify.prisma.user.create({
    data: userFixture2,
  });
}
