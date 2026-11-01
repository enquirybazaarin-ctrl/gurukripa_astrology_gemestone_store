import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setCredentials, setInitialized, logout as logoutAction } from './store/slices/authSlice';
import { authService } from './services/auth.service';
import { fetchCsrfToken } from './services/api';
import { MainLayout } from './layouts/MainLayout';
import { LoadingFallback } from './components/LoadingFallback';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ProductListPage = lazy(() => import('./pages/ProductListPage').then(module => ({ default: module.ProductListPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage')); // Default export
const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(module => ({ default: module.OrdersPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const FreeJanampatriPage = lazy(() => import('./pages/FreeJanampatriPage').then(module => ({ default: module.FreeJanampatriPage })));
const BulkEnquiryPage = lazy(() => import('./pages/BulkEnquiryPage').then(module => ({ default: module.BulkEnquiryPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(module => ({ default: module.CategoryPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(module => ({ default: module.WishlistPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(module => ({ default: module.FAQPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(module => ({ default: module.OrderTrackingPage })));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage').then(module => ({ default: module.RefundPolicyPage })));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage').then(module => ({ default: module.ShippingPolicyPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(module => ({ default: module.OrderSuccessPage })));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage').then(module => ({ default: module.OrderDetailPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then(module => ({ default: module.AboutUsPage })));

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data?.user) {
          dispatch(setCredentials({
            user: response.data.user,
            accessToken: '', // Token is managed via HttpOnly cookie
          }));
          await fetchCsrfToken();
        } else {
          dispatch(logoutAction());
        }
      } catch (error) {
        // Catch 401 or network errors and act as logged out
        dispatch(logoutAction());
      } finally {
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="category/:categorySlug" element={<CategoryPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="free-janampatri" element={<FreeJanampatriPage />} />
          <Route path="free-kundli" element={<FreeJanampatriPage />} />
          <Route path="bulk-enquiry" element={<FreeJanampatriPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route path="shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route
            path="tracking/:id"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
