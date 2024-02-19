import { useStore } from '@nanostores/react';

import { $user } from '../../stores/user';
import { Loader } from '../../components/Loader';
import { ProductActivateCodeForm } from './components/Form';

export function ProductActivateCodePage() {
  const { data, loading } = useStore($user);

  if (loading) {
    return <Loader />;
  }

  return <ProductActivateCodeForm user={data} />;
}
