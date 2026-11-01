import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store';
import { FiSmartphone, FiUser, FiArrowRight } from 'react-icons/fi';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';

export const LoginPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.identify({ name, phone });

      const { user, accessToken, csrfToken } = response.data;

      dispatch(setCredentials({
        user: user,
        accessToken: accessToken,
        csrfToken: csrfToken
      }));

      toast.success(`Welcome back, ${name}!`);
    } catch (err: any) {
      console.error('Login Error:', err);
      const msg = getErrorMessage(err, 'Failed to login. Please try again.');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-outfit">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="/banners/Logo/favbar.png"
            alt="Raja Home Decor"
            className="h-28 w-auto object-contain rounded-2xl shadow-lg shadow-black/10"
          />
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-3 text-center text-sm text-gray-500 font-medium">
          Enter your details to access your account effortlessly.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-12 border border-gray-100/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                  <FiSmartphone className="w-5 h-5" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="98765 43210"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 p-4 rounded-2xl border border-red-100 animate-fade-in">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-accent/10 text-base font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70 group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    Sign In Now
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400 font-medium uppercase tracking-[0.2em]">
                  Secure Authentication
                </span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-black font-semibold hover:underline">Terms</a>
                {' '}&{' '}
                <a href="/privacy" className="text-black font-semibold hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};
