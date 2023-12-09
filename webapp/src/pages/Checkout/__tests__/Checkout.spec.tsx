import { describe, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { createWrapper } from '../../../utils/testing';
import { ROUTES } from '../../../constants/routes';

describe('Checkout', () => {
  it('should render Checkout', () => {
    render(
      createWrapper({ routerOptions: { initialEntries: [ROUTES.CHECKOUT] } }),
    );
  });
});
