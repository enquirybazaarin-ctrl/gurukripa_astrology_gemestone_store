interface PricingBlockProps {
    price: number;
    originalPrice?: number;
}

export const PricingBlock = ({ price, originalPrice }: PricingBlockProps) => {
    const calculateDiscount = () => {
        if (!originalPrice || originalPrice <= price) return 0;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    };

    const discount = calculateDiscount();

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Selling Price */}
            <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900 tracking-tight">
                    ₹{price.toLocaleString('en-IN')}
                </span>
            </div>

            {/* MRP (Crossed Out) */}
            {originalPrice && originalPrice > price && (
                <div className="flex items-center text-gray-400 line-through decoration-gray-300">
                    <span className="text-xs font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>
                </div>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
                <div className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase tracking-wide shadow-sm">
                    {discount}% OFF
                </div>
            )}
        </div>
    );
};
