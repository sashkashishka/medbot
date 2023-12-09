import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { productList$ } from '../../stores/product';
import { ROUTES } from '../../constants/routes';
// import type { iProduct } from '../../types';
import { ErrorOpenViaTelegram } from '../../components/ErrorOpenViaTelegram';
import { TgBackButton } from '../../components/TgBackButton';
import { TgMainButton } from '../../components/TgMainButton';

import styles from './ProductDetail.module.css';

// interface iProps extends iProduct {}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useStore(productList$);

  const product = data?.find((p) => Number(p.id) === Number(id));

  if (loading || !product) {
    // TODO show skeletons
    return 'product detail loading...';
  }

  if (error) {
    return <ErrorOpenViaTelegram testid="product-detail-error" />;
  }

  return (
    <div className={styles.container} data-testid="product-detail-container">
      <TgBackButton />

      <h2>{product.name}</h2>

      <p>{product.description}</p>

      <p>Ціна: {product.price}</p>

      <TgMainButton
        text="Замовити"
        handleClick={() => navigate(ROUTES.CHECKOUT)}
      />
    </div>
  );
}
