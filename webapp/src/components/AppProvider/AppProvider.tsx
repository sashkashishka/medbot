import { ReactNode, useLayoutEffect } from 'react';
import { useStore } from '@nanostores/react';
import { tg } from '../../utils/tg';
import { initStore$ } from '../../stores/init';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function AppProvider({ children }: iProps) {
  const initData = useStore(initStore$);

  useLayoutEffect(() => {
    if (initData.fetched) {
      tg.ready();
    }
  }, [initData.fetched]);

  if (initData.loading) {
    // TODO use loader or skeleton
    return 'app context loading...';
  }

  return children;
}
