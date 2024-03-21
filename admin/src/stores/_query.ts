import { nanoquery } from '@nanostores/query';

const buildApiRoute = (keys: (string | number | boolean)[]) => `/api/admin/${keys.join('/')}`

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher(...keys: (string | number | boolean)[]) {
    return fetch(buildApiRoute(keys)).then((r) => r.json())
  },
});
