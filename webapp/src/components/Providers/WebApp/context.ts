import { type MutableRefObject, createContext, useContext } from 'react';

interface iWebAppContext {
  MainButton: MutableRefObject<null | string>;
  BackButton: MutableRefObject<null | string>;
}

const DEFAULT_WEBAPP_CONTEXT: iWebAppContext = {
  MainButton: { current: null },
  BackButton: { current: null },
};

export const webAppContext = createContext(DEFAULT_WEBAPP_CONTEXT);

export function useWebAppContext() {
  return useContext(webAppContext);
}
