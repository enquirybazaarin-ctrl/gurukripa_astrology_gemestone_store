import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { closeLoginModal, clearPendingActions } from '../store/slices/uiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { addToCart } from '../store/slices/cartSlice';
import { getErrorMessage } from '../utils/errorHandler';

export const LoginModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addToWishlist: addToWishlistContext } = useWishlist();
    const { isLoginModalOpen, pendingAction, pendingActionData, initialMode } = useSelector((state: RootState) => state.ui);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    const [mode, setMode] = useState<'LOGIN' | 'IDENTIFY'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Sync mode with Redux provided initialMode when modal opens
    useEffect(() => {
        if (isLoginModalOpen) {
            setMode(initialMode);
        }
    }, [isLoginModalOpen, initialMode]);

    const handleAuthSuccess = (response: any) => {
        dispatch(setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
            csrfToken: response.data.csrfToken
        }));

        if (pendingAction === 'CART' && pendingActionData) {
            dispatch(addToCart(pendingActionData));
            toast.success('Item added to cart');
            navigate('/checkout');
        } else if (pendingAction === 'WISHLIST' && pendingActionData?.productId) {
            addToWishlistContext(pendingActionData.productId);
            toast.success('Added to wishlist');
        } else if (pendingAction === 'CHECKOUT' && pendingActionData) {
            dispatch(addToCart(pendingActionData));
            navigate('/checkout');
        }

        dispatch(closeLoginModal());
        dispatch(clearPendingActions());
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please enter both email and password');

        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });
            toast.success('Logged in successfully!');
            handleAuthSuccess(response);
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Login failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || phone.length < 10) return toast.error('Please enter your name and a valid 10-digit number');

        setIsLoading(true);
        try {
            const response = await authService.identify({ name, phone });
            toast.success(`Welcome, ${name}!`);
            handleAuthSuccess(response);
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Identification failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isLoginModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={() => dispatch(closeLoginModal())}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center md:items-center p-0 md:p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="translate-y-full md:opacity-0 md:scale-95 md:translate-y-0"
                            enterTo="translate-y-0 md:opacity-100 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="translate-y-0 md:opacity-100 md:scale-100"
                            leaveTo="translate-y-full md:opacity-0 md:scale-95 md:translate-y-0"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl md:rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                <button
                                    onClick={() => dispatch(closeLoginModal())}
                                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>

                                <div className="mb-8 text-center">
                                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                                        {mode === 'IDENTIFY' ? 'Just a Quick Step' : 'Welcome Back'}
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {mode === 'IDENTIFY'
                                            ? 'Enter your details to proceed with your choice.'
                                            : 'Login to manage your orders and profile.'}
                                    </p >
                                </div >

                                <div className="space-y-4">
                                    {mode === 'IDENTIFY' ? (
                                        <form onSubmit={handleIdentify} className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium text-gray-900 transition-all placeholder:text-gray-400"
                                                    placeholder="Your Full Name"
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium text-gray-900 transition-all placeholder:text-gray-400"
                                                    placeholder="Mobile Number (10 digits)"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? 'Processing...' : 'Continue & Proceed'}
                                                {!isLoading && <FiChevronRight className="w-4 h-4" />}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium text-gray-900 transition-all placeholder:text-gray-400"
                                                    placeholder="Email Address"
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium text-gray-900 transition-all placeholder:text-gray-400"
                                                    placeholder="Password"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? 'Logging in...' : 'Sign In'}
                                                {!isLoading && <FiChevronRight className="w-4 h-4" />}
                                            </button>
                                        </form>
                                    )}


                                    <p className="text-xs text-center text-gray-400 mt-2 px-8">
                                        By continuing, you agree to our
                                        <a href="/terms" className="text-black hover:underline mx-1">Terms</a>
                                        &
                                        <a href="/privacy" className="text-black hover:underline mx-1">Privacy</a>
                                    </p>
                                </div>

                            </Dialog.Panel >
                        </Transition.Child >
                    </div >
                </div >
            </Dialog >
        </Transition >
    );
};
