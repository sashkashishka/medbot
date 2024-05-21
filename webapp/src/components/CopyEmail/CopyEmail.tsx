import { useStore } from '@nanostores/react';
import { CopyToClipboard } from '../CopyToClipboard';
import { Link } from '../Link';
import { $config } from '../../stores/config';

export function CopyEmail() {
  const { data } = useStore($config);

  return (
    <CopyToClipboard text={data?.googleEmail!}>
      <Link to="#" external>
        {data?.googleEmail}
      </Link>
    </CopyToClipboard>
  );
}
