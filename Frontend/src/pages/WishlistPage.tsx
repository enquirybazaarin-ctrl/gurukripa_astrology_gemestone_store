import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiHeart } from 'react-icons/fi';
import { ProductListSkeleton } from '../components/skeletons/ProductListSkeleton';
import { useDispatch } from 'react-redux';
import { ProductCard } from '../components/ProductCard';
import { addToCart, openCart } from '../store/slices/cartSlice';


export const WishlistPage = () => {
    const { wishlist, wishlistCount, clearWishlist, isLoading } = useWishlist();
    const navigate = useNavigate();

    const dispatch = useDispatch();


    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
            try {
                await clearWishlist();
            } catch (error) {
                console.error('Failed to clear wishlist:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
                    <ProductListSkeleton count={8} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 pb-28 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-gray-600 mt-1">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}</p>
                    </div>
                    {wishlistCount > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiTrash2 />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {wishlistCount === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FiHeart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                        {wishlist.map((item) => {
                            const mappedProduct = {
                                ...item.product,
                                id: (item.product as any)._id || (item.product as any).id,
                                title: (item.product as any).name || (item.product as any).title
                            };
                            return (
                                <div key={mappedProduct.id} className="h-full">
                                    <ProductCard product={mappedProduct as any} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
