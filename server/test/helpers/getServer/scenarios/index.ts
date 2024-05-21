import { type FastifyInstance } from 'fastify';
import { product } from './product.js';
import { admin } from './admin.js';
import { order, type iOrderMock } from './order.js';
import { user } from './user.js';
import { telegrafSession } from './telegrafSession.js';
import { i18n, type iI18nOptions } from './i18n.js';

interface iUserScenarios {
  order: Omit<iOrderMock, 'userId'>;
  session?: boolean;
}

export interface iScenarios {
  product?: boolean;
  admin?: boolean;
  user?: iUserScenarios[];
  i18n?: iI18nOptions;
}

export interface iOptions<T extends FastifyInstance> {
  fastify: T;
  request: (...args: any[]) => Promise<any>;
  cleanDB: () => Promise<void>;
  scenarios: iScenarios;
}

function scenarioToSeeder(
  scenarios: iScenarios,
  fastify: FastifyInstance,
  request: iOptions<any>['request'],
) {
  return Object.keys(scenarios).reduce<any>((acc, key) => {
    if (!scenarios[key]) return acc;

    if (key === 'product') {
      acc.push(() => product(fastify));
    }

    if (key === 'admin') {
      acc.push(() => admin(fastify, request));
    }

    if (key === 'user') {
      scenarios[key].forEach(({ order: orderOptions, session }, i) => {
        acc.push(async () => {
          const u = await user(fastify, i);
          await Promise.all([
            order(fastify, { userId: i + 1, ...orderOptions }),
            session ? telegrafSession(fastify, u) : Promise.resolve(),
          ]);
        });
      });
    }

    if (key === 'i18n') {
      acc.push(() => i18n(fastify, scenarios[key]));
    }

    return acc;
  }, []);
}

export async function applyScenario<T extends FastifyInstance>({
  fastify,
  scenarios,
  request,
  cleanDB,
}: iOptions<T>) {
  const seeders = scenarioToSeeder(scenarios, fastify, request);

  return seeders.reduce((acc, seeder) => acc.then(seeder), cleanDB());
}
