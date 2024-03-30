import { type FastifyInstance } from 'fastify';
import { product } from './product.js';
import { existingAdmin } from './existingAdmin.js';
import { ONE_TIME_ORDER } from './oneTimeOrder.js';
import { subscriptionOrderActive } from './subscriptionOrder-active.js';
import { user, user2 } from './user.js';

const SCENARIOS = {
  product,
  existingAdmin,
  oneTimeOrderActive: ONE_TIME_ORDER.active,
  oneTimeOrderWaitingForPayment: ONE_TIME_ORDER.waitingForPayment,
  subscriptionOrderActive,
  user,
  user2,
};

export type tScenario = keyof typeof SCENARIOS;

export interface iOptions<T extends FastifyInstance> {
  fastify: T;
  request: (...args: any[]) => Promise<any>;
  scenarios?: Array<tScenario>;
}

export async function applyScenario<T extends FastifyInstance>({
  fastify,
  scenarios = ['product'],
  request,
}: iOptions<T>) {
  return scenarios.reduce(
    (acc, scene) => acc.then(() => SCENARIOS[scene](fastify, request)),
    Promise.resolve(),
  );
}
