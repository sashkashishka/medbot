import { ReactNode, useLayoutEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useParams } from 'react-router-dom';
import { tg } from '../../utils/tg';
import { initStore$ } from '../../stores/init';
import { productId$ } from '../../stores/product';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function AppProvider({ children }: iProps) {
  const initData = useStore(initStore$);
  const { productId } = useParams();

  useLayoutEffect(() => {
    productId$.set(productId || '');
  }, [productId]);

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
