import { useId, useLayoutEffect } from 'react';
import { tg } from '../../utils/tg';
import { useWebAppContext } from '../WebAppProvider/context';
import { useSmoothButtonsTransition } from '../../hooks/useSmoothTgButtonTransition';

type tMainButtonProps = Partial<Window['Telegram']['WebApp']['MainButton']>;

interface iProps extends tMainButtonProps {
  progress?: boolean;
  disabled?: boolean;
  handleClick?(): void;
}

export function TgMainButton({
  text,
  progress = false,
  disabled = false,
  color,
  textColor,
  handleClick,
}: iProps): null {
  const buttonId = useId();
  const { MainButton } = useWebAppContext();

  useSmoothButtonsTransition({
    show: tg?.MainButton?.show,
    hide: tg?.MainButton?.hide,
    currentShowedIdRef: MainButton,
    id: buttonId,
  });

  useLayoutEffect(() => {
    tg?.MainButton?.setParams({
      color,
    });
  }, [color]);

  useLayoutEffect(() => {
    tg?.MainButton?.setParams({
      text_color: textColor,
    });
  }, [textColor]);

  useLayoutEffect(() => {
    tg?.MainButton?.setText(text || '');
  }, [text]);

  useLayoutEffect(() => {
    if (disabled) {
      tg?.MainButton?.disable();
    } else if (!disabled) {
      tg?.MainButton?.enable();
    }
  }, [disabled]);

  useLayoutEffect(() => {
    if (progress) {
      tg?.MainButton?.showProgress(false);
    } else if (!progress) {
      tg?.MainButton?.hideProgress();
    }
  }, [progress]);

  useLayoutEffect(() => {
    if (!handleClick) {
      return;
    }

    tg?.MainButton?.onClick(handleClick);
    return () => {
      tg?.MainButton?.offClick(handleClick);
    };
  }, [handleClick]);

  return null;
}
