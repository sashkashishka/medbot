import { useId, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWebAppContext } from '../WebAppProvider/context';
import { tg } from '../../utils/tg';
import { useSmoothButtonsTransition } from '../../hooks/useSmoothTgButtonTransition';

export function TgBackButton() {
  const buttonId = useId();
  const { BackButton } = useWebAppContext();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const handler = () => navigate(-1);

    tg.BackButton.onClick(handler);

    return () => {
      tg.BackButton.offClick(handler);
    };
  }, [navigate]);

  useSmoothButtonsTransition({
    show: tg?.BackButton?.show,
    hide: tg?.BackButton?.hide,
    currentShowedIdRef: BackButton,
    id: buttonId,
  });

  return null;
}
