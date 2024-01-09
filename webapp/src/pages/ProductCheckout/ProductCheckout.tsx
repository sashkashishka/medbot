import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { useParams } from 'react-router-dom';

import { createWaitingForPaymentOrder } from '../../stores/order';
import { product$ } from '../../stores/product';
import { Loader } from '../../components/Loader';
import { ProductCheckoutForm } from './components/Form';

export function ProductCheckoutPage() {
  const { productId } = useParams();
  const [waitingForPaymentOrder$] = useState(
    createWaitingForPaymentOrder(productId!),
  );
  const { loading, data } = useStore(waitingForPaymentOrder$);
  const product = useStore(product$);

  if (loading) {
    return <Loader />;
  }

  return (
    <ProductCheckoutForm waitingForPaymentOrder={data} product={product!} />
  );
}
