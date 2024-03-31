import t from 'tap';
import type { Prisma } from '@prisma/client';
import fakeTimer from '@sinonjs/fake-timers';
import { addYears, isValid } from 'date-fns';
import { getServer } from '../helpers/getServer/index.js';

const test = t.test;

const order = {
  userId: 1,
};

test('order creation', async (t) => {
  const { request, webAppHeader, getProducts } = await getServer({
    t,
    scenarios: {
      product: true,
      user: [
        {
          order: {
            type: 'none',
            status: 'DONE',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const products = await getProducts();
  const [p1, p2, p3, p4, p5] = products;

  t.test('can create multiple WAITING_FOR_PAYMENT orders', async (t) => {
    const resp = await request('/api/order/create', {
      method: 'POST',
      body: { ...order, productId: p1.id, status: 'WAITING_FOR_PAYMENT' },
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status as order created');
    t.match(
      await resp.json(),
      { productId: p1.id, subscriptionEndsAt: null },
      'should return created order',
    );

    const resp2 = await request('/api/order/create', {
      method: 'POST',
      body: { ...order, productId: p2.id, status: 'WAITING_FOR_PAYMENT' },
      headers: webAppHeader,
    });

    t.match(
      resp2,
      { status: 200 },
      'should return 200 status as order created',
    );
    t.match(
      await resp2.json(),
      { productId: p2.id },
      'should return created order',
    );
  });

  t.test('should set subscriptionEndsAt for subscription order', async (t) => {
    const resp = await request('/api/order/create', {
      method: 'POST',
      body: { ...order, productId: p4.id, status: 'WAITING_FOR_PAYMENT' },
      headers: webAppHeader,
    });

    const data = (await resp.json()) as Prisma.OrderUncheckedCreateInput;

    t.match(resp, { status: 200 }, 'should return 200 status as order created');
    t.equal(
      isValid(new Date(data.subscriptionEndsAt)),
      true,
      'should set subscriptionEndsAt',
    );
    t.match(data, { productId: p4.id }, 'should return created order');
  });

  t.test(
    'cannot create duplicate WATINING_FOR_PAYMENT order for same productId',
    async (t) => {
      const resp = await request('/api/order/create', {
        method: 'POST',
        body: { ...order, productId: p1.id, status: 'WAITING_FOR_PAYMENT' },
        headers: webAppHeader,
      });

      t.match(
        resp,
        { status: 400 },
        'should return 400 status as order not created',
      );
      t.match(await resp.json(), {
        error: 'duplicate-waiting-for-payment-order-with-same-product',
      });
    },
  );

  t.test('first active order', async (t) => {
    const firstActiveOrder = { ...order, productId: p3.id, status: 'ACTIVE' };
    const resp = await request('/api/order/create', {
      method: 'POST',
      body: firstActiveOrder,
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status as order created');
    t.match(await resp.json(), firstActiveOrder, 'should return created order');
  });

  t.test('second order with active', async (t) => {
    const resp = await request('/api/order/create', {
      method: 'POST',
      body: { ...order, productId: p5.id, status: 'ACTIVE' },
      headers: webAppHeader,
    });

    t.match(
      resp,
      { status: 400 },
      'should return 400 status as order not created',
    );
    t.match(await resp.json(), { error: 'has-active' });
  });
});

test('waiting-for-payment order', async (t) => {
  const { request, getProducts, getUsers, webAppHeader } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
      user: [
        {
          order: {
            type: 'one-time',
            status: 'WAITING_FOR_PAYMENT',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const products = await getProducts();
  const [user] = await getUsers();
  const [p1, p2] = products;

  t.test('no waiting-for-payment order with p2', async (t) => {
    const resp = await request(
      `/api/order/waiting-for-payment/${user.id}/${p2.id}`,
      {
        headers: webAppHeader,
      },
    );

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), null, 'should return null');
  });

  t.test('waiting for payment order', async (t) => {
    const resp = await request(
      `/api/order/waiting-for-payment/${user.id}/${p1.id}`,
      {
        headers: webAppHeader,
      },
    );

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), { productId: p1.id }, 'should return order');
  });
});

test('order list', async (t) => {
  const { request, adminCookie } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
      user: [
        {
          order: {
            type: 'one-time',
            status: 'WAITING_FOR_PAYMENT',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const cookieHeader: string = await adminCookie();

  t.test('list orders', async (t) => {
    const resp = await request('/api/admin/order/list', {
      cookie: cookieHeader!,
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(
      await resp.json(),
      {
        items: [{ status: 'WAITING_FOR_PAYMENT' }],
        count: 1,
      },
      'should return orders',
    );
  });
});

test('create subscription order for multiple members and create next one via activation code', async (t) => {
  const { request, webAppHeader, getProducts } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
      user: [
        {
          order: {
            type: 'none',
            status: 'WAITING_FOR_PAYMENT',
            appointment: 'none',
          },
        },
        {
          order: {
            type: 'none',
            status: 'WAITING_FOR_PAYMENT',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const products = await getProducts();

  const { id: productId } = products.find(
    (p) => p.subscriptionDuration > 0 && p.memberQty > 1,
  );

  let orderId: number;
  let activationCodes: Prisma.ActivationCodeUncheckedCreateInput[];

  t.test('1. create subscription order for user 1', async (t) => {
    const resp = await request('/api/order/create', {
      method: 'POST',
      headers: webAppHeader,
      body: { ...order, productId, status: 'WAITING_FOR_PAYMENT' },
    });

    const data = (await resp.json()) as Prisma.OrderUncheckedCreateInput;

    orderId = data.id;

    t.match(resp, { status: 200 }, 'should return 200 status as order created');
    t.match(
      data,
      { productId, userId: 1, status: 'WAITING_FOR_PAYMENT' },
      'should return created order',
    );
  });

  t.test(
    '2. update order after successful payment and create activation code',
    async (t) => {
      const resp = await request(`/api/order/update/${orderId}`, {
        method: 'PATCH',
        headers: webAppHeader,
        body: { status: 'ACTIVE', productId, userId: 1 },
      });

      const data = (await resp.json()) as Prisma.OrderUncheckedCreateInput;
      activationCodes =
        data.activationCode as Prisma.ActivationCodeUncheckedCreateInput[];

      t.match(
        resp,
        { status: 200 },
        'should return 200 status as order updated',
      );
      t.match(data, { status: 'ACTIVE' }, 'should return updated order');
      t.ok(Array.isArray(activationCodes), 'should return activation codes');
      t.ok(activationCodes.length > 0, 'should return activation codes');
      t.ok(
        activationCodes.every(({ code }) => typeof code === 'number'),
        'should return activation codes',
      );
    },
  );

  t.test('3.1. check if activation code exists', async (t) => {
    const resp = await request(`/api/order/create/12345`, {
      method: 'POST',
      headers: webAppHeader,
      body: { userId: 2 },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.match(await resp.json(), { error: 'invalid-activation-code' });
  });

  t.test('3.2. check if code not expired', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });

    clock.setSystemTime(addYears(new Date(), 100));

    const resp = await request(`/api/order/create/${activationCodes[0].code}`, {
      method: 'POST',
      headers: webAppHeader,
      body: { userId: 2 },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.match(await resp.json(), { error: 'code-expired' });

    t.teardown(clock.uninstall);
  });

  t.test('3.3. create activation code for user 2', async (t) => {
    const resp = await request(`/api/order/create/${activationCodes[0].code}`, {
      method: 'POST',
      headers: webAppHeader,
      body: { userId: 2 },
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status as order created');
    t.match(
      data,
      { userId: 2, productId, status: 'ACTIVE' },
      'should return created order',
    );
  });

  t.test(
    '3.4. check if user2 has active order during code activation',
    async (t) => {
      const resp = await request(
        `/api/order/create/${activationCodes[1].code}`,
        {
          method: 'POST',
          headers: webAppHeader,
          body: { userId: 2 },
        },
      );

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.match(await resp.json(), { error: 'has-active' });
    },
  );
});

test('active order', async (t) => {
  const { request, webAppHeader, getUsers } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
      user: [
        {
          order: {
            type: 'one-time',
            status: 'ACTIVE',
            appointment: 'none',
          },
        },
        {
          order: {
            type: 'none',
            status: 'WAITING_FOR_PAYMENT',
            appointment: 'none',
          },
        },
      ],
    },
  });

  const [user, user2] = await getUsers();

  t.test('get active order', async (t) => {
    const resp = await request(`/api/order/active/${user.id}`, {
      headers: webAppHeader,
    });

    const data = (await resp.json()) as Prisma.OrderUncheckedCreateInput;

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(
      data,
      { userId: user.id, status: 'ACTIVE' },
      'should return active order',
    );
    t.ok(Array.isArray(data.activationCode), 'should return activation code');
  });

  t.test('order not exists', async (t) => {
    const resp = await request(`/api/order/active/${user2.id}`, {
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), null, 'should return active order');
  });
});

test('complete one time order', async (t) => {
  t.test('cannot update DONE order', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'one-time',
              status: 'DONE',
              appointment: 'none',
            },
          },
        ],
      },
    });

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'DONE');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    const data = await resp.json();

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.match(data, { error: 'not-active' });
  });

  t.test('has active appointments', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'one-time',
              status: 'ACTIVE',
              appointment: 'active',
            },
          },
        ],
      },
    });

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.match(await resp.json(), {
      error: 'complete-appointment-before-closing-order',
    });
  });

  t.test('should complete order ACTIVE', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'one-time',
              status: 'ACTIVE',
              appointment: 'none',
            },
          },
        ],
      },
    });

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), { status: 'DONE' });
  });

  t.test('should complete order WATINING_FOR_PAYMENT', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'one-time',
              status: 'WAITING_FOR_PAYMENT',
              appointment: 'none',
            },
          },
        ],
      },
    });

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'WAITING_FOR_PAYMENT');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), { status: 'DONE' });
  });
});

test('complete subscription order', async (t) => {
  t.test('cannot update DONE order', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'subscription',
              status: 'DONE',
              appointment: 'none',
            },
          },
        ],
      },
    });

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'DONE');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    const data = await resp.json();

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.match(data, { error: 'not-active' });
  });

  t.test('not expired subscription order', async (t) => {
    t.test('order ACTIVE', async (t) => {
      const { request, adminCookie, findOrder } = await getServer({
        t,
        scenarios: {
          product: true,
          admin: true,
          user: [
            {
              order: {
                type: 'subscription',
                status: 'ACTIVE',
                appointment: 'none',
              },
            },
          ],
        },
      });

      const cookieHeader: string | null = await adminCookie();
      const order = await findOrder((o) => o.status === 'ACTIVE');

      const resp = await request(`/api/admin/order/complete/${order.id}`, {
        method: 'PATCH',
        cookie: cookieHeader,
        body: {},
      });

      t.match(resp, { status: 400 });
      t.match(await resp.json(), {
        error: 'cannot-complete-non-expired-subscription',
      });
    });

    t.test('order ACTIVE with appointments', async (t) => {
      const { request, adminCookie, findOrder } = await getServer({
        t,
        scenarios: {
          product: true,
          admin: true,
          user: [
            {
              order: {
                type: 'subscription',
                status: 'ACTIVE',
                appointment: 'active',
              },
            },
          ],
        },
      });

      const cookieHeader: string | null = await adminCookie();
      const order = await findOrder((o) => o.status === 'ACTIVE');

      const resp = await request(`/api/admin/order/complete/${order.id}`, {
        method: 'PATCH',
        cookie: cookieHeader,
        body: {},
      });

      t.match(resp, { status: 400 });
      t.match(await resp.json(), {
        error: 'cannot-complete-non-expired-subscription',
      });
    });

    t.test('order WATINING_FOR_PAYMENT', async (t) => {
      const { request, adminCookie, findOrder } = await getServer({
        t,
        scenarios: {
          product: true,
          admin: true,
          user: [
            {
              order: {
                type: 'subscription',
                status: 'WAITING_FOR_PAYMENT',
                appointment: 'none',
              },
            },
          ],
        },
      });

      const cookieHeader: string | null = await adminCookie();
      const order = await findOrder((o) => o.status === 'WAITING_FOR_PAYMENT');

      const resp = await request(`/api/admin/order/complete/${order.id}`, {
        method: 'PATCH',
        cookie: cookieHeader,
        body: {},
      });

      t.match(resp, { status: 400 });
      t.match(await resp.json(), {
        error: 'cannot-complete-non-expired-subscription',
      });
    });
  });

  t.test('should complete order ACTIVE', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'subscription',
              status: 'ACTIVE',
              appointment: 'none',
            },
          },
        ],
      },
    });

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date(), 100));

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });
    t.teardown(clock.uninstall);
  });

  t.test('should complete order ACTIVE with appointments', async (t) => {
    const { fastify, request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'subscription',
              status: 'ACTIVE',
              appointment: 'active',
            },
          },
        ],
      },
    });

    const gcDeletions = t.capture(fastify.googleCalendar.events, 'delete');

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date(), 100));

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });

    const results = gcDeletions();
    t.equal(results.length, 1);

    t.teardown(clock.uninstall);
  });

  t.test('should complete order WATINING_FOR_PAYMENT', async (t) => {
    const { request, adminCookie, findOrder } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: {
              type: 'subscription',
              status: 'WAITING_FOR_PAYMENT',
              appointment: 'none',
            },
          },
        ],
      },
    });

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date(), 100));

    const cookieHeader: string | null = await adminCookie();
    const order = await findOrder((o) => o.status === 'WAITING_FOR_PAYMENT');

    const resp = await request(`/api/admin/order/complete/${order.id}`, {
      method: 'PATCH',
      cookie: cookieHeader,
      body: {},
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });
    t.teardown(clock.uninstall);
  });
});
