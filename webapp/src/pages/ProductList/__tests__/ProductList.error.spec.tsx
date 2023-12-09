import { describe, it } from '@jest/globals';
import { type Server, Response } from 'miragejs';
import { allTasks } from 'nanostores';
import { render, waitFor } from '@testing-library/react';
import { createWrapper } from '../../../utils/testing';
import { ROUTES } from '../../../constants/routes';
import { setupMirage } from '../../../utils/mirage';
import { API } from '../../../constants/api';

describe('ProductList error', () => {
  let server: Server;

  beforeEach(() => {
    server = setupMirage();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should show error state if request failed', async () => {
    server.get(API.PRODUCT_LIST, () => {
      return new Response(
        500,
        {},
        { errors: ['The database went on vacation'] },
      );
    });

    const { getByTestId } = render(
      createWrapper({ routerOptions: { initialEntries: [ROUTES.PRODUCTS] } }),
    );

    await waitFor(allTasks);

    expect(getByTestId('prodict-list-error')).toBeInTheDocument();
  });
});
