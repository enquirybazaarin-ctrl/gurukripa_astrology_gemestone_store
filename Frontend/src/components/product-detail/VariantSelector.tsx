import React from 'react';

interface Variant {
    _id: string;
    label: string;
    price: number;
    originalPrice?: number;
    stock: number;
    // ... any other props needed
}

interface VariantSelectorProps {
    variants: Variant[];
    selectedVariantId: string | null;
    onSelectVariant: (variantId: string | null) => void;
}

export const VariantSelector = ({
    variants,
    selectedVariantId,
    onSelectVariant
}: VariantSelectorProps) => {
    return (
        <div className="mb-5">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-3 ml-0.5">Select Option</h3>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {variants.map((variant) => {
                    const isSelected = selectedVariantId === variant._id;
                    const price = variant.price;
                    const originalPrice = variant.originalPrice;

                    // Calculate Discount
                    let discountPercent = 0;
                    if (originalPrice && originalPrice > price) {
                        discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
                    }

                    return (
                        <button
                            key={variant._id}
                            onClick={() => onSelectVariant(isSelected ? null : variant._id)}
                            disabled={variant.stock === 0}
                            className={`group relative flex flex-col items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200 min-w-[100px] sm:min-w-[120px] ${isSelected
                                ? 'border-black bg-black text-white z-10'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-black hover:bg-gray-50'
                                } ${variant.stock === 0 ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                        >
                            {/* Discount Badge */}
                            {discountPercent > 0 && variant.stock > 0 && (
                                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm tracking-tighter transition-colors ${isSelected ? 'bg-white text-black border border-gray-100' : 'bg-green-600 text-white'
                                    }`}>
                                    {discountPercent}% OFF
                                </div>
                            )}

                            <div className="text-[10px] font-black uppercase tracking-tight truncate w-full px-1">{variant.label}</div>

                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-xs font-black">₹{price.toLocaleString('en-IN')}</span>
                                {originalPrice && originalPrice > price && (
                                    <span className={`text-[9px] line-through font-medium ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
                                        ₹{originalPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>

                            {/* Stock Indicator */}
                            {variant.stock > 0 && variant.stock < 5 && !isSelected && (
                                <div className="mt-1 text-[8px] font-black text-red-500 uppercase tracking-tighter">Only {variant.stock} left</div>
                            )}

                            {variant.stock === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/10 backdrop-blur-[0.5px] rounded-lg">
                                    <span className="bg-white/90 text-gray-900 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border border-gray-100 uppercase tracking-wider">Sold Out</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
