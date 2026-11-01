
import { FiStar } from "react-icons/fi";
import { FaTag } from "react-icons/fa"; // Changed from fa6 to fa for compatibility

interface ProductInfoProps {
    title: string;
    badges: string[];
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviewCount: number;
    stock: number; // Added stock prop
}

export const ProductInfo = ({
    title,
    badges,
    price,
    originalPrice,
    discount,
    rating,
    reviewCount,
    stock,
}: ProductInfoProps) => {
    return (
        <div className="px-4 pt-4 pb-2 bg-white">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-medium tracking-wide border border-purple-100 uppercase"
                    >
                        {/* Dummy icon logic based on text, or generic */}
                        <FaTag className="w-3 h-3 mr-1" />
                        {badge}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-xl font-medium text-gray-900 leading-snug mb-2 font-sans">
                {title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-[4px]">
                    <span>{rating}</span>
                    <FiStar className="text-[10px] fill-current" />
                </div>
                <span className="text-gray-500 text-sm border-b border-dashed border-gray-400">
                    {reviewCount.toLocaleString()} Reviews
                </span>
            </div>

            {/* Price Block */}
            <div className="mb-2">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                        ₹{price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        MRP: ₹{originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                        {discount}% OFF
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-sm">Factory Price</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Tax included • Safely packed & delivered across India
                </p>

                {/* Urgency Signals */}
                <div className="mt-3 space-y-2">
                    {/* Low Stock Warning */}
                    {stock > 0 && stock < 10 && (
                        <p className="text-xs font-bold text-red-600 animate-pulse">
                            Hurry! Only {stock} left in stock!
                        </p>
                    )}

                    {/* Viewer Information */}
                    <p className="text-xs text-black font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                        {Math.floor(Math.random() * 15) + 12} people are viewing this right now
                    </p>
                </div>
            </div>
        </div>
    );
};
