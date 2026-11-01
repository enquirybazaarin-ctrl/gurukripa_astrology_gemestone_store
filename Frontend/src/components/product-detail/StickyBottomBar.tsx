import { FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyBottomBarProps {
    finalPrice: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
    disabled?: boolean;
}

export const StickyBottomBar = ({
    finalPrice,
    onAddToCart,
    onBuyNow,
    disabled = false
}: StickyBottomBarProps) => {
    const { items } = useSelector((state: RootState) => state.cart);
    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[100] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
            <div className="flex w-full h-16">
                {/* Add to Cart - Left 50% */}
                <button
                    onClick={onAddToCart}
                    disabled={disabled}
                    className="flex-1 flex items-center justify-center bg-white text-gray-900 transition-all active:bg-gray-50 disabled:opacity-50"
                    aria-label="Add to Cart"
                >
                    <div className="relative">
                        <FiShoppingCart size={24} strokeWidth={2} />
                        <AnimatePresence mode="wait">
                            {cartItemCount > 0 && (
                                <motion.span
                                    key={cartItemCount}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                                    className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center border-2 border-white shadow-sm"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </button>

                {/* Buy Now - Right 50% */}
                <button
                    onClick={onBuyNow}
                    disabled={disabled}
                    className="flex-1 bg-gray-900 text-white transition-all active:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center leading-tight"
                >
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 mb-0.5">Buy Now</span>
                    <span className="text-sm font-bold tracking-tight">
                        ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                    </span>
                </button>
            </div>
        </div>
    );
};
