import { FiShoppingBag, FiZap } from "react-icons/fi";

interface StickyCTABarProps {
    price: number;
    originalPrice?: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
    ctaText?: string;
    className?: string;
    isAuthenticated?: boolean;
}

export const StickyCTABar = ({ onAddToCart, onBuyNow, className, isAuthenticated = false }: StickyCTABarProps) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden ${className || ''}`}>
            <div className="flex">
                {/* Add to Cart - Yellow/White */}
                <button
                    onClick={onAddToCart}
                    className="flex-1 bg-white text-black py-4 font-semibold text-sm uppercase tracking-wide border-t border-gray-200 active:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <FiShoppingBag className="w-4 h-4" />
                    {isAuthenticated ? 'Add to Cart' : 'Login to Add'}
                </button>

                {/* Buy Now - Orange */}
                <button
                    onClick={onBuyNow}
                    className="flex-1 bg-[#fb641b] text-white py-4 font-bold text-sm uppercase tracking-wide active:bg-[#e05a17] flex items-center justify-center gap-2"
                >
                    <FiZap className="w-4 h-4" />
                    {isAuthenticated ? 'Buy Now' : 'Login to Buy'}
                </button>
            </div>
        </div>
    );
};
