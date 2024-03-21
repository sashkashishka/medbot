import { computed, map } from 'nanostores';

interface iPaginator {
  skip: number;
  take: number;
}

export function createPaginator(defaultTake = 20) {
  const $store = map<iPaginator>({ skip: 0, take: defaultTake });
  const $pageParams = computed($store, ({ skip, take }) => `${take}/${skip}`);

  function setPage(page: number, total: number) {
    const skip = Math.max(page - 1, 0) * defaultTake;

    if (skip >= total) return;

    $store.setKey('skip', skip);
  }

  return {
    $paginator: $store,
    $pageParams,
    setPage,
  };
}
