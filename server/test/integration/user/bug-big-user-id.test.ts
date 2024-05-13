import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';
import { user } from '../../helpers/getServer/fixtures/user.js';

const test = t.test;

test('create user with big user id', async (t) => {
  const { request, webAppHeader } = await getServer({
    t,
    scenarios: {
      product: true,
      admin: true,
    },
  });

  const u = {
    ...user,
    id: 6603855683,
  };

  const resp = await request('/api/user/create', {
    method: 'POST',
    body: u,
    headers: webAppHeader,
  });

  t.match(resp, { status: 200 }, 'should return 200 status as user created');
  t.match(await resp.json(), u, 'should return created user');
});
