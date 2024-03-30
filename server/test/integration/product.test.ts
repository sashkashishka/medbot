import t from 'tap';
import { getServer } from '../helpers/getServer/index.js';
import type { Prisma } from '@prisma/client';

const test = t.test;

const product = {
  name: 'Product',
  description: 'Description',
  price: 100,
  memberQty: 5,
  subscriptionDuration: 30,
};

test('product', async (t) => {
  const { cleanup, request, adminCookie } = await getServer({
    t,
    scenarios: ['admin'],
  });
  t.teardown(cleanup);

  let productId: number | null = null;
  let cookieHeader: string | null = await adminCookie();


  t.test('create product', async (t) => {
    const resp = await request('/api/admin/product/create', {
      method: 'PUT',
      body: product,
      cookie: cookieHeader!,
    });

    const data = await resp.json() as Prisma.ProductUncheckedCreateInput;
    productId = data.id;

    t.match(
      resp,
      { status: 200 },
      'should return 200 status as product created',
    );
    t.match(data, product, 'should return created product');
  });

  t.test('get product list', async (t) => {
    const resp = await request('/api/product/list', {
      method: 'GET',
      headers: {
        'x-webapp-info': process.env.X_WEBAPP_INFO!,
      },
    });

    t.match(resp, { status: 200 }, 'should return 200 status as product list');
    t.match(await resp.json(), [product], 'should return array of products');
  });

  t.test('edit product', async (t) => {
    const resp = await request(`/api/admin/product/${productId}`, {
      method: 'PATCH',
      body: {
        ...product,
        name: 'New Name',
      },
      cookie: cookieHeader!,
    });

    t.match(
      resp,
      { status: 200 },
      'should return 200 status as product edited',
    );
    t.match(
      await resp.json(),
      { ...product, name: 'New Name' },
      'should return edited product',
    );
  });

  t.test('delete product', async (t) => {
    const resp = await request(`/api/admin/product/${productId}`, {
      method: 'DELETE',
      body: {},
      cookie: cookieHeader!,
    });

    t.match(
      resp,
      { status: 200 },
      'should return 200 status as product deleted',
    );
  });
});
