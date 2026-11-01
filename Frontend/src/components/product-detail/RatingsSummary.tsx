import { FiStar } from 'react-icons/fi';

interface RatingsSummaryProps {
    rating: number;
    totalReviews: number;
}

export const RatingsSummary = ({ rating, totalReviews }: RatingsSummaryProps) => {


    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 text-white rounded-md text-sm font-bold shadow-sm">
                <span>{rating.toFixed(1)}</span>
                <FiStar size={12} fill="currentColor" />
            </div>
            <span className="text-sm text-gray-600">
                ({totalReviews.toLocaleString('en-IN')} {totalReviews === 1 ? 'Review' : 'Reviews'})
            </span>
        </div>
    );
};
