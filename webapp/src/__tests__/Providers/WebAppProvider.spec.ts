import { describe, it } from '@jest/globals';
import type { Server } from 'miragejs';
import { render } from '@testing-library/react';
import { createWrapper } from '../../utils/testing';
import { ROUTES } from '../../constants/routes';
import { setupMirage } from '../../utils/mirage';
import { TIDS } from '../../constants/testIds';

describe('WebAppProvider', () => {
  let server: Server;

  beforeEach(() => {
    server = setupMirage();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('ErrorOpenViaTelegram', () => {
    const original = window.Telegram.WebApp.initData;

    beforeEach(() => {
      window.Telegram.WebApp.initData = '';
    });

    afterEach(() => {
      window.Telegram.WebApp.initData = original;
    });

    it.each(Object.values(ROUTES))(
      'should show error state on %s if opened not in tg',
      async (route) => {
        const { queryByTestId } = render(
          createWrapper({ routerOptions: { initialEntries: [route] } }),
        );

        expect(queryByTestId(TIDS.ERR_OPEN_VIA_TG)).toBeInTheDocument();
      },
    );
  });
});
