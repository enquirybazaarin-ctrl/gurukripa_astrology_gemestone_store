import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiShoppingCart, FiHeart, FiLogOut, FiPackage, FiX } from 'react-icons/fi';
import { FaOm } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { logout } from '../store/slices/authSlice';
import { clearCart, closeCart } from '../store/slices/cartSlice';
import { useWishlist } from '../context/WishlistContext';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { wishlistCount } = useWishlist();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/#astrology-services', icon: FaOm, label: 'Services', isService: true },
    { path: '/wishlist', icon: FiHeart, label: 'Wishlist', badge: wishlistCount },
    { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: cartItemCount },
    { isAccountAction: isAuthenticated, path: isAuthenticated ? '' : '/login', icon: FiUser, label: isAuthenticated ? 'Account' : 'Login' },
  ];

  const handleServicesClick = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('astrology-services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#astrology-services');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
    } finally {
      dispatch(clearCart());
      dispatch(closeCart());
      dispatch(logout());
      setShowAccountMenu(false);
      navigate('/login');
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-[60] md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[max(0.35rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-around items-center py-1.5 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isService 
              ? location.hash === '#astrology-services' 
              : location.pathname === item.path || (item.label === 'Account' && showAccountMenu);
            const badgeCount = item.badge || 0;

            const buttonContent = (
              <div className="flex flex-col items-center justify-center relative w-full">
                <div className="relative">
                  <Icon className={`${isActive ? 'text-[#eb651e] scale-110' : 'text-gray-500'} text-lg transition-all duration-200`} />
                  {badgeCount > 0 && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={badgeCount}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15, duration: 0.2 }}
                        className="absolute -top-1.5 -right-2.5 bg-[#eb651e] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center border border-white shadow-xs"
                      >
                        {badgeCount}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
                <span className={`text-[10px] font-semibold mt-0.5 tracking-tight ${isActive ? 'text-[#eb651e] font-bold' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#eb651e] rounded-full"
                  />
                )}
              </div>
            );

            if (item.isService) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={handleServicesClick}
                  className="relative flex flex-col items-center justify-center flex-1 h-12 transition-all duration-200"
                >
                  {buttonContent}
                </button>
              );
            }

            if (item.isAccountAction) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="relative flex flex-col items-center justify-center flex-1 h-12 transition-all duration-200"
                >
                  {buttonContent}
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 h-12 transition-all duration-200"
              >
                {buttonContent}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Account Menu Overlay */}
      <AnimatePresence>
        {showAccountMenu && isAuthenticated && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccountMenu(false)}
              className="fixed inset-0 bg-black/60 z-[55] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-[70px] left-0 right-0 bg-white rounded-t-3xl z-[55] md:hidden shadow-2xl overflow-hidden pb-4"
            >
              <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/50 relative">
                <button
                  onClick={() => setShowAccountMenu(false)}
                  className="absolute right-6 top-6 p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-black"
                >
                  <FiX size={18} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-hover text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user?.name || 'User'}</h3>
                    <p className="text-sm text-gray-500 font-medium">{user?.phone}</p>
                    {user?.role === 'admin' && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="py-2 px-4 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setShowAccountMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                    <FiUser className="text-xl text-gray-600 group-hover:text-black" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-black">My Profile</span>
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setShowAccountMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                    <FiPackage className="text-xl text-gray-600 group-hover:text-black" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-black">My Orders</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setShowAccountMenu(false)}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                    <FiHeart className="text-xl text-gray-600 group-hover:text-black" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-black">Wishlist</span>
                </Link>

                <div className="my-2 border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-50 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100">
                    <FiLogOut className="text-xl text-red-600" />
                  </div>
                  <span className="font-semibold text-red-600">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
