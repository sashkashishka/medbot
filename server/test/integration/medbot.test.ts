import t from 'tap';
import fakeTimer from '@sinonjs/fake-timers';
import { addYears } from 'date-fns';
import type { Prisma } from '@prisma/client';
import { getServer } from '../helpers/getServer/index.js';

const test = t.test;

test('check if order active', async (t) => {
  ['messageThreadId', 'botChatId'].forEach((id) => {
    t.test(
      'subscription order is active and not passed - return true',
      async (t) => {
        const { request, serviceHeader, getUsers } = await getServer({
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

        const [user] = await getUsers();

        const resp = await request(
          `/api/service/check-order-active/${user[id]}?id=${id}`,
          {
            method: 'GET',
            headers: serviceHeader,
          },
        );

        t.match(resp, { status: 200 });
        t.matchStrict(await resp.json(), {
          active: true,
        });
      },
    );

    t.test(
      'subscription order is active and passed - return false',
      async (t) => {
        const clock = fakeTimer.install({ shouldClearNativeTimers: true });
        clock.setSystemTime(new Date('2024-01-01T00:00:00Z'));

        const { request, serviceHeader, getUsers } = await getServer({
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

        clock.setSystemTime(addYears(new Date(), 100));

        const [user] = await getUsers();

        const resp = await request(
          `/api/service/check-order-active/${user[id]}?id=${id}`,
          {
            method: 'GET',
            headers: serviceHeader,
          },
        );

        t.match(resp, { status: 200 });
        t.matchStrict(await resp.json(), {
          active: false,
        });
        t.teardown(clock.uninstall);
      },
    );

    t.test('subscription order is DONE - return false', async (t) => {
      const { request, serviceHeader, getUsers } = await getServer({
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

      const [user] = await getUsers();

      const resp = await request(
        `/api/service/check-order-active/${user[id]}?id=${id}`,
        {
          method: 'GET',
          headers: serviceHeader,
        },
      );

      t.match(resp, { status: 200 });
      t.matchStrict(await resp.json(), {
        active: false,
      });
    });

    t.test('one time order is active - return true', async (t) => {
      const { request, serviceHeader, getUsers } = await getServer({
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

      const [user] = await getUsers();

      const resp = await request(
        `/api/service/check-order-active/${user[id]}?id=${id}`,
        {
          method: 'GET',
          headers: serviceHeader,
        },
      );

      t.match(resp, { status: 200 });
      t.matchStrict(await resp.json(), {
        active: true,
      });
    });

    t.test('one time order is DONE - return false', async (t) => {
      const { request, serviceHeader, getUsers } = await getServer({
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

      const [user] = await getUsers();

      const resp = await request(
        `/api/service/check-order-active/${user[id]}?id=${id}`,
        {
          method: 'GET',
          headers: serviceHeader,
        },
      );

      t.match(resp, { status: 200 });
      t.matchStrict(await resp.json(), {
        active: false,
      });
    });
  });
});

test('get product by messageThreadId or botChatId', async (t) => {
  ['messageThreadId', 'botChatId'].forEach((id) => {
    t.test('should return product if active order', async (t) => {
      const { request, serviceHeader, getUsers } = await getServer({
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

      const [user] = await getUsers();

      const resp = await request(
        `/api/service/orders-product/${user[id]}?id=${id}`,
        {
          method: 'GET',
          headers: serviceHeader,
        },
      );

      const data = (await resp.json()) as Prisma.ProductUncheckedCreateInput;

      t.match(resp, { status: 200 });
      t.ok(data.name);
      t.ok(data.description);
    });

    t.test('should return null if no active order', async (t) => {
      const { request, serviceHeader, getUsers } = await getServer({
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

      const [user] = await getUsers();

      const resp = await request(
        `/api/service/orders-product/${user[id]}?id=${id}`,
        {
          method: 'GET',
          headers: serviceHeader,
        },
      );

      const data = (await resp.json()) as Prisma.ProductUncheckedCreateInput;

      t.match(resp, { status: 200 });
      t.match(data, null);
    });

    t.test('should return null if active order but different id', async (t) => {
      const { request, serviceHeader, getUsers } = await getServer({
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
                status: 'DONE',
                appointment: 'none',
              },
            },
          ],
        },
      });

      const [_user, user2] = await getUsers();

      const resp = await request(
        `/api/service/orders-product/${user2[id]}?id=${id}`,
        {
          method: 'GET',
          headers: serviceHeader,
        },
      );

      const data = (await resp.json()) as Prisma.ProductUncheckedCreateInput;

      t.match(resp, { status: 200 });
      t.match(data, null);
    });
  });
});
