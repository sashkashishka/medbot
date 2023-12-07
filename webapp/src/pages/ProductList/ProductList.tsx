import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import cn from 'classnames';
import { productList$ } from '../../stores/product';
import { user$ } from '../../stores/user';
import { tg } from '../../utils/tg';
import { ErrorOpenViaTelegram } from '../../components/ErrorOpenViaTelegram';
import { ProductItem } from './components/ProductItem';

import styles from './ProductList.module.css';

// TODO if user has active order - show error state
export function ProductListPage() {
  const { data, loading, error } = useStore(productList$);

  useEffect(() => {
    if (!loading && data?.length) {
      tg.ready();
    }
  }, [loading, data]);

  if (loading || !data) {
    // TODO show skeletons
    return 'loading...';
  }

  if (error) {
    return <ErrorOpenViaTelegram />;
  }

  return (
    <div className={cn(styles.container)}>
      {data!.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
}
