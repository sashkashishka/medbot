import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { createProduct$, productList$ } from '../../stores/product';
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
  const [product$] = useState(createProduct$(Number(id!)));
  const product = useStore(product$);
  const { loading, error } = useStore(productList$);

  if (loading || !product) {
    // TODO show skeletons
    return 'loading...';
  }

  if (error) {
    return <ErrorOpenViaTelegram />;
  }

  return (
    <div className={styles.container}>
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
