import t from 'tap';
import { getServer } from '../../helpers/getServer/index.js';
import type { tNsTranslations } from '../../../src/plugins/i18n/i18n.js';

const test = t.test;

test('namespace translations', async (t) => {
  const cases = [{ lang: 'uk', ns: 'medbot' }] as const;

  cases.forEach(({ lang, ns }) => {
    t.test('should work with client api', async (t) => {
      const { request, webAppHeader } = await getServer({
        t,
        scenarios: {
          admin: true,
          i18n: { lang, ns },
        },
      });

      const resp = await request(`/api/i18n/ns/${lang}/${ns}`, {
        method: 'GET',
        headers: webAppHeader,
      });

      const data = (await resp.json()) as tNsTranslations;

      t.match(resp, { status: 200 });
      t.ok(ns in data);
      t.ok(data[ns]);
      t.ok(
        Object.keys(data).length === 1,
        'should have only selected ns items',
      );
      t.ok(data[ns].test);
    });

    t.test('should work with service api', async (t) => {
      const { request, serviceHeader } = await getServer({
        t,
        scenarios: {
          admin: true,
          i18n: { lang, ns },
        },
      });

      const resp = await request(`/api/service/i18n/ns/${lang}/${ns}`, {
        method: 'GET',
        headers: serviceHeader,
      });

      const data = (await resp.json()) as tNsTranslations;

      t.match(resp, { status: 200 });
      t.ok(ns in data);
      t.ok(data[ns]);
      t.ok(
        Object.keys(data).length === 1,
        'should have only selected ns items',
      );
      t.ok(data[ns].test);
    });

    // TODO test for not undefined translations in response
  });
});
