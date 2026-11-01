interface Pack {
    _id?: string;
    label: string;
    quantity: number;
    pricingType?: 'auto' | 'discount' | 'fixed';
    fixedPrice?: number;
    discountPercent?: number;
    price?: number; // Universal model bundle price
}

interface PackSelectorProps {
    packs: Pack[];
    fragrances: string[];
    selectedPackId: string | null;
    selectedFragrance: string;
    onSelectPack: (packId: string | null) => void;
    onSelectFragrance: (fragrance: string) => void;
    productImage?: string;
    basePrice: number;
    baseOriginalPrice?: number; // Added to support MRP calculation
}

export const PackSelector = ({
    packs,
    fragrances,
    selectedPackId,
    selectedFragrance,
    onSelectPack,
    onSelectFragrance,
    productImage,
    basePrice,
    baseOriginalPrice
}: PackSelectorProps) => {

    const calculatePackPrice = (pack: Pack): number => {
        // Universal Model: pack has explicit price
        if (pack.price !== undefined) {
            return pack.price;
        }

        // Legacy fallback
        switch (pack.pricingType) {
            case 'fixed':
                return pack.fixedPrice || basePrice * pack.quantity;
            case 'discount':
                if (pack.discountPercent) {
                    return basePrice * pack.quantity * (1 - pack.discountPercent / 100);
                }
                return basePrice * pack.quantity;
            case 'auto':
            default:
                return basePrice * pack.quantity;
        }
    };

    return (
        <div className="mb-5">
            <div className="mb-5">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-3 ml-0.5">Select Pack</h3>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {packs.map((pack: Pack, index: number) => {
                        // Use _id if available, fallback to label (legacy)
                        const packId = pack._id || pack.label;
                        const packPrice = calculatePackPrice(pack);
                        const isSelected = selectedPackId === packId;

                        const unitMrp = baseOriginalPrice && baseOriginalPrice > basePrice ? baseOriginalPrice : basePrice;
                        const packMrp = unitMrp * pack.quantity;

                        let discountPercent = 0;
                        if (packMrp > packPrice) {
                            discountPercent = Math.round(((packMrp - packPrice) / packMrp) * 100);
                        }

                        let displayLabel = pack.label;
                        if (displayLabel.trim().toLowerCase() === 'pack of') {
                            displayLabel = `Pack of ${pack.quantity}`;
                        }

                        return (
                            <button
                                key={packId}
                                onClick={() => onSelectPack(isSelected ? null : packId)}
                                className={`group relative flex flex-col items-center justify-center px-2.5 py-1.5 rounded-md border transition-all duration-200 ${isSelected
                                    ? 'border-black bg-black text-white z-10 shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-black hover:bg-gray-50'
                                    } cursor-pointer mt-1`}
                            >
                                {/* Subtle Discount Tag */}
                                {discountPercent > 0 && (
                                    <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-1 py-0 rounded whitespace-nowrap shadow-sm tracking-tight transition-colors ${isSelected ? 'bg-white text-black border border-gray-100' : 'bg-green-600 text-white'}`}>
                                        {discountPercent}% OFF
                                    </div>
                                )}

                                <div className="text-[12px] sm:text-[13px] font-black uppercase tracking-tight truncate w-full text-center leading-none mt-0.5">{displayLabel}</div>

                                <div className="flex items-baseline justify-center gap-1 mt-1">
                                    <span className="text-[14px] font-black leading-none">₹{Math.round(packPrice).toLocaleString('en-IN')}</span>
                                    {discountPercent > 0 && (
                                        <span className={`text-[10px] line-through font-bold leading-none ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                            ₹{Math.round(packMrp).toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Fragrance Selector (Legacy/Context) */}
            {fragrances.length > 0 && (
                <div className="mb-5">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-3 ml-0.5">Choose Fragrance</h3>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {fragrances.map((fragrance: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => onSelectFragrance(fragrance)}
                                className={`px-2 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all duration-200 tracking-wider truncate px-1 text-center ${selectedFragrance === fragrance
                                    ? 'border-black bg-black text-white shadow-md'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:shadow-sm'
                                    }`}
                            >
                                {fragrance}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
