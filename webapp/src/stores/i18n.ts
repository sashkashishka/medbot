import { type StoreValue, atom } from 'nanostores';
import { createI18n } from '@nanostores/i18n';
import { generatePath } from 'react-router-dom';

import { API } from '../constants/api';
import type { tLang } from '../types';
import { createApi } from '../utils/api';
import { NS, baseTranslation } from '../constants/i18n';

const $lang = atom<tLang>('uk');

export const i18n = createI18n($lang, {
  get(lang, [namespace]) {
    const api = createApi(
      generatePath(API.I18N, { lang, namespace }) as API.I18N,
    );

    return api.request();
  },
});

export const $t = i18n(NS.WEBAPP, baseTranslation);
export type tTranslations = StoreValue<typeof $t>;
