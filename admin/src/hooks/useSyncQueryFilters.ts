import { onSet, type MapStore } from 'nanostores';
import { useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { iPagination } from '../stores/_list-filters';

export function useSyncQueryFilters<T extends iPagination>(
  $store: MapStore<T>,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  useLayoutEffect(() => {
    searchParams.forEach((value, key) => {
      if (value !== undefined) {
        // @ts-ignore
        $store.setKey(key, value);
      }
    });
  }, []);

  useLayoutEffect(
    () =>
      onSet($store, ({ newValue }) => {
        const query = Object.keys(newValue).reduce<Record<string, any>>(
          (acc, key) => {
            const val = newValue[key as keyof T];

            if (val !== undefined) {
              acc[key] = val;
            }
            return acc;
          },
          {},
        );
        setSearchParams(query, { replace: true });
      }),
    [],
  );
}
