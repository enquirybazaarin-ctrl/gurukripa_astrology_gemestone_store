import { useState, useEffect } from 'react';
import { FiShoppingBag, FiZap } from "react-icons/fi";

interface DesktopStickyHeaderProps {
    title: string;
    image: string;
    price: number;
    originalPrice?: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
    isAuthenticated?: boolean;
}

export const DesktopStickyHeader = ({
    title,
    image,
    price,
    originalPrice,
    onAddToCart,
    onBuyNow,
    isAuthenticated = false
}: DesktopStickyHeaderProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the main image section (approx 600px)
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 bg-white z-[90] shadow-md border-b border-gray-200 hidden md:block animate-slideDown">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">

                {/* Product Summary */}
                <div className="flex items-center gap-4">
                    <img src={image} alt={title} className="w-10 h-10 object-cover rounded shadow-sm" />
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs">{title}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="font-bold text-gray-900">₹{price}</span>
                            {originalPrice && (
                                <span className="text-xs text-gray-500 line-through">₹{originalPrice}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onAddToCart}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                        <FiShoppingBag /> {isAuthenticated ? 'Add to Cart' : 'Login to Add'}
                    </button>
                    <button
                        onClick={onBuyNow}
                        className="bg-[#fb641b] hover:bg-[#e05a17] text-white px-8 py-2 rounded font-bold text-sm shadow-sm flex items-center gap-2 transition-colors uppercase"
                    >
                        <FiZap /> {isAuthenticated ? 'Buy Now' : 'Login to Buy'}
                    </button>
                </div>
            </div>
        </div>
    );
};
