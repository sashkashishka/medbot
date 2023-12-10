import { useStore } from '@nanostores/react';
import cn from 'classnames';
import { productList$ } from '../../stores/product';
import { ProductItem } from './components/ProductItem';

import styles from './ProductList.module.css';

export function ProductListPage() {
  const { data } = useStore(productList$);

  return (
    <div className={cn(styles.container)}>
      {data?.map((product) => <ProductItem key={product.id} {...product} />)}
    </div>
  );
}
