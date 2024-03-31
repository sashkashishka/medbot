import type { Prisma } from '@prisma/client';
import { type Test } from 'tap';
import { main } from '../../../src/server.js';
import { medbotPluginMock } from './plugins/medbotPlugin.js';
import { googleCalendarPluginMock } from './plugins/googleCalendarPlugin.js';
import { applyScenario, type iScenarios } from './scenarios/index.js';
import { admin } from './fixtures/admin.js';

interface iOptions {
  t: Test;
  scenarios?: iScenarios;
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

  async function getUsers(): Promise<Prisma.ProductUncheckedCreateInput[]> {
    const cookieHeader = await adminCookie();
    const resp = await request('/api/admin/user/list?date_sort=asc', {
      cookie: cookieHeader,
    });

    const data = (await resp.json()) as {
      items: Prisma.ProductUncheckedCreateInput[];
    };

    return data.items;
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

  async function getAppointments() {
    const cookieHeader = await adminCookie();

    const appointmentListResp = await request(
      '/api/admin/appointment/list?date_sort=asc',
      {
        cookie: cookieHeader,
      },
    );
    const appointmentList = (await appointmentListResp.json()) as {
      items: Prisma.AppointmentUncheckedCreateInput[];
    };

    return appointmentList.items;
  }

  async function findAppointment(
    filter: (appointment: Prisma.AppointmentUncheckedCreateInput) => boolean,
  ) {
    const list = await getAppointments();

    return list.find(filter);
  }

  async function cleanDB() {
    await fastify.prisma.appointment.deleteMany();
    await fastify.prisma.activationCode.deleteMany();
    await fastify.prisma.order.deleteMany();
    await fastify.prisma.product.deleteMany();
    await fastify.prisma.user.deleteMany();

    await fastify.prisma.$transaction([
      fastify.prisma.admin.deleteMany(),
      fastify.prisma.telegrafSessions.deleteMany(),
    ]);
  }

  async function cleanup() {
    await cleanDB();
    await fastify.close();
  }

  await applyScenario({ fastify, scenarios, request, cleanDB });

  t.teardown(cleanup);

  return {
    fastify,
    request,
    adminCookie,
    webAppHeader,
    getUsers,
    getProducts,
    getAppointments,
    findOrder,
    findAppointment,
  };
}
