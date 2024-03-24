import { useStore } from '@nanostores/react';
import { Link } from 'react-router-dom';
import { $products } from '../../../stores/product';
import { generatePath } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface iProps {
  productId: number;
}

export function ProductCell({ productId }: iProps) {
  const { data, loading } = useStore($products);

  const product = data?.find?.((p) => p.id === Number(productId));

  if (loading) return '-';

  return (
    <Link to={generatePath(ROUTES.EDIT_PRODUCT, { id: String(productId) })}>
      {product?.name}
    </Link>
  );
}
