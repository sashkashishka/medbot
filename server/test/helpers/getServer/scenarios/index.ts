import { type FastifyInstance } from 'fastify';
import { product } from './product.js';
import { existingAdmin } from './existingAdmin.js';
import { oneTimeOrderActive } from './oneTimeOrder-active.js';
import { subscriptionOrderActive } from './subscriptionOrder-active.js';
import { user } from './user.js';

const SCENARIOS = {
  product,
  existingAdmin,
  oneTimeOrderActive,
  subscriptionOrderActive,
  user,
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
  return Promise.all(scenarios.map((v) => SCENARIOS[v](fastify, request)));
}
