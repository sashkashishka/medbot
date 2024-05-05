import t from 'tap';
import type { Prisma } from '@prisma/client';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('create translation', async (t) => {
  t.test('should create new translation', async (t) => {
    const { request, adminCookie } = await getServer({
      t,
      scenarios: {
        admin: true,
      },
    });

    const translation = {
      lang: 'uk',
      ns: 'medbot',
      key: 'test',
      translation: 'тест',
    };
    const cookie = await adminCookie();

    const resp = await request(`/api/admin/i18n/create`, {
      method: 'PUT',
      cookie,
      body: translation,
    });

    const data = (await resp.json()) as Prisma.I18nUncheckedCreateInput;

    t.match(resp, { status: 200 });
    t.ok(data);
    t.equal(data.key, translation.key);
    t.equal(data.namespace, translation.ns);
    t.equal(data.uk, translation.translation);
  });

  t.test('when called on existing key - update it', async (t) => {
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

    const newTranslation = {
      lang: 'uk',
      key: translation.key,
      ns: translation.namespace,
      translation: '123',
    };

    const resp = await request(`/api/admin/i18n/create`, {
      method: 'PUT',
      cookie,
      body: newTranslation,
    });

    const data = (await resp.json()) as Prisma.I18nUncheckedCreateInput;

    t.match(resp, { status: 200 });
    t.ok(data);
    t.equal(data.key, newTranslation.key);
    t.equal(data.namespace, newTranslation.ns);
    t.equal(data.uk, newTranslation.translation);

    t.equal(
      translations.length,
      (await getTranslations()).length,
      'should not create a new translation',
    );
  });
});
