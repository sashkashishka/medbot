import { generatePath, useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $lastProduct } from '../../../../stores/product';

import styles from './LastOrder.module.css';
import { ROUTES } from '../../../../constants/routes';

export function LastOrder() {
  const navigate = useNavigate();
  const lastProduct = useStore($lastProduct);

  if (!lastProduct) return null;

  const { name, price } = lastProduct;

  return (
    <div
      className={styles.container}
      onClick={() =>
        navigate(
          generatePath(ROUTES.PRODUCT_CHECKOUT, {
            productId: String(lastProduct.id),
          }),
        )
      }
    >
      <p className={styles.title}>Ви зупинились на покупці цього пакету:</p>

      <div className={styles.card}>
        <span className={styles.name}>{name}</span>

        <span className={styles.price}>₴{price}</span>

        <svg
          className={styles.arrow}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height="18px"
          width="18px"
          version="1.1"
          viewBox="0 0 330 330"
        >
          <path d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213  C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  C255,161.018,253.42,157.202,250.606,154.389z" />
        </svg>
      </div>
    </div>
  );
}
