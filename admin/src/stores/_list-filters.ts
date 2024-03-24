import { computed, map } from 'nanostores';

export interface iPagination {
  skip: number;
  take: number;
}

export function createListFilters<T extends iPagination>(defaultVal: T) {
  const $listFilters = map<T>(defaultVal);

  const $listFilterQuery = computed($listFilters, (listFilters) =>
    Object.keys(listFilters).reduce((acc, key, i, arr) => {
      const val = listFilters[key as keyof T];
      const ampersand = arr.length - 1 > i ? '&' : '';

      if (val !== undefined) {
        acc += `${key}=${val}${ampersand}`;
      }

      return acc;
    }, '?'),
  );

  function setPage(page: number, total: number) {
    const skip = Math.max(page - 1, 0) * defaultVal.take;

    if (skip >= total) return;

    // TODO: check
    // @ts-ignore
    $listFilters.setKey('skip', skip);
  }

  function setListFilter<K extends keyof T>(key: K, val: T[K]) {
    // TODO: check
    // @ts-ignore
    $listFilters.setKey(key, val);
  }

  function resetListFilter() {
    $listFilters.set(defaultVal);
  }

  return {
    $listFilters,
    $listFilterQuery,
    setPage,
    setListFilter,
    resetListFilter,
  };
}
