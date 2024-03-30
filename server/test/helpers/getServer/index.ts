import type { Prisma } from '@prisma/client';
import { type Test } from 'tap';
import { main } from '../../../src/server.js';
import { medbotPluginMock } from './plugins/medbotPlugin.js';
import { googleCalendarPluginMock } from './plugins/googleCalendarPlugin.js';
import { applyScenario, type tScenario } from './scenarios/index.js';
import { admin } from './fixtures/admin.js';

interface iOptions {
  t: Test;
  scenarios?: Array<tScenario>;
}

interface iRequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
  cookie?: string;
}

const webAppHeader = { 'x-webapp-info': process.env.X_WEBAPP_INFO! };

export async function getServer({ t, scenarios }: iOptions) {
  const fastify = await main({
    plugins: {
      medbot: medbotPluginMock,
      googleCalendar: googleCalendarPluginMock,
    },
  });

  const port = fastify.config.PORT;

  function request(endpoint: string, options: iRequestOptions = {}) {
    const { headers, body, cookie } = options;

    return fetch(`http://127.0.0.1:${port}${endpoint}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        cookie: cookie ? cookie : '',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  await applyScenario({ fastify, scenarios, request });

  async function adminCookie() {
    const { headers } = await request('/api/auth/admin/login', {
      method: 'POST',
      body: admin,
    });

    return headers.get('set-cookie')!;
  }

  async function getProducts(): Promise<Prisma.ProductUncheckedCreateInput[]> {
    const resp = await request('/api/product/list', {
      method: 'GET',
      headers: webAppHeader,
    });

    return resp.json() as Promise<Prisma.ProductUncheckedCreateInput[]>;
  }

  async function findOrder(
    filter: (order: Prisma.OrderUncheckedCreateInput) => boolean,
  ) {
    const cookieHeader = await adminCookie();

    const orderListResp = await request('/api/admin/order/list', {
      cookie: cookieHeader,
    });
    const orderList = (await orderListResp.json()) as {
      items: Prisma.OrderUncheckedCreateInput[];
    };
    return orderList.items.find(filter);
  }

  return {
    fastify,
    request,
    async cleanup() {
      await fastify.prisma.appointment.deleteMany();
      await fastify.prisma.activationCode.deleteMany();
      await fastify.prisma.order.deleteMany();
      await fastify.prisma.product.deleteMany();
      await fastify.prisma.user.deleteMany();

      await fastify.prisma.$transaction([
        fastify.prisma.admin.deleteMany(),
        fastify.prisma.telegrafSessions.deleteMany(),
      ]);

      await fastify.close();
    },
    adminCookie,
    webAppHeader,
    getProducts,
    findOrder,
  };
}
