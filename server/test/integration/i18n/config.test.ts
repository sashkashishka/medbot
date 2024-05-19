import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('get i18n config list', async (t) => {
  t.test('should return array of configs', async (t) => {
    const { request, adminCookie } = await getServer({
      t,
      scenarios: {
        admin: true,
      },
    });

    const cookie = await adminCookie();

    const resp = await request(`/api/admin/i18n/config`, {
      method: 'GET',
      cookie,
    });

    const data = await resp.json();

    t.match(resp, { status: 200 });
    t.matchStrict(data, [
      { ns: 'medbot', lang: ['uk'] },
      { ns: 'webapp', lang: ['uk'] },
    ]);
  });
});
