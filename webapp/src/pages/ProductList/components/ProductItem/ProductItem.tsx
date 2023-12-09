import { Link, generatePath } from 'react-router-dom';
import type { iProduct } from '../../../../types';
import { ROUTES } from '../../../../constants/routes';

import styles from './ProductItem.module.css';

interface iProps extends iProduct {}

export function ProductItem({ id, name }: iProps) {
  return (
    <Link
      to={generatePath(ROUTES.PRODUCT_ITEM, { productId: String(id) })}
      className={styles.container}
      data-testid="product-item-link"
    >
      {name}
    </Link>
  );
}
