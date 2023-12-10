import { ProductsProvider, WebAppProvider } from '../components/Providers';

import { ROUTES } from '../constants/routes';
import { MainPage } from './Main';
import { ProductListPage } from './ProductList';
import { ProductDetailPage } from './ProductDetail';
import { ProductCheckoutPage } from './ProductCheckout';
import { Outlet } from 'react-router-dom';

export const routes = [
  {
    path: ROUTES.MAIN,
    element: (
      <WebAppProvider>
        <MainPage />
      </WebAppProvider>
    ),
    children: [
      {
        path: ROUTES.PRODUCTS,
        element: (
          <ProductsProvider>
            <Outlet />
          </ProductsProvider>
        ),
        children: [
          {
            path: ROUTES.PRODUCTS,
            element: <ProductListPage />,
          },
          {
            path: ROUTES.PRODUCT_ITEM,
            element: <ProductDetailPage />,
          },
          {
            path: ROUTES.PRODUCT_CHECKOUT,
            element: <ProductCheckoutPage />,
          },
        ],
      },
    ],
  },
];
