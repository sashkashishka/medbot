import { useStore } from '@nanostores/react';

import { $productList } from '../../stores/product';
import { ProductItem } from './components/ProductItem';
import { LastOrder } from './components/LastOrder';

import styles from './ProductList.module.css';

export function ProductListPage() {
  const { data } = useStore($productList);

  return (
    <>
      <LastOrder />
      activate code
      <div className={styles.productList}>
        {data?.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
