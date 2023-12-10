export const tg = window.Telegram.WebApp;

const isChrome = false;

export function getUserId() {
  if (isChrome) {
    return 12;
  }

  return tg.initDataUnsafe.user?.id;
}

export function getInitData() {
  if (isChrome) {
    return '123';
  }
  return tg.initData;
}
