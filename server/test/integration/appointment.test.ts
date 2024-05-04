import t from 'tap';
import type { Prisma } from '@prisma/client';
import fakeTimer from '@sinonjs/fake-timers';
import { addHours, addYears, setHours } from 'date-fns';
import { getServer } from '../helpers/getServer/index.js';

const test = t.test;

const appointment = {
  complaints: 'complaints',
  complaintsStarted: 'complaintsStarted',
  medicine: 'medicine',
  chronicDiseases: 'chronicDiseases',
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
        method: 'PUT',
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
      t.matchStrict(await resp.json(), {
        error: { time: 'out-of-working-hours' },
      });
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
      method: 'PUT',
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
      method: 'PUT',
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
      error: 'cannot-update-not-active-order',
    });
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
      method: 'PUT',
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
        method: 'PUT',
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

    const { request, webAppHeader, findOrder, getUsers, findAppointment } =
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
    const appointment = await findAppointment((a) => a.status === 'ACTIVE');

    const resp = await request('/api/appointment/create', {
      method: 'PUT',
      headers: webAppHeader,
      body: {
        ...appointment,
        id: undefined,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: appointment.time,
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: { time: 'occupied' } });
    t.teardown(clock.uninstall);
  });

  t.test(
    'cannot create appointment if subscription behind subscription order expire date',
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
                type: 'subscription',
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
        method: 'PUT',
        headers: webAppHeader,
        body: {
          ...appointment,
          orderId: order.id,
          userId: user.id,
          status: 'ACTIVE',
          time: addHours(new Date(order.subscriptionEndsAt), 1).toISOString(),
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), {
        error: {
          time: 'cannot-create-appointment-behind-order-expiration-date',
        },
      });
      t.teardown(clock.uninstall);
    },
  );

  t.test(
    'should create appointment if its time exactly to order expiration',
    async (t) => {
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
                  type: 'subscription',
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
        method: 'PUT',
        headers: webAppHeader,
        body: {
          ...appointment,
          orderId: order.id,
          userId: user.id,
          status: 'ACTIVE',
          time: new Date(order.subscriptionEndsAt).toISOString(),
        },
      });

      t.match(resp, { status: 200 }, 'should return 200 status');
      t.matchStrict(await resp.json(), { status: 'ACTIVE' });

      const results = gcInsert();
      t.equal(results.length, 1);
      t.teardown(clock.uninstall);
    },
  );

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
      method: 'PUT',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: addHours(new Date(), 3).toISOString(),
        treatment: 'blue pills',
        report: 'lupus',
        notes: 'this is easy',
      },
    });

    const data = (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.equal(data.status, 'ACTIVE');
    t.ok(data.id);
    t.ok(data.userId);
    t.ok(data.orderId);
    t.ok(data.chronicDiseases);
    t.ok(data.complaintsStarted);
    t.ok(data.complaints);
    t.ok(data.medicine);
    t.ok(data.time);

    t.equal(data.treatment, undefined, 'should not save treatment');
    t.equal(data.report, undefined, 'should not save report');
    t.equal(data.notes, undefined, 'should not save notes');

    const results = gcInsert();
    t.equal(results.length, 1);

    t.teardown(clock.uninstall);
  });
});

test('delete appointment', async (t) => {
  t.test('cannot delete not active appointment', async (t) => {
    const { request, webAppHeader, findAppointment } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: { type: 'one-time', status: 'ACTIVE', appointment: 'done' },
          },
        ],
      },
    });

    const appointment = await findAppointment((a) => a.status === 'DONE');

    const resp = await request(`/api/appointment/${appointment.id}`, {
      method: 'DELETE',
      headers: webAppHeader,
      body: {},
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), {
      error: 'cannot-delete-not-active-appointment',
    });
  });

  t.test('should delete appointment', async (t) => {
    const { fastify, request, webAppHeader, findAppointment } = await getServer(
      {
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
      },
    );

    const appointment = await findAppointment((a) => a.status === 'ACTIVE');
    const gcDelete = t.capture(
      fastify.googleCalendar.events,
      'delete',
      async () => {},
    );

    const resp = await request(`/api/appointment/${appointment.id}`, {
      method: 'DELETE',
      headers: webAppHeader,
      body: {},
    });

    const data = (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.equal(data.status, 'DELETED');
    t.ok(data.id);
    t.ok(data.userId);
    t.ok(data.orderId);
    t.ok(data.chronicDiseases);
    t.ok(data.complaintsStarted);
    t.ok(data.complaints);
    t.ok(data.medicine);
    t.ok(data.time);

    t.equal(data.treatment, undefined);
    t.equal(data.report, undefined);
    t.equal(data.notes, undefined);

    const results = gcDelete();
    t.equal(results.length, 1);
  });
});

test('active appointment', async (t) => {
  t.test('should return active appointment', async (t) => {
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
              appointment: 'active',
            },
          },
        ],
      },
    });

    const [user] = await getUsers();

    const resp = await request(`/api/appointment/${user.id}`, {
      method: 'GET',
      headers: webAppHeader,
    });

    const data = (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { status: 'ACTIVE', userId: user.id });
    t.ok(data.id);
    t.ok(data.time);
    t.ok(data.complaints);
    t.ok(data.medicine);
    t.ok(data.complaintsStarted);
    t.ok(data.chronicDiseases);
    t.ok(data.orderId);
    t.ok(data.userId);
    t.ok(data.status);
    t.equal(data.treatment, undefined);
    t.equal(data.report, undefined);
    t.equal(data.notes, undefined);
  });

  t.test('should return null if no active appointment', async (t) => {
    const { request, webAppHeader, getUsers } = await getServer({
      t,
      scenarios: {
        product: true,
        admin: true,
        user: [
          {
            order: { type: 'one-time', status: 'ACTIVE', appointment: 'none' },
          },
        ],
      },
    });

    const [user] = await getUsers();

    const resp = await request(`/api/appointment/${user.id}`, {
      method: 'GET',
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), null);
  });
});

test('appointment list', async (t) => {
  t.test('list orders', async (t) => {
    const { request, adminCookie } = await getServer({
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
    const cookieHeader: string = await adminCookie();

    const resp = await request('/api/admin/appointment/list', {
      cookie: cookieHeader!,
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), {
      items: [{ status: 'ACTIVE' }],
      count: 1,
    });
  });

  t.test('empty list', async (t) => {
    const { request, adminCookie } = await getServer({
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
    const cookieHeader: string = await adminCookie();

    const resp = await request('/api/admin/appointment/list', {
      cookie: cookieHeader!,
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), {
      items: [],
      count: 0,
    });
  });
});

test('update appointment', async (t) => {
  t.test(
    'cannot update appointment with time out of working hours',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T00:00:00Z'));

      const { request, webAppHeader, findAppointment } = await getServer({
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

      const appointment = await findAppointment((o) => o.status === 'ACTIVE');

      const resp = await request(`/api/appointment/${appointment.id}`, {
        method: 'PATCH',
        headers: webAppHeader,
        body: {
          ...appointment,
          chronicDiseases: 'lupus',
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), {
        error: { time: 'out-of-working-hours' },
      });
      t.teardown(clock.uninstall);
    },
  );

  t.test('cannot update appointment with time too early', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { request, webAppHeader, findAppointment } = await getServer({
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

    const appointment = await findAppointment((o) => o.status === 'ACTIVE');

    const resp = await request(`/api/appointment/${appointment.id}`, {
      method: 'PATCH',
      headers: webAppHeader,
      body: {
        ...appointment,
        chronicDiseases: 'lupus',
        time: setHours(new Date(), 13).toISOString(),
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: { time: 'too-early' } });
    t.teardown(clock.uninstall);
  });

  t.test(
    'cannot update not active appointment (status not ACTIVE)',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

      const { request, webAppHeader, findAppointment } = await getServer({
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

      const appointment = await findAppointment((o) => o.status === 'DONE');

      const resp = await request(`/api/appointment/${appointment.id}`, {
        method: 'PATCH',
        headers: webAppHeader,
        body: {
          ...appointment,
          chronicDiseases: 'lupus',
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), {
        error: 'cannot-update-not-active-appointment',
      });
      t.teardown(clock.uninstall);
    },
  );

  t.test(
    'cannot update not active appointment (status ACTIVE but time is past)',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

      const { request, webAppHeader, findAppointment } = await getServer({
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

      const appointment = await findAppointment((o) => o.status === 'ACTIVE');

      clock.setSystemTime(addHours(new Date(appointment.time), 1));

      const resp = await request(`/api/appointment/${appointment.id}`, {
        method: 'PATCH',
        headers: webAppHeader,
        body: {
          ...appointment,
          time: addHours(new Date(), 3).toISOString(),
          chronicDiseases: 'lupus',
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), {
        error: 'cannot-update-not-active-appointment',
      });
      t.teardown(clock.uninstall);
    },
  );

  t.test('cannot update appointment as slot is occupied', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { request, webAppHeader, getAppointments } = await getServer({
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

    const [a1, a2] = await getAppointments();

    const resp = await request(`/api/appointment/${a1.id}`, {
      method: 'PATCH',
      headers: webAppHeader,
      body: {
        ...a1,
        time: a2.time,
        chronicDiseases: 'lupus',
      },
    });

    t.match(resp, { status: 400 }, 'should return 400 status');
    t.matchStrict(await resp.json(), { error: { time: 'occupied' } });
    t.teardown(clock.uninstall);
  });

  t.test(
    'cannot update appointment as time is behind order expiration date',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

      const { request, webAppHeader, findAppointment, findOrder } =
        await getServer({
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

      const order = await findOrder((o) => o.status === 'ACTIVE');
      const appointment = await findAppointment((o) => o.status === 'ACTIVE');

      const resp = await request(`/api/appointment/${appointment.id}`, {
        method: 'PATCH',
        headers: webAppHeader,
        body: {
          ...appointment,
          chronicDiseases: 'lupus',
          time: addHours(new Date(order.subscriptionEndsAt), 1).toISOString(),
        },
      });

      t.match(resp, { status: 400 }, 'should return 400 status');
      t.matchStrict(await resp.json(), {
        error: {
          time: 'cannot-create-appointment-behind-order-expiration-date',
        },
      });
      t.teardown(clock.uninstall);
    },
  );

  t.test('should update appointment', async (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    const { fastify, request, webAppHeader, findAppointment } = await getServer(
      {
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
      },
    );

    const appointment = await findAppointment((o) => o.status === 'ACTIVE');
    const gcUpdate = t.capture(fastify.googleCalendar.events, 'update');

    const resp = await request(`/api/appointment/${appointment.id}`, {
      method: 'PATCH',
      headers: webAppHeader,
      body: {
        ...appointment,
        chronicDiseases: 'lupus',
        time: addHours(new Date(), 24).toISOString(),
        treatment: 'red pills',
        report: 'lupus',
        notes: 'this is obvious',
      },
    });

    const data = (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.equal(data.status, 'ACTIVE');
    t.ok(data.id);
    t.ok(data.userId);
    t.ok(data.orderId);
    t.ok(data.medicine);
    t.ok(data.chronicDiseases);
    t.ok(data.complaints);
    t.ok(data.complaintsStarted);
    t.ok(data.time);
    t.equal(data.treatment, undefined, 'should not save treatment');
    t.equal(data.report, undefined, 'should not save report');
    t.equal(data.notes, undefined, 'should not save notes');

    const results = gcUpdate();
    t.equal(results.length, 1);

    t.teardown(clock.uninstall);
  });

  t.test(
    'when update the same appointment - throws occupied error',
    async (t) => {
      const clock = fakeTimer.install({ shouldClearNativeTimers: true });
      clock.setSystemTime(new Date('2024-01-01T12:00:00Z'));

      const { fastify, request, webAppHeader, findAppointment } =
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
                  appointment: 'active',
                },
              },
            ],
          },
        });

      const appointment = await findAppointment((o) => o.status === 'ACTIVE');
      const gcUpdate = t.capture(fastify.googleCalendar.events, 'update');

      const resp = await request(`/api/appointment/${appointment.id}`, {
        method: 'PATCH',
        headers: webAppHeader,
        body: {
          ...appointment,
          chronicDiseases: 'lupus',
          treatment: 'Dr.House',
        },
      });

      t.match(resp, { status: 200 }, 'should return 200 status');

      const data =
        (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;
      t.matchStrict(data, {
        status: 'ACTIVE',
        chronicDiseases: 'lupus',
      });

      t.equal(data.treatment, undefined, 'should not exist in response');
      t.equal(data.report, undefined, 'should not exist in response');
      t.equal(data.report, undefined, 'should not exist in response');

      const results = gcUpdate();
      t.equal(results.length, 1);

      t.teardown(clock.uninstall);
    },
  );
});

test('complete expired order when CRUD appointment', async (t) => {
  t.test('create appointment (out of working day)', async (t) => {
    const {
      fastify,
      request,
      getUsers,
      webAppHeader,
      findOrder,
      getTelegrafSessions,
    } = await getServer({
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
            session: true,
          },
        ],
      },
    });

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date('2024-01-01T22:00:00Z'), 100));

    const [user] = await getUsers();
    const order = await findOrder((o) => o.status === 'ACTIVE');
    const gcInsert = t.capture(
      fastify.googleCalendar.events,
      'insert',
      async () => ({ data: { id: 'gc1' } }),
    );
    const medbotMethod = t.capture(
      fastify.medbotSdk,
      'completeSubscriptionOrder',
      () => Promise.resolve(),
    );

    t.equal((await getTelegrafSessions()).length, 1, 'should have session');

    const resp = await request('/api/appointment/create', {
      method: 'PUT',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: addHours(new Date(), 3).toISOString(),
      },
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });

    t.equal(gcInsert().length, 0, 'should not call google calendar');

    t.equal(medbotMethod().length, 1, 'should call complete');

    const telegrafSessions = await getTelegrafSessions();

    t.equal(telegrafSessions.length, 0, 'should clear session');

    t.teardown(clock.uninstall);
  });

  t.test('create appointment', async (t) => {
    const {
      fastify,
      request,
      getUsers,
      webAppHeader,
      findOrder,
      getTelegrafSessions,
    } = await getServer({
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
            session: true,
          },
        ],
      },
    });

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date('2024-01-01T12:00:00Z'), 100));

    const [user] = await getUsers();
    const order = await findOrder((o) => o.status === 'ACTIVE');
    const gcInsert = t.capture(
      fastify.googleCalendar.events,
      'insert',
      async () => ({ data: { id: 'gc1' } }),
    );
    const medbotMethod = t.capture(
      fastify.medbotSdk,
      'completeSubscriptionOrder',
      () => Promise.resolve(),
    );

    t.equal((await getTelegrafSessions()).length, 1, 'should have session');

    const resp = await request('/api/appointment/create', {
      method: 'PUT',
      headers: webAppHeader,
      body: {
        ...appointment,
        orderId: order.id,
        userId: user.id,
        status: 'ACTIVE',
        time: addHours(new Date(), 3).toISOString(),
      },
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });

    t.equal(gcInsert().length, 0, 'should not call google calendar');

    t.equal(medbotMethod().length, 1, 'should call complete');

    t.equal((await getTelegrafSessions()).length, 0, 'should clear session');

    t.teardown(clock.uninstall);
  });

  t.test('update appointment', async (t) => {
    const {
      fastify,
      request,
      webAppHeader,
      findAppointment,
      getTelegrafSessions,
    } = await getServer({
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
            session: true,
          },
        ],
      },
    });

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date('2024-01-01T12:00:00Z'), 100));

    const medbotMethod = t.capture(
      fastify.medbotSdk,
      'completeSubscriptionOrder',
      () => Promise.resolve(),
    );

    const appointment = await findAppointment((o) => o.status === 'ACTIVE');
    const gcUpdate = t.capture(fastify.googleCalendar.events, 'update');

    t.equal((await getTelegrafSessions()).length, 1, 'should have session');

    const resp = await request(`/api/appointment/${appointment.id}`, {
      method: 'PATCH',
      headers: webAppHeader,
      body: {
        ...appointment,
        chronicDiseases: 'lupus',
        treatment: 'Dr.House',
      },
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });

    t.equal(gcUpdate().length, 0, 'should not call google calendar');

    t.equal(medbotMethod().length, 1, 'should call complete');

    t.equal((await getTelegrafSessions()).length, 0, 'should clear session');

    t.teardown(clock.uninstall);
  });

  t.test('active appointment', async (t) => {
    const { fastify, request, webAppHeader, getUsers, getTelegrafSessions } =
      await getServer({
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
              session: true,
            },
          ],
        },
      });

    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    clock.setSystemTime(addYears(new Date('2024-01-01T12:00:00Z'), 100));

    const medbotMethod = t.capture(
      fastify.medbotSdk,
      'completeSubscriptionOrder',
      () => Promise.resolve(),
    );

    const [user] = await getUsers();

    t.equal((await getTelegrafSessions()).length, 1, 'should have session');

    const resp = await request(`/api/appointment/${user.id}`, {
      method: 'GET',
      headers: webAppHeader,
    });

    const data = await resp.json();

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(data, { message: 'subscription-order-completed' });

    t.equal(medbotMethod().length, 1, 'should call complete');

    t.equal((await getTelegrafSessions()).length, 0, 'should clear session');

    t.teardown(clock.uninstall);
  });
});

test('make prescriptions', async (t) => {
  const appointmentStatuses = ['active', 'done', 'deleted'] as const;

  appointmentStatuses.forEach((appointmentStatus) => {
    t.test(
      `should update only specific fields of appointment with status ${appointmentStatus}`,
      async (t) => {
        const { request, adminCookie, findAppointment } = await getServer({
          t,
          scenarios: {
            product: true,
            admin: true,
            user: [
              {
                order: {
                  type: 'subscription',
                  status: 'ACTIVE',
                  appointment: appointmentStatus,
                },
                session: true,
              },
            ],
          },
        });

        const appointment = await findAppointment(() => true);
        const cookieHeader: string = await adminCookie();

        const newAppointment: Prisma.AppointmentUncheckedCreateInput = {
          orderId: 1,
          userId: 2,
          treatment: 'blue pills',
          report: 'lupus',
          notes: 'this is easy',
          time: '123',
          status: 'DONE',
          complaintsStarted: '123',
          complaints: 'vsd',
          medicine: 'green pills',
          chronicDiseases: '1234',
        };

        const resp = await request(
          `/api/admin/appointment/prescript/${appointment.id}`,
          {
            method: 'PATCH',
            cookie: cookieHeader!,
            body: newAppointment,
          },
        );

        const data =
          (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;

        t.match(resp, { status: 200 }, 'should return 200 status');
        t.equal(data.orderId, appointment.orderId, 'should not be changed');
        t.equal(data.userId, appointment.userId, 'should not be changed');
        t.equal(data.status, appointment.status, 'should not be changed');
        t.equal(data.time, appointment.time, 'should not be changed');
        t.equal(
          data.chronicDiseases,
          appointment.chronicDiseases,
          'should not be changed',
        );
        t.equal(
          data.complaints,
          appointment.complaints,
          'should not be changed',
        );
        t.equal(
          data.complaintsStarted,
          appointment.complaintsStarted,
          'should not be changed',
        );
        t.equal(data.medicine, appointment.medicine, 'should not be changed');

        t.equal(data.treatment, newAppointment.treatment, 'should be changed');
        t.equal(data.report, newAppointment.report, 'should be changed');
        t.equal(data.notes, newAppointment.notes, 'should be changed');
      },
    );
  });

  t.test('should not update non existent appointment', async (t) => {
    const { request, adminCookie } = await getServer({
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
            session: true,
          },
        ],
      },
    });

    const cookieHeader: string = await adminCookie();

    const newAppointment: Prisma.AppointmentUncheckedCreateInput = {
      orderId: 1,
      userId: 2,
      treatment: 'blue pills',
      report: 'lupus',
      notes: 'this is easy',
      time: '123',
      status: 'DONE',
      complaintsStarted: '123',
      complaints: 'vsd',
      medicine: 'green pills',
      chronicDiseases: '1234',
    };

    const resp = await request(`/api/admin/appointment/prescript/0`, {
      method: 'PATCH',
      cookie: cookieHeader!,
      body: newAppointment,
    });

    const data = (await resp.json()) as Prisma.AppointmentUncheckedCreateInput;

    t.match(resp, { status: 400 }, 'should return 200 status');
    t.match(data, { error: 'no-such-appointment' });
  });
});
