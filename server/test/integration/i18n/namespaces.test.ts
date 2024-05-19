import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('get namespaces list', async (t) => {
  t.test('should return array of namespaces', async (t) => {
    const { request, adminCookie } = await getServer({
      t,
      scenarios: {
        admin: true,
      },
    });

    const cookie = await adminCookie();

    const resp = await request(`/api/admin/i18n/namespaces`, {
      method: 'GET',
      cookie,
    });

    const data = await resp.json();

    t.match(resp, { status: 200 });
    t.matchStrict(data, ['medbot', 'webapp']);
  });
});
