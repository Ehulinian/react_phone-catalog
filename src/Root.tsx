import { Provider } from 'react-redux';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { App } from './App';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PhonesPage } from './pages/PhonesPage';
import { TabletsPage } from './pages/TabletsPage';
import { store } from './store/store';
import { FavoritesPage } from './pages/FavoritesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { CheckoutCancelPage } from './pages/CheckoutCancelPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ThemeProvider } from './store/ThemeContext';
import { RightsPage } from './pages/Rights/Rights';

export const Root = () => (
  <Router>
    <ThemeProvider>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />

            <Route path="phones">
              <Route index element={<PhonesPage />} />
              <Route path=":productId" element={<ProductDetailsPage />} />
            </Route>

            <Route path="tablets">
              <Route index element={<TabletsPage />} />
              <Route path=":productId" element={<ProductDetailsPage />} />
            </Route>

            <Route path="accessories">
              <Route index element={<AccessoriesPage />} />
              <Route path=":productId" element={<ProductDetailsPage />} />
            </Route>

            <Route path="cart" element={<CartPage />} />
            <Route path="checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="rights" element={<RightsPage />} />

            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Provider>
    </ThemeProvider>
  </Router>
);
