import { type FastifyInstance } from 'fastify';
import { product } from './product.js';
import { admin } from './admin.js';
import { ONE_TIME_ORDER } from './oneTimeOrder.js';
import { SUBSCRIPTION_ORDER } from './subscriptionOrder.js';
import { user, user2 } from './user.js';

const SCENARIOS: Record<string, (...args: any[]) => Promise<any>> = {
  product,
  admin,
  oneTimeOrderActive: ONE_TIME_ORDER.active,
  oneTimeOrderWaitingForPayment: ONE_TIME_ORDER.waitingForPayment,
  oneTimeOrderActiveWithAppointments: ONE_TIME_ORDER.activeWithAppointments,
  oneTimeOrderDone: ONE_TIME_ORDER.done,
  subscriptionOrderActive: SUBSCRIPTION_ORDER.active,
  subscriptionOrderWaitingForPayment: SUBSCRIPTION_ORDER.waitingForPayment,
  subscriptionOrderActiveWithAppointments:
    SUBSCRIPTION_ORDER.activeWithAppointments,
  subscriptionOrderDone: SUBSCRIPTION_ORDER.done,
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
