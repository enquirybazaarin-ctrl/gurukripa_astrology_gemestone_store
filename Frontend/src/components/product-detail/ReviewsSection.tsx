import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { api } from '../../services/api';
import { ReviewSkeleton } from '../skeletons/ReviewSkeleton';


interface Review {
    _id: string;
    user?: { name: string };
    manualName?: string;
    rating: number;
    comment: string;
    images?: string[];
    video?: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    productId: string;
}

export const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (page === 1) setLoading(true);
                const response = await api.get(`/reviews/product/${productId}?page=${page}&limit=10`);
                const data = response.data;

                if (data.success && data.data.reviews) {
                    if (page === 1) {
                        setReviews(data.data.reviews);
                    } else {
                        setReviews(prev => [...prev, ...data.data.reviews]);
                    }
                    if (data.data.pagination) {
                        setHasMore(data.data.pagination.page < data.data.pagination.pages);
                    } else {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, page]);

    if (loading && reviews.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <ReviewSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>

            {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    No reviews yet. Be the first to review!
                </div>
            ) : (
                <>
                    <div className="space-y-0">
                        {(showAll ? reviews : reviews.slice(0, 2)).map((review) => (
                            <div
                                key={review._id}
                                className="py-4 border-b border-gray-100 last:border-0"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs uppercase shrink-0">
                                            {(review.manualName || review.user?.name || 'A')[0]}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900 text-sm block leading-tight">
                                                {review.manualName || review.user?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-yellow-400 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                size={12}
                                                fill={i < review.rating ? 'currentColor' : 'none'}
                                                className={i >= review.rating ? 'text-gray-200' : ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="pl-11">
                                    <p className="text-sm text-gray-700 leading-relaxed mt-1">{review.comment}</p>

                                    {/* Review Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
                                            {review.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt="Review attachment"
                                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 shrink-0"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Review Video */}
                                    {review.video && (
                                        <div className="mt-3 max-w-xs">
                                            <video controls className="w-full rounded-md bg-black">
                                                <source src={review.video} />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!showAll && reviews.length > 2 && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="w-full sm:w-auto px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all mt-6 mx-auto block shadow-sm"
                        >
                            View More Reviews
                        </button>
                    )}

                    {showAll && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                            {hasMore && (
                                <button
                                    onClick={() => setPage(page + 1)}
                                    className="w-full sm:w-auto px-8 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-md shadow-gray-200"
                                >
                                    Load More
                                </button>
                            )}
                            <button
                                onClick={() => setShowAll(false)}
                                className="w-full sm:w-auto px-8 py-2.5 border border-gray-200 rounded-full text-gray-700 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                View Less
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
