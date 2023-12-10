// setupTests.ts
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import type { TelegramWebApps } from './telegram-webapp';
import { TIDS } from './constants/testIds';

jest.unstable_mockModule('./components/TgBackButton', () => ({
  TgBackButton: function MockTgBackButton(props: any) {
    return <div data-testid={TIDS.TG_BACK_BUTTON} {...props} />;
  },
}));

interface iMockTgMainButtonProps extends TelegramWebApps.MainButton {
  handleClick(): void;
}

function MockTgMainButton({ handleClick, text }: iMockTgMainButtonProps) {
  return (
    <div data-testid={TIDS.TG_MAIN_BUTTON} onClick={handleClick}>
      {text}
    </div>
  );
}

jest.unstable_mockModule('./components/TgMainButton', () => ({
  TgMainButton: MockTgMainButton,
}));

const Telegram: TelegramWebApps.SDK = {
  WebApp: {
    offEvent: jest.fn(),
    onEvent: jest.fn(),
    expand: jest.fn(),
    readTextFromClipboard: jest.fn(),
    close: jest.fn(),
    closeScanQrPopup: jest.fn(),
    showScanQrPopup: jest.fn(),
    showConfirm: jest.fn(),
    showPopup: jest.fn(),
    showAlert: jest.fn(),
    openInvoice: jest.fn(),
    openTelegramLink: jest.fn(),
    openLink: jest.fn(),
    switchInlineQuery: jest.fn(),
    sendData: jest.fn(),
    disableClosingConfirmation: jest.fn(),
    enableClosingConfirmation: jest.fn(),
    setBackgroundColor: jest.fn(),
    setHeaderColor: jest.fn(),
    HapticFeedback: {
      impactOccurred: jest.fn(),
      notificationOccurred: jest.fn(),
      selectionChanged: jest.fn(),
    },
    isVersionAtLeast: jest.fn(() => true),
    ready: jest.fn(),
    initData: 'somedata',
    initDataUnsafe: {
      user: {
        id: 2102,
        is_bot: false,
        first_name: 'User',
      },
    },
    version: '6.9',
    platform: 'platform',
    colorScheme: 'dark',
    themeParams: {},
    isExpanded: true,
    viewportHeight: 100,
    viewportStableHeight: 100,
    headerColor: '#fff',
    backgroundColor: '#fff',
    MainButton: {
      text: 'MainButton',
      color: '#fff',
      isVisible: false,
      textColor: '#fff',
      setText: jest.fn(),
      onClick: jest.fn(),
      offClick: jest.fn(),

      isActive: true,
      isProgressVisible: false,
      show: jest.fn(),
      hide: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      showProgress: jest.fn(),
      hideProgress: jest.fn(),
      setParams: jest.fn(),
    },
    BackButton: {
      show: jest.fn(),
      onClick: jest.fn(),
      offClick: jest.fn(),
      hide: jest.fn(),
      isVisible: true,
    },
  },
};

window.Telegram = Telegram;
