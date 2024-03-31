import t from 'tap';
import type { Prisma } from '@prisma/client';
import fakeTimer from '@sinonjs/fake-timers';
import { addHours, addYears, isValid, setHours } from 'date-fns';
import { getServer } from '../helpers/getServer/index.js';

const test = t.test;

const appointment = {
  complaints: 'complaints',
  complaintsStarted: 'complaintsStarted',
  medicine: 'medicine',
  chronicDiseases: 'chronicDiseases',
  timezoneOffset: 0,
  status: 'ACTIVE',
};

test('appointment creation', async (t) => {
  t.test(
    'cannot create appointment with time out of working hours',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T00:00:00Z'));

      const { request, webAppHeader, findOrder, getUsers } = await getServer({
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
      const order = await findOrder((o) => o.status === 'ACTIVE');

      const resp = await request('/api/appointment/create', {
        method: 'POST',
        headers: webAppHeader,
        body: {
          ...appointment,
          orderId: order.id,
          userId: user.id,
          status: 'ACTIVE',
          time: new Date().toISOString(),
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), { error: { time: 'out-of-working-hours' } });
      t.teardown(clock.uninstall);
    },
  );

  t.test('cannot create appointment with time too early', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { request, webAppHeader, findOrder, getUsers } = await getServer({
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
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request('/api/appointment/create', {
      method: 'POST',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: setHours(new Date(), 13).toISOString(),
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: { time: 'too-early' } });
    t.teardown(clock.uninstall);
  });

  t.test('cannot create appointment with order status DONE', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { request, webAppHeader, findOrder, getUsers } = await getServer({
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
    const order = await findOrder((o) => o.status === 'DONE');

    const resp = await request('/api/appointment/create', {
      method: 'POST',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: setHours(new Date(), 15).toISOString(),
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: 'cannot-update-not-active-order' });
    t.teardown(clock.uninstall);
  });

  t.test('cannot create appointment with active appointment', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { request, webAppHeader, findOrder, getUsers } = await getServer({
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

    const [user] = await getUsers();
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request('/api/appointment/create', {
      method: 'POST',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: setHours(new Date(), 17).toISOString(),
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: 'has-active' });
    t.teardown(clock.uninstall);
  });

  t.test(
    'cannot create appointment if one-time order has done appointments',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

      const { request, webAppHeader, findOrder, getUsers } = await getServer({
        t,
        scenarios: {
          product: true,
          admin: true,
          user: [
            {
              order: {
                type: 'one-time',
                status: 'ACTIVE',
                appointment: 'done',
              },
            },
          ],
        },
      });

      const [user] = await getUsers();
      const order = await findOrder((o) => o.status === 'ACTIVE');

      const resp = await request('/api/appointment/create', {
        method: 'POST',
        headers: webAppHeader,
        body: {
          ...appointment,
          orderId: order.id,
          userId: user.id,
          status: 'ACTIVE',
          time: setHours(new Date(), 15).toISOString(),
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), {
        error: 'one-time-order-cannot-create-twice',
      });
      t.teardown(clock.uninstall);
    },
  );

  t.test('cannot create appointment with occupied time slot', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { request, webAppHeader, findOrder, getUsers } = await getServer({
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
              type: 'one-time',
              status: 'ACTIVE',
              appointment: 'active',
            },
          },
        ],
      },
    });

    const [user] = await getUsers();
    const order = await findOrder((o) => o.status === 'ACTIVE');

    const resp = await request('/api/appointment/create', {
      method: 'POST',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: addHours(new Date(), 3).toISOString(),
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: { time: 'occupied' } });
    t.teardown(clock.uninstall);
  });

  t.test('should create appointment', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { fastify, request, webAppHeader, findOrder, getUsers } =
      await getServer({
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
    const order = await findOrder((o) => o.status === 'ACTIVE');
    const gcInsert = t.capture(
      fastify.googleCalendar.events,
      'insert',
      async () => ({ data: { id: 'gc1' } }),
    );

    const resp = await request('/api/appointment/create', {
      method: 'POST',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: addHours(new Date(), 3).toISOString(),
      },
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.matchStrict(await resp.json(), { status: 'ACTIVE' });

    const results = gcInsert();
    t.equal(results.length, 1);

    t.teardown(clock.uninstall);
  });
});
