import t from 'tap';
import { getServer } from '../helpers/getServer/index.js';

const test = t.test;

test('registration endpoint', async (t) => {
  const { fastify, cleanup, generateEndpoint } = await getServer({ t });
  t.teardown(cleanup);

  // TODO: create fetch wrapper
  // - provide cookie
  // - provide tg webapp header
  // - provide body as plain object
  // - provide api endpoint
  const resp = await fetch(generateEndpoint('/api/auth/admin/register'), {
    method: 'POST',
    body: JSON.stringify({ name: 'Kate', password: '1234' }),
    headers: { 'content-type': 'application/json' },
  });

  const data = await resp.json();
  const cookie = fastify.parseCookie(resp.headers.get('set-cookie')!);

  t.match(data, { done: true }, 'should register a new user');
  t.equal(cookie?.token?.length > 0, true);

  const resp2 = await fetch(generateEndpoint('/api/auth/admin/register'), {
    method: 'POST',
    body: JSON.stringify({ name: 'Kate', password: '1234' }),
    headers: { 'content-type': 'application/json' },
  });

  t.equal(resp2.ok, false);
  t.equal(resp2.status, 400);

  const data2 = await resp2.json();
  const cookie2 = fastify.parseCookie(resp2.headers.get('set-cookie') || '');

  t.match(
    data2,
    { error: 'too-much-registrations' },
    'should return error if try register second user',
  );
  t.equal(cookie2?.token, undefined);
});
