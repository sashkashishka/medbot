import { atom, computed, onSet } from 'nanostores';
import { createFetcherStore, createMutatorStore } from './_query';
import type {
  tI18n,
  iI18nConfig,
  tLang,
  tNamespace,
  iI18nTranslation,
} from '../types';

const $i18nLang = atom<tLang>('uk');
const $i18nNs = atom<tNamespace>('medbot');
const $i18nId = atom<string>('');

export function setI18nOptions(lang: tLang, ns: tNamespace, id = '') {
  $i18nLang.set(lang);
  $i18nNs.set(ns);
  $i18nId.set(id);
}

export const I18N_KEYS = {
  config: ['i18n/config'],
  translationList: ['i18n/list/', $i18nLang, '/', $i18nNs],
};

export const $config = createFetcherStore<iI18nConfig[]>(I18N_KEYS.config);

export const $translations = createFetcherStore<tI18n[]>(
  I18N_KEYS.translationList,
);

export const $translation = computed(
  [$translations, $i18nLang, $i18nId],
  (translations, lang, id): { data?: iI18nTranslation; isReady: boolean } => {
    const translation = translations.data?.find?.((t) => t.id === Number(id))!;

    return {
      data: translation
        ? {
            id: translation?.id,
            key: translation?.key,
            translation: translation[lang]!,
            lang,
            ns: translation.namespace,
          }
        : undefined,
      isReady: Boolean(lang && id && !translations.loading),
    };
  },
);

export const $createUpdateTranslation = createMutatorStore<iI18nTranslation>(
  ({ data, invalidate }) => {
    invalidate((k) => Boolean(k.match(I18N_KEYS.translationList[0] as string)));

    return fetch('/api/admin/i18n/create', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $deleteTranslation = createMutatorStore<Pick<tI18n, 'id'>>(
  ({ data, invalidate }) => {
    invalidate((k) => Boolean(k.match(I18N_KEYS.translationList[0] as string)));

    return fetch('/api/admin/i18n/delete', {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $refreshBotTranslations = createMutatorStore(() => {
  return fetch('/api/admin/i18n/refresh', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });
});

onSet($translations, () => {
  $refreshBotTranslations.mutate();
});
