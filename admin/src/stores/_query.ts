import { nanoquery } from '@nanostores/query';

const buildApiRoute = (keys: (string | number | boolean)[]) =>
  `/api/admin/${keys.join('')}`;

export const [createFetcherStore, createMutatorStore] = nanoquery({
  async fetcher(...keys: (string | number | boolean)[]) {
    const response = await fetch(buildApiRoute(keys));

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    throw new FetchError(response.status, data);
  },
});

export class FetchError extends Error {
  constructor(
    public statusCode: number,
    public details: any,
    // eslint-disable-next-line
    ...args: any[]
  ) {
    super(...args);

    this.stack = new Error().stack;
  }
}
