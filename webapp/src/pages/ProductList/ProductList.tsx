import { useStore } from '@nanostores/react';
import cn from 'classnames';
import { productList$ } from '../../stores/product';
import { ErrorOpenViaTelegram } from '../../components/ErrorOpenViaTelegram';
import { ProductItem } from './components/ProductItem';

import styles from './ProductList.module.css';

// TODO if user has active order - show error state 
// write guard and wrap it this component in router config
export function ProductListPage() {
  const { data, error } = useStore(productList$);

  if (error) {
    return <ErrorOpenViaTelegram testid="prodict-list-error" />;
  }

  return (
    <div className={cn(styles.container)}>
      {data!.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
}
