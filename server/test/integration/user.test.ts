// create user
// user list route should return array of users
// index route should return user by its id. if not - null
import t from 'tap';
import { getServer } from '../helpers/getServer/index.js';
import { admin } from '../helpers/getServer/fixtures/admin.js';

const test = t.test;

const user = {
  id: 1,
  name: 'Kate',
  surname: 'Smith',
  birthDate: '1990-01-01T19:40:27.326Z',
  phone: '+1234567890',
  email: 'test@test.com',
};

const webAppHeader = { 'x-webapp-info': process.env.X_WEBAPP_INFO! };

test('user', async (t) => {
  const { fastify, cleanup, request } = await getServer({
    t,
    scenarios: ['product', 'existingAdmin'],
  });
  t.teardown(cleanup);

  let cookieHeader: string | null = null;

  const { headers } = await request('/api/auth/admin/login', {
    method: 'POST',
    body: admin,
  });

  cookieHeader = headers.get('set-cookie')!;

  t.test('create user', async (t) => {
    const resp = await request('/api/user/create', {
      method: 'POST',
      body: user,
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status as user created');
    t.match(await resp.json(), user, 'should return created user');
  });

  t.test('create existing user', async (t) => {
    const resp = await request('/api/user/create', {
      method: 'POST',
      body: user,
      headers: webAppHeader,
    });

    t.match(resp, { status: 400 }, 'should return 400 status as user exists');
    t.match(await resp.json(), { error: 'duplicate-user' });
  });

  t.test('get user', async (t) => {
    const resp = await request(`/api/user/${user.id}`, {
      method: 'GET',
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status as user exists');
    t.match(await resp.json(), user, 'should return user');
  });

  t.test('user list', async (t) => {
    const resp = await request('/api/admin/user/list', {
      method: 'GET',
      cookie: cookieHeader!,
    });

    t.match(resp, { status: 200 }, 'should return 200');
    t.match(
      await resp.json(),
      { items: [user], count: 1 },
      'should return user list',
    );
  });

  t.test('update user', async (t) => {
    const resp = await request(`/api/user/update/${user.id}`, {
      method: 'PATCH',
      body: { ...user, name: 'John' },
      headers: webAppHeader,
    });

    t.match(resp, { status: 200 }, 'should return 200 status as user updated');
    t.match(
      await resp.json(),
      { ...user, name: 'John' },
      'should return updated user',
    );
  });

  t.test('update non-existing user', async (t) => {
    const resp = await request(`/api/user/update/2`, {
      method: 'PATCH',
      body: { ...user, name: 'John' },
      headers: webAppHeader,
    });

    t.match(
      resp,
      { status: 400 },
      'should return 400 status as user not found',
    );
    t.match(await resp.json(), { error: 'user-not-exists' });
  });
});
