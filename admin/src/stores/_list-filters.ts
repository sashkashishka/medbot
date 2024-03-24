import { computed, map } from 'nanostores';

export interface iPagination {
  page: number;
}

interface iOptions {
  take: number;
}

export function createListFilters<T extends iPagination>(
  defaultVal: T,
  options: iOptions,
) {
  const $listFilters = map<T>(defaultVal);

  const $listFilterQuery = computed($listFilters, (listFilters) =>
    Object.keys(listFilters).reduce((acc, key, i, arr) => {
      const val = listFilters[key as keyof T];
      const ampersand = arr.length - 1 > i ? '&' : '';

      switch (true) {
        case key === 'page': {
          const skip = Math.max((val as number) - 1, 0) * options.take;

          acc += `skip=${skip}&take=${options.take}${ampersand}`;

          break;
        }

        case val !== undefined: {
          acc += `${key}=${val}${ampersand}`;
          break;
        }

        default:
        // noop
      }

      return acc;
    }, '?'),
  );

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
    setListFilter,
    resetListFilter,
  };
}
