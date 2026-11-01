import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiMessageSquare,
  FiStar,
  FiImage,
  FiList,
  FiTag,
  FiSettings,
  FiVideo,
  FiX,
} from 'react-icons/fi';

interface SidebarProps {
  onClose?: () => void;
}

const menuItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/products', icon: FiPackage, label: 'Products' },
  { path: '/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/bulk-shipping', icon: FiTruck, label: 'Bulk Shipping' },
  { path: '/enquiries', icon: FiMessageSquare, label: 'Enquiries' },
  { path: '/reviews', icon: FiStar, label: 'Reviews' },
  { path: '/banners', icon: FiImage, label: 'Banners' },
  { path: '/stories', icon: FiVideo, label: 'Stories' },
  { path: '/categories', icon: FiList, label: 'Categories' },
  { path: '/coupons', icon: FiTag, label: 'Coupons' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];

export const Sidebar = ({ onClose }: SidebarProps = {}) => {
  const location = useLocation();

  return (
    <aside className="w-64 h-full bg-[#141415] text-white shadow-2xl flex flex-col border-r border-accent/5">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-[#eb651e] to-rose-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <span className="text-xl select-none">💎</span>
            </div>
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-white uppercase leading-tight">
              GURU KRIPA <span className="text-[#eb651e]">ASTROLOGY & GEMS STONE</span>
            </h1>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Admin Portal</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        )}
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/enquiries' && location.pathname === '/bulk-enquiries');

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`group flex items-center px-6 py-3.5 mx-3 mt-1 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-white text-black font-extrabold shadow-lg shadow-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className={`mr-3 text-lg ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
