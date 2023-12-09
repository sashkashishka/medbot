// setupTests.ts
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import type { TelegramWebApps } from './telegram-webapp';

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
    initData: '',
    initDataUnsafe: {
      user: {
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
