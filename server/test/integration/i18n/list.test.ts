import t from 'tap';
import type { Prisma } from '@prisma/client';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('translation list', async (t) => {
  const cases = [{ lang: 'uk', ns: 'medbot' }] as const;

  cases.forEach(({ lang, ns }) => {
    t.test('should work with admin api', async (t) => {
      const { request, adminCookie } = await getServer({
        t,
        scenarios: {
          admin: true,
          i18n: { lang, ns },
        },
      });

      const cookie = await adminCookie();

      const resp = await request(`/api/admin/i18n/list/${lang}/${ns}`, {
        method: 'GET',
        cookie,
      });

      const data = (await resp.json()) as Prisma.I18nUncheckedCreateInput[];

      t.match(resp, { status: 200 });
      t.ok(
        data.every((v) => v.namespace === ns),
        'should have only selected ns items',
      );
      t.ok(data.length > 0);
      t.ok(data[0].key !== undefined);
      t.ok(data[0].uk !== undefined);
    });

    // TODO test for not undefined translations in response
  });
});
