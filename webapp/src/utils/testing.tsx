import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes as defaultRoutes } from '../pages/routes';

interface iOptions {
  routes?: Parameters<typeof createMemoryRouter>[0];
  routerOptions: Parameters<typeof createMemoryRouter>[1];
}

export function createWrapper({
  routes = defaultRoutes,
  routerOptions,
}: iOptions) {
  const router = createMemoryRouter(routes, routerOptions);

  return <RouterProvider router={router} />;
}
