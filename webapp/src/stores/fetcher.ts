import { map, onMount, task } from 'nanostores';
import { createApi } from '../utils/api';

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
  const fetcherStore$ = map<iFetcherStore<tData>>({
    fetched: false,
    loading: false,
    error: undefined,
    data: undefined,
  });

  onMount(fetcherStore$, () => {
    const api = createApi(url, requestInit);

    fetcherStore$.setKey('loading', true);
    fetcherStore$.setKey('error', undefined);

    task(async () => {
      try {
        const data = await api.request<tData>();

        fetcherStore$.setKey('data', data);
      } catch (e) {
        if (e instanceof Error) {
          fetcherStore$.setKey('error', e);
        }
      } finally {
        fetcherStore$.setKey('loading', false);
        fetcherStore$.setKey('fetched', false);
      }
    });

    return () => {
      api.controller.abort();
    };
  });

  return fetcherStore$;
}
