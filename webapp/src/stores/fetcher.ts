import { map, onMount, task, action } from 'nanostores';
import { createApi } from '../utils/api';
import { API } from '../constants/api';

interface iFetcherStoreOptions {
  url: string;
  requestInit?: RequestInit;
}

interface iFetcherStore<tData> {
  loading: boolean;
  error: Error | undefined;
  fetched: boolean;
  data: tData | undefined;
}

export function createFetcherStore<tData>({
  url,
  requestInit,
}: iFetcherStoreOptions) {
  const $fetcherStore = map<iFetcherStore<tData>>({
    fetched: false,
    loading: false,
    error: undefined,
    data: undefined,
  });

  let abortController: AbortController;

  onMount($fetcherStore, () => {
    const api = createApi(url as API, requestInit);

    abortController = api.controller;

    $fetcherStore.setKey('loading', true);
    $fetcherStore.setKey('error', undefined);

    task(async () => {
      try {
        const data = await api.request();

        $fetcherStore.setKey('data', data as tData);
      } catch (e) {
        if (e instanceof Error) {
          $fetcherStore.setKey('error', e);
        }
      } finally {
        $fetcherStore.setKey('loading', false);
        $fetcherStore.setKey('fetched', false);
      }
    });

    return () => {
      abortController.abort();
    };
  });

  const refetch = action($fetcherStore, 'refetch', async (store) => {
    const api = createApi(url as API, requestInit);

    abortController = api.controller;

    store.setKey('loading', true);
    store.setKey('error', undefined);

    try {
      const data = await api.request();

      store.setKey('data', data as tData);
    } catch (e) {
      if (e instanceof Error) {
        store.setKey('error', e);
      }
    } finally {
      store.setKey('loading', false);
      store.setKey('fetched', false);
    }
  });

  return {
    store: $fetcherStore,
    refetch,
  };
}
