import t from 'tap';
import type { Prisma } from '@prisma/client';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('delete translation', async (t) => {
  t.test('should entirely delete translation', async (t) => {
    const { request, adminCookie, getTranslations } = await getServer({
      t,
      scenarios: {
        admin: true,
        i18n: { lang: 'uk', ns: 'medbot' },
      },
    });

    const translations = await getTranslations();
    const [translation] = translations;

    const cookie = await adminCookie();

    const resp = await request(`/api/admin/i18n/delete`, {
      method: 'DELETE',
      cookie,
      body: { key: translation.key },
    });

    const data = (await resp.json()) as Prisma.I18nUncheckedCreateInput;

    t.match(resp, { status: 200 });
    t.ok(data);
    t.equal(data.key, translation.key);
    t.equal(data.namespace, translation.namespace);
    t.equal(data.uk, translation.uk);

    t.equal(
      translations.length - (await getTranslations()).length,
      1,
      'should remove translation',
    );
  });
});
