import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './constants/routes.ts';
import { WebAppProvider } from './components/WebAppProvider/WebAppProvider.tsx';
import { AppProvider } from './components/AppProvider';
import { MainPage } from './pages/Main/Main.tsx';
import { ProductListPage } from './pages/ProductList/ProductList.tsx';
import { ProductDetailPage } from './pages/ProductDetail/ProductDetail.tsx';
import { CheckoutPage } from './pages/Checkout/Checkout.tsx';

import './index.css';
import './global.css';

const router = createBrowserRouter([
  {
    path: ROUTES.MAIN,
    element: <MainPage />,
  },
  {
    path: ROUTES.PRODUCTS,
    element: <ProductListPage />,
  },
  {
    path: ROUTES.PRODUCT_ITEM,
    element: <ProductDetailPage />,
  },
  {
    path: ROUTES.CHECKOUT,
    element: <CheckoutPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebAppProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </WebAppProvider>
  </React.StrictMode>,
);
