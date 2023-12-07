import { nanoquery } from '@nanostores/query';

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (
    // eslint-disable-next-line
    ...keys: any[]
  ) => fetch(keys.join('')).then((r) => r.json()),
});
