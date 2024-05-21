import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('config', async (t) => {
  t.test('should return config', async (t) => {
    const { request, webAppHeader } = await getServer({
      t,
      scenarios: {
        admin: true,
      },
    });

    const resp = await request(`/api/config`, {
      method: 'GET',
      headers: webAppHeader,
    });

    const data = (await resp.json()) as Record<string, string>;

    t.match(resp, { status: 200 });
    t.ok(data.googleEmail);
  });
});
