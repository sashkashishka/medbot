// add unit test that specific method of i18n plugin was called
import t from 'tap';
import type { Prisma } from '@prisma/client';
import { getServer } from '../../helpers/getServer/index.js';

const test = t.test;

test('refresh medbot - unit', async (t) => {
  t.test('should call methods of i18n plugin', async (t) => {
    const { request, adminCookie, fastify } = await getServer({
      t,
      scenarios: {
        admin: true,
        i18n: { lang: 'uk', ns: 'medbot' },
      },
    });

    const cookie = await adminCookie();
    const refreshTranslations = t.capture(
      fastify.i18n,
      'refreshTranslations',
      () => {},
    );
    const loading = t.capture(fastify.i18n, 'loading', async () => null);

    const resp = await request(`/api/admin/i18n/refresh`, {
      method: 'GET',
      cookie,
    });

    await resp.json();

    t.match(resp, { status: 200 });

    const refreshTranslationsResult = refreshTranslations();
    t.equal(refreshTranslationsResult.length, 1, 'should have been called');

    const loadingResult = loading();
    t.equal(loadingResult.length, 1, 'should have been called');
  });
});

test('refresh medbot - integration', async (t) => {
  t.test('create endpoint and refresh', async (t) => {
    const { request, adminCookie, fastify } = await getServer({
      t,
      scenarios: {
        admin: true,
      },
    });

    const cookie = await adminCookie();

    const translation = {
      lang: 'uk',
      ns: 'medbot',
      key: 'test',
      translation: 'тест',
    };

    t.equal(
      fastify.i18n.getNs('uk', 'medbot').test,
      '',
      'should be empty translations',
    );

    await request(`/api/admin/i18n/create`, {
      method: 'PUT',
      cookie,
      body: translation,
    });

    t.equal(
      fastify.i18n.getNs('uk', 'medbot').test,
      '',
      'still should be empty translations',
    );

    await request(`/api/admin/i18n/refresh`, { method: 'GET', cookie });

    t.equal(
      fastify.i18n.getNs('uk', 'medbot').test,
      translation.translation,
      'should be populated with new translation',
    );
  });
});
