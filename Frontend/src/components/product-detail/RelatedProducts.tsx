import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { api } from '../../services/api';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

interface Product {
    _id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    rating: number;
}

interface RelatedProductsProps {
    productId: string;
    categoryId: string;
}

export const RelatedProducts = ({ productId, categoryId }: RelatedProductsProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${productId}/related?limit=10`);
                const data = response.data;

                if (data.success) {
                    setProducts(data.data.products);
                }
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [productId]);

    if (loading) {
        return (
            <div className="space-y-4 py-8 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 px-4">You May Also Like</h3>
                <div className="px-4 overflow-hidden">
                    <div className="flex gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="min-w-[160px] md:min-w-[200px] flex-1">
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 py-8 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 px-4">You May Also Like</h3>

            <div className="px-4">
                <Swiper
                    modules={[FreeMode]}
                    spaceBetween={12}
                    slidesPerView={2.2}
                    freeMode={true}
                    grabCursor={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 3.2,
                            spaceBetween: 16,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                        },
                    }}
                    className="related-products-swiper"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <Link
                                to={`/product/${product._id}`}
                                className="block h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Product Image */}
                                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-3">
                                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                                        {product.name}
                                    </h4>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1.5 mb-2">
                                        <span className="text-sm font-bold text-gray-900">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-[10px] text-gray-400 line-through">
                                                ₹{product.originalPrice.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    {product.rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-accent text-white rounded text-[10px] font-bold">
                                                <span>{product.rating.toFixed(1)}</span>
                                                <FiStar size={8} fill="currentColor" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};
