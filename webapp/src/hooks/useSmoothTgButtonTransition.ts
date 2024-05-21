import { type MutableRefObject, useEffect } from 'react';

const _noop = () => {};

const TRANSITION_MS = 10;

export function useSmoothButtonsTransition({
  id,
  show = _noop,
  hide = _noop,
  currentShowedIdRef,
}: {
  id: string;
  show: typeof _noop | undefined;
  hide: typeof _noop | undefined;
  currentShowedIdRef: MutableRefObject<string | null>;
}) {
  useEffect(() => {
    show();
    currentShowedIdRef.current = id;

    return () => {
      currentShowedIdRef.current = null;
      setTimeout(() => {
        if (currentShowedIdRef.current) return;

        hide();
      }, TRANSITION_MS);
    };
  }, [hide, id, currentShowedIdRef, show]);
}
