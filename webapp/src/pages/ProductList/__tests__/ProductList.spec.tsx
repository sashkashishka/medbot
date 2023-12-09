import { describe, it } from '@jest/globals';
import type { Server } from 'miragejs';
import { allTasks } from 'nanostores';
import { render, waitFor, act } from '@testing-library/react';
import { createWrapper } from '../../../utils/testing';
import { ROUTES } from '../../../constants/routes';
import { setupMirage } from '../../../utils/mirage';

describe('ProductList', () => {
  let server: Server;

  beforeEach(() => {
    server = setupMirage();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render product list', async () => {
    const { getAllByTestId } = render(
      createWrapper({ routerOptions: { initialEntries: [ROUTES.PRODUCTS] } }),
    );

    await waitFor(allTasks);

    expect(getAllByTestId('product-item-link')).toHaveLength(
      server.schema.db.products.length,
    );
  });

  it('should navigate to product detail', async () => {
    const { getAllByTestId, getByTestId } = render(
      createWrapper({ routerOptions: { initialEntries: [ROUTES.PRODUCTS] } }),
    );

    await waitFor(allTasks);

    const [link] = getAllByTestId('product-item-link');

    act(() => link.click());

    await waitFor(allTasks);

    expect(getByTestId('product-detail-container')).toBeInTheDocument();
  });
});
