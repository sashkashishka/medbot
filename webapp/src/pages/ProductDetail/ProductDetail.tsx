import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { productList$, product$ } from '../../stores/product';
import { ROUTES } from '../../constants/routes';
// import type { iProduct } from '../../types';
import { ErrorOpenViaTelegram } from '../../components/ErrorOpenViaTelegram';
import { TgBackButton } from '../../components/TgBackButton';
import { TgMainButton } from '../../components/TgMainButton';

import styles from './ProductDetail.module.css';

// interface iProps extends iProduct {}

export function ProductDetailPage() {
  const navigate = useNavigate();
  const product = useStore(product$);
  const { error } = useStore(productList$);

  if (error) {
    return <ErrorOpenViaTelegram testid="product-detail-error" />;
  }

  return (
    <div className={styles.container} data-testid="product-detail-container">
      <TgBackButton />

      <h2>{product?.name}</h2>

      <p>{product?.description}</p>

      <p>Ціна: {product?.price}</p>

      <TgMainButton
        text="Замовити"
        handleClick={() => navigate(ROUTES.CHECKOUT)}
      />
    </div>
  );
}
