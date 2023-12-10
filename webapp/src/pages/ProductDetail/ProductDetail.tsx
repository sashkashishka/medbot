import { generatePath, useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { product$ } from '../../stores/product';
import { ROUTES } from '../../constants/routes';
import { TIDS } from '../../constants/testIds';
// import type { iProduct } from '../../types';
import { TgBackButton } from '../../components/TgBackButton';
import { TgMainButton } from '../../components/TgMainButton';

import styles from './ProductDetail.module.css';

// interface iProps extends iProduct {}

export function ProductDetailPage() {
  const navigate = useNavigate();
  const product = useStore(product$);

  return (
    <div
      className={styles.container}
      data-testid={TIDS.PRODUCT_DETAIL_CONTAIENR}
    >
      <TgBackButton />

      <h2>{product?.name}</h2>

      <p>{product?.description}</p>

      <p>Ціна: {product?.price}</p>

      <TgMainButton
        text="Замовити"
        // TODO test if clicking on main button navigates to checkout
        handleClick={() =>
          navigate(
            generatePath(ROUTES.PRODUCT_CHECKOUT, {
              productId: String(product?.id),
            }),
          )
        }
      />
    </div>
  );
}
