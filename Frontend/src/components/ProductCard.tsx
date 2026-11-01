import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { Product } from '../types';
import { FiStar, FiShoppingBag } from 'react-icons/fi';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Calculate discount percentage if not provided
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    const cartItem = {
      productId: product.id,
      name: product.title,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
    dispatch(openCart());
  };

  return (
    <a
      href={`/product/${product.id}`}
      className="bg-white border border-gray-100 rounded-xl p-3 block hover:shadow-2xl hover:shadow-accent/5 transition-all group h-full cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square mb-2 overflow-hidden flex items-center justify-center rounded-md bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.title}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.preventDefault()}>
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* Desktop Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-primary-900 text-white font-bold py-2.5 rounded-lg shadow-lg hover:bg-accent transition-all text-xs uppercase tracking-widest active:scale-95"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-primary-600 transition-colors" title={product.title}>
          {product.title}
        </h3>

        {/* Gemstone Badges */}
        {(product.origin || product.caratWeight || product.variety) && (
          <div className="flex flex-wrap gap-1.5 py-0.5">
            {product.origin && (
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 px-1.5 py-0.5 rounded">
                {product.origin}
              </span>
            )}
            {product.caratWeight && (
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                {product.caratWeight} Ct (~{(product.caratWeight * 1.099).toFixed(1)} Ratti)
              </span>
            )}
          </div>
        )}

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
        )}

        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            <span>{product.rating}</span>
            <FiStar className="text-[10px] fill-current" />
          </div>
          <span className="text-xs text-gray-400">({(product.totalReviews || 0).toLocaleString()})</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-base font-bold text-gray-900 font-sans tracking-tight">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                {discount > 0 && (
                  <span className="text-xs font-bold text-accent">{discount}% off</span>
                )}
              </>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            onClick={handleQuickAdd}
            className="md:hidden p-2 bg-gray-100 rounded-full active:bg-gray-200 text-gray-900"
          >
            <FiShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </a>
  );
};
