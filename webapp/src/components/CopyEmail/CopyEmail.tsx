import { CopyToClipboard } from '../CopyToClipboard';
import { Link } from '../Link';

const EMAIL = 'medihelp.ua@gmail.com';

export function CopyEmail() {
  return (
    <CopyToClipboard text={EMAIL}>
      <Link to="#" external>
        {EMAIL}
      </Link>
    </CopyToClipboard>
  );
}
