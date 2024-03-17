import { useStore } from '@nanostores/react';

import { $productList } from '../../stores/product';
import { ActivateCode } from './components/ActivateCode';
import { LastOrder } from './components/LastOrder';
import { ProductItem } from './components/ProductItem';

import styles from './ProductList.module.css';

export function ProductListPage() {
  const { data } = useStore($productList);

  return (
    <>
      <ActivateCode />
      <LastOrder />
      <div className={styles.productList}>
        {data?.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
