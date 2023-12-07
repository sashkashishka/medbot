import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { productList$ } from "../../stores/product";
import { ErrorOpenViaTelegram } from '../../components/ErrorOpenViaTelegram';
import type { iProduct } from "../../types";

interface iProps extends iProduct {}

export function ProductDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = useStore(productList$);

  if (loading || !data) {
    // TODO show skeletons
    return 'loading...';
  }

  if (error) {
    return <ErrorOpenViaTelegram />;
  }


  return <div>product detail: {id}</div>;
}
