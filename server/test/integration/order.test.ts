import t from 'tap';
import { getServer } from '../helpers/getServer/index.js';
import type { Prisma } from '@prisma/client';
import { isValid } from 'date-fns';

const test = t.test;
const webAppHeader = { 'x-webapp-info': process.env.X_WEBAPP_INFO! };

const order = {
  userId: 1,
};

test('order creation', async (t) => {
  const { cleanup, request } = await getServer({
    t,
    scenarios: ['product', 'user'],
  });
  t.teardown(cleanup);

  const productsResponse = await request('/api/product/list', {
    headers: webAppHeader,
  });
  const [p1, p2, p3, p4, p5] =
    (await productsResponse.json()) as Prisma.ProductUncheckedCreateInput[];

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

  t.test('fist active order', async (t) => {
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
