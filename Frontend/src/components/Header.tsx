import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { api } from '../services/api';
import { 
  FiShoppingCart, 
  FiUser, 
  FiChevronDown, 
  FiChevronRight,
  FiPhoneCall,
  FiMenu,
  FiX,
  FiHeart,
  FiPackage,
  FiHelpCircle,
  FiAward
} from 'react-icons/fi';
import { FaWhatsapp, FaOm } from 'react-icons/fa';
import { SearchBar } from './SearchBar';
import { useWishlist } from '../context/WishlistContext';
import { authService } from '../services/auth.service';
import { logout } from '../store/slices/authSlice';
import { clearCart, closeCart } from '../store/slices/cartSlice';

export const Header = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [mobileGemsOpen, setMobileGemsOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState('✨ 100% Certified Vedic Gemstones • Free Puja Included');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(true);

  useEffect(() => {
    const fetchAnnouncementSetting = async () => {
      try {
        const response = await api.get('/settings/public/announcement_bar');
        if (response.data.success && response.data.data?.setting) {
          const setting = response.data.data.setting.value;
          if (setting?.isActive !== undefined) setIsAnnouncementActive(setting.isActive);
          if (setting?.text) setAnnouncementText(setting.text);
        }
      } catch (error) {
        // Fallback default
      }
    };
    fetchAnnouncementSetting();
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdown(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(clearCart());
      dispatch(closeCart());
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    {
      title: 'Gemstones',
      link: '/category/yellow-sapphire-pukhraj',
      dropdown: [
        { name: 'Yellow Sapphire (Pukhraj / पुखराज)', link: '/category/yellow-sapphire-pukhraj' },
        { name: 'Blue Sapphire (Neelam / नीलम)', link: '/category/blue-sapphire-neelam' },
        { name: 'Emerald (Panna / पन्ना)', link: '/category/emerald-panna' },
        { name: 'Ruby (Manikya / माणिक्य)', link: '/category/ruby-manikya' },
        { name: 'Red Coral (Moonga / मूंगा)', link: '/category/red-coral-moonga' },
        { name: 'Pearl (Moti / मोती)', link: '/category/natural-pearl-moti' },
        { name: 'Hessonite (Gomed / गोमेद)', link: '/category/yellow-sapphire-pukhraj' },
        { name: "Cat's Eye (Lehsunia / लहसुनिया)", link: '/category/yellow-sapphire-pukhraj' }
      ]
    },
    {
      title: 'Services',
      link: '/#astrology-services',
      badge: 'Astrology',
      dropdown: [
        { name: 'Janam Kundli Analysis', link: '/#janam-kundli', desc: 'Detailed horoscope & planetary dasha reading' },
        { name: 'Kundli Milan & Matchmaking', link: '/#kundli-milan', desc: '36 Gun Milan & marriage harmony' },
        { name: 'Career & Business Astrology', link: '/#career-business', desc: 'Job promotions & business growth' },
        { name: 'Vedic Gemstone Consultation', link: '/#gemstone-consultation', desc: 'Lucky & life gemstone selection' },
        { name: 'Dosha Nivaran & Vedic Puja', link: '/#dosha-nivaran', desc: 'Kaal Sarp, Pitra & Sade Sati remedies' },
        { name: 'Vastu Shastra Consultation', link: '/#vastu-shastra', desc: 'Home & office energy balancing' },
        { name: 'Wealth & Debt Relief Astrology', link: '/#wealth-finance', desc: 'Financial stability & wealth yogas' },
        { name: 'Health, Children & Family Peace', link: '/#health-family', desc: 'Child progress & domestic harmony' }
      ]
    },
    {
      title: 'Rudraksha',
      link: '/category/rudraksha',
      dropdown: [
        { name: '1 Mukhi Rudraksha', link: '/category/rudraksha' },
        { name: '5 Mukhi Rudraksha', link: '/category/rudraksha' },
        { name: '7 Mukhi Rudraksha (Lakshmi)', link: '/category/rudraksha' },
        { name: 'Gauri Shankar Rudraksha', link: '/category/rudraksha' },
        { name: 'Siddh Rudraksha Mala', link: '/category/rudraksha' }
      ]
    },
    {
      title: 'Bracelets',
      link: '/category/bracelets',
      dropdown: [
        { name: 'Navratna Planetary Bracelet', link: '/category/bracelets' },
        { name: 'Pyrite Money Attraction Bracelet', link: '/category/bracelets' },
        { name: 'Tiger Eye Confidence Bracelet', link: '/category/bracelets' },
        { name: 'Rose Quartz Love Bracelet', link: '/category/bracelets' }
      ]
    },
    {
      title: 'Mala',
      link: '/category/mala',
      dropdown: [
        { name: 'Sphatik Mala (108 Beads)', link: '/category/mala' },
        { name: 'Original Tulsi Japa Mala', link: '/category/mala' },
        { name: 'Lotus Seed (Kamal Gatta) Mala', link: '/category/mala' }
      ]
    },
    {
      title: 'Rings',
      link: '/category/rings',
      dropdown: [
        { name: 'Panchdhatu Astrological Rings', link: '/category/rings' },
        { name: '925 Sterling Silver Rings', link: '/category/rings' },
        { name: '18K & 22K Hallmarked Gold Rings', link: '/category/rings' }
      ]
    },
    {
      title: 'Shivlings',
      link: '/category/shivlings',
    },
    {
      title: 'Free Gems Recommendation',
      link: '/free-janampatri',
      isHighlight: true
    },
    {
      title: 'Buying Guide',
      link: '/about'
    }
  ];

  const handleNavClick = (link: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    if (link.includes('#')) {
      const hash = link.split('#')[1];
      if (window.location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP UTILITY BAR (Matches reference image)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#1c1d21] text-gray-300 text-[11px] md:text-xs py-1.5 border-b border-gray-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Left: Quick Utility Links + Dynamic Admin Notice */}
          <div className="hidden lg:flex items-center gap-3 text-gray-300">
            {isAnnouncementActive && announcementText ? (
              <span className="text-amber-300/90 font-medium flex items-center gap-2">
                <span>{announcementText}</span>
                <span className="text-gray-600">|</span>
              </span>
            ) : null}
            <Link to="/checkout" className="hover:text-white transition-colors">Pay online</Link>
            <span className="text-gray-600">|</span>
            <Link to="/about" className="hover:text-white transition-colors">Publications</Link>
            <span className="text-gray-600">|</span>
            <Link to="/category/yellow-sapphire-pukhraj" className="hover:text-white transition-colors">New Arrival</Link>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">Cash on Delivery</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">Free Shipping</span>
            <span className="text-gray-600">|</span>
            <Link to="/faq" className="hover:text-white transition-colors">Blogs & FAQs</Link>
          </div>

          {/* Mobile Notice (Controlled by Admin Panel) */}
          <div className="lg:hidden text-amber-200/95 font-medium truncate max-w-[190px] xs:max-w-[260px] sm:max-w-md">
            {isAnnouncementActive ? announcementText : '✨ 100% Certified Vedic Gemstones • Free Puja Included'}
          </div>

          {/* Right: Quick Action Badges & Auth */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <Link 
              to="/category/crystal-products" 
              className="hidden sm:inline-block bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#166534] px-2.5 py-0.5 rounded-full font-bold text-[10px] md:text-[11px] transition-colors"
            >
              Crystal Products
            </Link>
            <Link 
              to="/category/rudraksha" 
              className="hidden sm:inline-block bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#166534] px-2.5 py-0.5 rounded-full font-bold text-[10px] md:text-[11px] transition-colors"
            >
              Rudraksha
            </Link>

            <span className="text-gray-600 hidden sm:inline">|</span>

            <Link to="/wishlist" className="hover:text-white transition-colors hidden sm:inline">
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            
            <span className="text-gray-600 hidden sm:inline">|</span>

            <Link 
              to={isAuthenticated ? "/profile" : "/login"} 
              className="hover:text-white font-medium transition-colors"
            >
              {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0] || 'Account'}` : 'Login / Register'}
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN HEADER (Logo, Wide Search, Phone Helpline, Cart)
      ───────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-2.5 md:py-3.5">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 md:gap-6">
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-gray-700 hover:text-[#eb651e] active:scale-95 rounded-lg transition-colors"
              aria-label="Open Navigation Menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Brand Logo with Colorful Lotus Gem */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl select-none">💎</span>
                </div>
              </div>
              
              <div className="flex flex-col leading-tight">
                <span className="text-sm sm:text-base md:text-xl font-black tracking-tight text-gray-900 uppercase">
                  GURU KRIPA <span className="text-[#eb651e]">ASTROLOGY & GEMS STONE</span>
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 tracking-wider uppercase truncate max-w-[160px] sm:max-w-none">
                  100% Certified Natural Gemstones
                </span>
              </div>
            </Link>
          </div>

          {/* Centered Wide Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar />
          </div>

          {/* Right Hotline Call & Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 whitespace-nowrap">
            
            {/* Hotline Call Button (#eb651e brand primary) */}
            <a
              href="tel:+919323600011"
              className="bg-[#eb651e] hover:bg-[#d25515] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all active:scale-95 shrink-0"
              title="Call for Astrological Gem Consultation"
            >
              <FiPhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              <span className="hidden sm:inline">+91 93236 00011</span>
              <span className="sm:hidden font-semibold">Call</span>
            </a>

            {/* User Account Menu */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="p-1.5 text-gray-700 hover:text-black transition-colors block"
                title="Account"
              >
                <FiUser className="w-5 h-5 md:w-6 md:h-6" />
              </Link>

              {isAuthenticated && showUserMenu && (
                <div className="absolute right-0 top-full w-48 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.phone}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">My Orders</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Wishlist</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-gray-50 font-medium">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative p-1.5 text-gray-700 hover:text-black transition-colors"
              title="Cart"
            >
              <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -top-1 -right-1 bg-[#eb651e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden mt-2">
          <SearchBar />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CATEGORY NAVIGATION BAR WITH DROPDOWNS (Desktop / Tablet)
      ───────────────────────────────────────────────────────────── */}
      <nav className="border-t border-b border-gray-200 bg-white relative z-40">
        <div className="container mx-auto px-4 overflow-visible">
          <div className="flex items-center justify-between gap-1 md:gap-5 lg:gap-6 overflow-x-auto md:overflow-visible scrollbar-hide py-0.5">
            {navItems.map((item, idx) => (
              <div 
                key={idx} 
                className="relative group shrink-0"
                onMouseEnter={() => setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to={item.link}
                  onClick={(e) => {
                    if (item.dropdown) {
                      e.preventDefault();
                      setActiveDropdown(prev => prev === item.title ? null : item.title);
                    } else {
                      handleNavClick(item.link);
                    }
                  }}
                  className={`flex items-center gap-1.5 py-2.5 px-2 md:px-3 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    item.isHighlight 
                      ? 'text-[#eb651e] hover:text-[#c85012] font-bold' 
                      : 'text-gray-800 hover:text-[#eb651e]'
                  }`}
                >
                  <span>{item.title}</span>
                  {'badge' in item && item.badge && (
                    <span className="text-[9px] bg-orange-100 text-[#eb651e] font-bold px-1.5 py-0.2 rounded-full uppercase leading-tight">
                      {item.badge}
                    </span>
                  )}
                  {item.dropdown && (
                    <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-amber-700 transition-transform duration-200 ${
                      activeDropdown === item.title ? 'rotate-180 text-amber-700' : 'group-hover:rotate-180'
                    }`} />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div 
                    className={`absolute ${idx > 5 ? 'right-0' : 'left-0'} top-full pt-1.5 ${item.title === 'Services' ? 'w-80' : 'w-64'} z-50 ${
                      activeDropdown === item.title ? 'block' : 'hidden group-hover:block'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2.5 overflow-hidden">
                      {item.title === 'Services' && (
                        <div className="px-4 py-2 bg-orange-50/80 border-b border-orange-100 mb-1 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#eb651e] uppercase tracking-wider">Astrology Consultations</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live on Call
                          </span>
                        </div>
                      )}
                      <div className="max-h-[380px] overflow-y-auto">
                        {item.dropdown.map((sub: any, sIdx: number) => (
                          <Link
                            key={sIdx}
                            to={sub.link}
                            onClick={() => handleNavClick(sub.link)}
                            className="block px-4 py-2 hover:bg-orange-50 hover:text-[#eb651e] transition-colors group/sub"
                          >
                            <div className="text-xs md:text-sm font-semibold text-gray-800 group-hover/sub:text-[#eb651e] flex items-center justify-between">
                              <span>{sub.name}</span>
                              <span className="text-[#eb651e] opacity-0 group-hover/sub:opacity-100 transition-opacity text-xs">→</span>
                            </div>
                            {sub.desc && (
                              <div className="text-[10px] text-gray-400 font-normal truncate mt-0.5">
                                {sub.desc}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                      {item.title === 'Services' && (
                        <div className="mt-1 pt-2 px-3 border-t border-gray-100 bg-gray-50/60">
                          <a
                            href="tel:+919323600011"
                            className="flex items-center justify-center gap-1.5 bg-[#eb651e] hover:bg-[#d25515] text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            <FiPhoneCall className="text-xs animate-pulse" />
                            <span>Direct Call: +91 93236 00011</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE SLIDE-OVER NAVIGATION DRAWER
      ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="fixed top-0 left-0 bottom-0 w-[84%] max-w-sm bg-white shadow-2xl flex flex-col z-[111] overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-base">
                  💎
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-tight uppercase leading-tight">
                    GURU KRIPA <span className="text-[#eb651e]">ASTROLOGY & GEMS STONE</span>
                  </h3>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                    100% Certified Vedic Gemstones
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/10 active:scale-90 transition-all"
                aria-label="Close menu"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Astrologer Direct Helpline Card */}
            <div className="p-3 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-orange-500/5 border-b border-orange-200/60">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#eb651e] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FiPhoneCall className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Astrologer Helpline</p>
                    <p className="text-xs font-black text-gray-900">+91 93236 00011</p>
                  </div>
                </div>
                <a
                  href="tel:+919323600011"
                  className="bg-[#eb651e] hover:bg-[#d25515] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 shrink-0"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto py-2 divide-y divide-gray-100">
              
              {/* 1. Astrology Services Section */}
              <div className="px-3 py-2">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-900 uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2 text-[#eb651e]">
                    <FaOm className="text-sm" />
                    <span>Astrology Services</span>
                    <span className="text-[9px] bg-orange-100 text-[#eb651e] px-1.5 py-0.2 rounded-full font-bold lowercase">
                      8 services
                    </span>
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#eb651e]' : ''}`} />
                </button>

                {mobileServicesOpen && (
                  <div className="mt-1 space-y-0.5 pl-2 border-l-2 border-orange-200 ml-1">
                    {navItems[1].dropdown?.map((service: any, sIdx: number) => (
                      <Link
                        key={sIdx}
                        to={service.link}
                        onClick={() => handleNavClick(service.link)}
                        className="block py-2 px-2.5 rounded-lg hover:bg-orange-50 active:bg-orange-100 transition-colors"
                      >
                        <div className="text-xs font-semibold text-gray-800 flex items-center justify-between">
                          <span>{service.name}</span>
                          <span className="text-[#eb651e] text-xs">→</span>
                        </div>
                        {service.desc && (
                          <div className="text-[10px] text-gray-500 font-normal mt-0.5 line-clamp-1">
                            {service.desc}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Gemstones Section */}
              <div className="px-3 py-2">
                <button
                  onClick={() => setMobileGemsOpen(!mobileGemsOpen)}
                  className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-900 uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2 text-gray-800">
                    <span>💎</span>
                    <span>Natural Gemstones</span>
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileGemsOpen ? 'rotate-180 text-[#eb651e]' : ''}`} />
                </button>

                {mobileGemsOpen && (
                  <div className="mt-1 space-y-0.5 pl-2 border-l-2 border-gray-200 ml-1">
                    {navItems[0].dropdown?.map((gem, gIdx) => (
                      <Link
                        key={gIdx}
                        to={gem.link}
                        onClick={() => handleNavClick(gem.link)}
                        className="block py-2 px-2.5 rounded-lg hover:bg-gray-50 text-xs font-medium text-gray-700 active:text-[#eb651e]"
                      >
                        {gem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Direct Category Links */}
              <div className="px-3 py-2 space-y-0.5">
                <Link
                  to="/category/rudraksha"
                  onClick={() => handleNavClick('/category/rudraksha')}
                  className="flex items-center justify-between py-2 px-2 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span>Rudraksha (रुद्राक्ष)</span>
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/category/bracelets"
                  onClick={() => handleNavClick('/category/bracelets')}
                  className="flex items-center justify-between py-2 px-2 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span>Astrological Bracelets</span>
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/category/mala"
                  onClick={() => handleNavClick('/category/mala')}
                  className="flex items-center justify-between py-2 px-2 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span>Siddh Jap Mala</span>
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/category/rings"
                  onClick={() => handleNavClick('/category/rings')}
                  className="flex items-center justify-between py-2 px-2 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span>Panchdhatu & Gold Rings</span>
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/category/shivlings"
                  onClick={() => handleNavClick('/category/shivlings')}
                  className="flex items-center justify-between py-2 px-2 rounded-lg text-xs font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span>Narmada & Sphatik Shivlings</span>
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>

              {/* 4. Special Cards */}
              <div className="p-3 space-y-2">
                <Link
                  to="/free-janampatri"
                  onClick={() => handleNavClick('/free-janampatri')}
                  className="block p-3 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700">फ्री जन्मपत्री / Free Gems Recommendation</span>
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded">FREE</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Get personalized gemstone suggestion by Acharya Ji</p>
                </Link>

                <Link
                  to="/about"
                  onClick={() => handleNavClick('/about')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <FiAward className="w-4 h-4 text-[#eb651e]" />
                  <span>Certification & Buying Guide</span>
                </Link>
              </div>

              {/* 5. Account & Wishlist Links */}
              <div className="px-3 py-2 space-y-0.5">
                <Link
                  to={isAuthenticated ? "/profile" : "/login"}
                  onClick={() => handleNavClick(isAuthenticated ? "/profile" : "/login")}
                  className="flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiUser className="w-4 h-4 text-gray-500" />
                  <span>{isAuthenticated ? `My Account (${user?.name?.split(' ')[0] || 'User'})` : 'Login / Register'}</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => handleNavClick('/wishlist')}
                  className="flex items-center justify-between py-2 px-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2.5">
                    <FiHeart className="w-4 h-4 text-gray-500" />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] bg-gray-200 font-bold px-1.5 py-0.5 rounded-full">{wishlistCount}</span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  onClick={() => handleNavClick('/orders')}
                  className="flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiPackage className="w-4 h-4 text-gray-500" />
                  <span>My Orders</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer with WhatsApp Action */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <a
                href="https://wa.me/919323600011?text=Hello%20Acharya%20Ji,%20I%20would%20like%20to%20consult%20about%20astrology%20and%20gemstones."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <FaWhatsapp className="text-base" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. FLOATING "फ्री जन्मपत्री / FREE KUNDLI" TAB (Desktop only)
      ───────────────────────────────────────────────────────────── */}
      <Link
        to="/free-janampatri"
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#e11d48] hover:bg-[#be123c] text-white py-4 px-2 rounded-l-xl shadow-2xl flex-col items-center justify-center gap-1 group transition-all duration-300 hover:pr-3 cursor-pointer"
        title="Get Free Kundli Gemstone Recommendation"
      >
        <span className="text-xs font-black tracking-widest [writing-mode:vertical-rl] rotate-180 uppercase select-none">
          फ्री जन्मपत्री
        </span>
        <span className="text-[10px] font-bold bg-white/20 px-1 py-0.5 rounded uppercase select-none mt-1">
          GEMS
        </span>
      </Link>
    </header>
  );
};
