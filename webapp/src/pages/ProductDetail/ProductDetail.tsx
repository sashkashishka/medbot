import { generatePath, useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { $product } from '../../stores/product';
import { ROUTES } from '../../constants/routes';
import { TIDS } from '../../constants/testIds';
// import type { iProduct } from '../../types';
import { TgBackButton } from '../../components/TgBackButton';
import { TgMainButton } from '../../components/TgMainButton';
import { $t } from '../../stores/i18n';

import styles from './ProductDetail.module.css';

// interface iProps extends iProduct {}

export function ProductDetailPage() {
  const navigate = useNavigate();
  const product = useStore($product);
  const t = useStore($t);

  return (
    <div
      className={styles.container}
      data-testid={TIDS.PRODUCT_DETAIL_CONTAIENR}
    >
      <TgBackButton />

      <h2 className={styles.title}>{product?.name}</h2>

      <p>{product?.description}</p>

      <p className={styles.price}>
        {t.priceLabel({ price: `₴${product?.price}` })}{' '}
      </p>

      <TgMainButton
        text={t.orderBtn}
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
