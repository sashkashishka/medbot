import {
  createI18n as nanostoresCreateI18n,
  type I18n,
  type Messages,
  translationsLoading,
} from '@nanostores/i18n';
import { atom, computed, type WritableAtom } from 'nanostores';
import type { medbotNs } from './ns/medbot.js';
import type { ServiceApiSdk } from '../serviceApiSdk/sdk.js';

export type tLangs = 'uk';
export interface iTranslationBases {
  medbot: typeof medbotNs;
}
export type tNamespaces = keyof iTranslationBases;

export class Internationalisation {
  private serviceApiSdk: ServiceApiSdk;
  private createI18n: typeof nanostoresCreateI18n;

  private ns: Map<
    `${tLangs}:${tNamespaces}`,
    { i18n: I18n; $timestamp: WritableAtom<number>; t: Messages }
  >;

  private listeners: (() => void)[] = [];

  constructor(
    serviceApiSdk: ServiceApiSdk,
    createI18n: typeof nanostoresCreateI18n,
  ) {
    this.serviceApiSdk = serviceApiSdk;
    this.createI18n = createI18n;
    this.ns = new Map();

    this.addNs = this.addNs.bind(this);
    this.getNs = this.getNs.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.loading = this.loading.bind(this);
    this.refreshTranslations = this.refreshTranslations.bind(this);
  }

  private getKey(l: tLangs, n: tNamespaces) {
    return `${l}:${n}` as const;
  }

  public addNs<N extends tNamespaces>(
    lang: tLangs,
    namespace: N,
    base: iTranslationBases[N],
  ) {
    const key = this.getKey(lang, namespace);

    if (this.ns.get(key)) return;

    const serviceApiSdk = this.serviceApiSdk;
    const $lang = atom(lang);
    const $timestamp = atom(Date.now());

    const $locale = computed(
      [$lang, $timestamp],
      (lang, timestamp) => `${lang}@${timestamp}` as const,
    );

    const i18n = this.createI18n($locale, {
      async get(locale, [ns]) {
        const [l] = locale.split('@') as [tLangs, string];

        const [data] = await serviceApiSdk.getTranslations(l, ns);

        return (data || []).reduce(
          (acc, curr) => {
            acc[ns][curr.key] = curr[l];

            return acc;
          },
          { [ns]: {} },
        );
      },
    });

    const t = i18n(namespace, base);

    this.ns.set(key, { i18n, $timestamp, t });
  }

  public getNs<N extends tNamespaces>(lang: tLangs, namespace: N) {
    const { t } = this.ns.get(this.getKey(lang, namespace));

    return (t as Messages<iTranslationBases[N]>).get();
  }

  public subscribe() {
    this.listeners = [...this.ns.values()].map(({ t }) =>
      t.subscribe(() => {}),
    );
  }

  public unsubscribe() {
    this.listeners.forEach((fn) => fn());
  }

  public loading() {
    return Promise.all(
      [...this.ns.values()].map(({ i18n }) => translationsLoading(i18n)),
    );
  }

  public refreshTranslations() {
    this.ns.forEach(({ $timestamp }) => {
      $timestamp.set(Date.now());
    });
  }
}
