import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { WebAppProvider } from './components/WebAppProvider/WebAppProvider.tsx';
import { AppProvider } from './components/AppProvider';
import { routes } from './pages/routes.tsx';

import './index.css';
import './global.css';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebAppProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </WebAppProvider>
  </React.StrictMode>,
);
