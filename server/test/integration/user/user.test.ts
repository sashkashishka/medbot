import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';
import { user } from '../../helpers/getServer/fixtures/user.js';

const test = t.test;

test('user', async (t) => {
  const { request, adminCookie, webAppHeader } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
    },
  });

  const cookieHeader: string = await adminCookie();

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
    t.matchStrict(await resp.json(), { error: 'duplicate-user' });
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
    t.matchStrict(await resp.json(), { error: 'user-not-exists' });
  });
});
