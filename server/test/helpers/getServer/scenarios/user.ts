import { type FastifyInstance } from 'fastify';
import {
  user as userFixture,
  user2 as userFixture2,
} from '../fixtures/user.js';

const fixtures = [userFixture, userFixture2];

export function user(fastify: FastifyInstance, fixtureId: number) {
  return fastify.prisma.user.create({
    data: fixtures[fixtureId],
  });
}
