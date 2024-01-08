import { ReactNode, useLayoutEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useParams } from 'react-router-dom';
import { tg } from '../../../utils/tg';
import { initProductProviderStore$ } from '../../../stores/initProductProvider';
import { productId$ } from '../../../stores/product';
import { ErrorProductsInit } from '../../ErrorStates';
import { ActiveOrderGuard } from './ActiveOrderGuard';
import { Loader } from '../../Loader';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function ProductsProvider({ children }: iProps) {
  const initQuery = useStore(initProductProviderStore$);
  const { productId } = useParams();

  useLayoutEffect(() => {
    productId$.set(productId || '');
  }, [productId]);

  useLayoutEffect(() => {
    if (initQuery.fetched) {
      tg.ready();
    }
  }, [initQuery.fetched]);

  if (initQuery.loading) {
    return <Loader />;
  }

  if (initQuery.error) {
    return <ErrorProductsInit />;
  }

  return <ActiveOrderGuard>{children}</ActiveOrderGuard>;
}
