import t from 'tap';
import { getServer } from '../helpers/getServer/index.js';

const test = t.test;

const user = { name: 'Kate', password: '1234' };

test('auth', async (t) => {
  const { fastify, request } = await getServer({ t, scenarios: {} });

  let cookieHeader: string | null = null;

  t.test('try to login with missing user', async (t) => {
    const resp = await request('/api/auth/admin/login', {
      method: 'POST',
      body: user,
    });

    t.match(resp, { status: 400 }, 'should return 400 status as not logged in');
    t.equal(resp.headers.get('set-cookie'), null);
  });

  t.test('register a new user', async (t) => {
    const resp = await request('/api/auth/admin/register', {
      method: 'POST',
      body: user,
    });

    const data = await resp.json();
    const cookie = fastify.parseCookie(resp.headers.get('set-cookie')!);

    t.match(data, { done: true }, 'should register a new user');
    t.equal(cookie?.token?.length > 0, true);
  });

  t.test('get admin data withou cookie', async (t) => {
    const resp = await request('/api/admin/admin', {
      method: 'GET',
    });

    t.match(resp, { status: 401 }, 'should return 401 status');
  });

  t.test('login with registered user', async (t) => {
    const resp = await request('/api/auth/admin/login', {
      method: 'POST',
      body: user,
    });

    cookieHeader = resp.headers.get('set-cookie');
    const cookie = fastify.parseCookie(resp.headers.get('set-cookie')!);

    t.match(resp, { status: 200 }, 'should return 200 status as logged in');
    t.equal(cookie?.token?.length > 0, true);
  });

  t.test('try to register a new user', async (t) => {
    const resp = await request('/api/auth/admin/register', {
      method: 'POST',
      body: user,
    });

    t.match(
      resp,
      { status: 400 },
      'should return 400 status as already registered',
    );
    t.equal(resp.headers.get('set-cookie'), null);
    t.match(
      await resp.json(),
      { error: 'too-much-registrations' },
      'should return error if try register second user',
    );
  });

  t.test('get admin data', async (t) => {
    const resp = await request('/api/admin/admin', {
      method: 'GET',
      cookie: cookieHeader!,
    });

    t.match(resp, { status: 200 }, 'should return 200 status');
    t.match(await resp.json(), { name: 'Kate' });
  });
});
