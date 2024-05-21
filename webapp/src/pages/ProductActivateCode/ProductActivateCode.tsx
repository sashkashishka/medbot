import { useStore } from '@nanostores/react';

import { $user } from '../../stores/user';
import { Loader } from '../../components/Loader';
import { ProductActivateCodeForm } from './components/Form';
import { $t } from '../../stores/i18n';
import { $config } from '../../stores/config';

export function ProductActivateCodePage() {
  const { data, loading } = useStore($user);
  const { data: config } = useStore($config);
  const t = useStore($t);

  if (loading) {
    return <Loader />;
  }

  return <ProductActivateCodeForm t={t} user={data} config={config!} />;
}
