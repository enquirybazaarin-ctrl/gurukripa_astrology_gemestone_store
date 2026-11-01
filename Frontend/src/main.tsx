import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store';
import { WishlistProvider } from './context/WishlistContext';
import { LoginModal } from './components/LoginModal';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <WishlistProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <App />
              <Toaster position="top-center" />
              <LoginModal />
            </BrowserRouter>
          </QueryClientProvider>
        </WishlistProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
