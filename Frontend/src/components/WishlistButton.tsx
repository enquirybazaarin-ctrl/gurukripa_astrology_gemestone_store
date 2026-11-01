import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

interface WishlistButtonProps {
    productId: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
    productId,
    className = '',
    size = 'md'
}) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [isLoading, setIsLoading] = useState(false);
    const inWishlist = isInWishlist(productId);

    const sizeClasses = {
        sm: 'w-8 h-8 text-base',
        md: 'w-10 h-10 text-lg',
        lg: 'w-12 h-12 text-xl'
    };

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            if (inWishlist) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (error: any) {
            console.error('Wishlist error:', error);
            alert(error.message || 'Failed to update wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-white
        shadow-md
        hover:shadow-lg
        transition-all
        duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
        ${className}
      `}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {inWishlist ? (
                <FaHeart className="text-red-500" />
            ) : (
                <FiHeart className="text-gray-600 hover:text-red-500" />
            )}
        </button>
    );
};
