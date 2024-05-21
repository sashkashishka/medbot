import { useStore } from '@nanostores/react';
import { TIDS } from '../../../constants/testIds';
import { getUserId } from '../../../utils/tg';
import { Button } from '../../Button';
import { CopyEmail } from '../../CopyEmail';
import { Emoji, type tEmojiList } from '../../Emoji';
import { $t } from '../../../stores/i18n';

import styles from './ErrorInit.module.css';

interface iProps {
  emoji: tEmojiList;
}

export function ErrorInit({ emoji }: iProps) {
  const t = useStore($t);
  return (
    <div data-testid={TIDS.ERR_PRODUCTS_INIT} className={styles.container}>
      <Emoji emoji={emoji} />
      <br />
      <br />
      {t.errorHappened}
      <br />
      <br />
      <Button type="button" onClick={() => window.location.reload()}>
        {t.reloadPage}
      </Button>
      <br />
      <br />
      {t.ifErrorOccuredAgain}
      <CopyEmail />
      <br />
      <br />
      <code>user: {getUserId()}</code>
    </div>
  );
}
