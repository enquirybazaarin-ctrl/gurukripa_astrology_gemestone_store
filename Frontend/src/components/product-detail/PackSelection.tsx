


export interface PackOption {
    id: string;
    label: string;
    price: number;
    originalPrice?: number;
    saveBadge?: string;
    subText: string;
    isBestValue?: boolean;
}

interface PackSelectionProps {
    packs: PackOption[];
    selectedPackId: string;
    onSelectPack: (id: string | null) => void;
}

export const PackSelection = ({ packs, selectedPackId, onSelectPack }: PackSelectionProps) => {
    return (
        <div className="bg-white py-3 mb-2">
            <div className="px-4 mb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Select Pack Size</h3>
            </div>

            <div className="flex flex-wrap px-4 gap-2">
                {packs.map((pack) => {
                    const isSelected = selectedPackId === pack.id;
                    return (
                        <div
                            key={pack.id}
                            onClick={() => onSelectPack(isSelected ? null : pack.id)}
                            className={`
                                flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer select-none relative min-w-[90px] text-center
                                ${isSelected
                                    ? 'border-gray-900 bg-gray-50 text-gray-900 font-bold'
                                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                                }
                            `}
                        >
                            {/* Subtle Discount Tag */}
                            {pack.saveBadge && (
                                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm ${isSelected ? 'bg-accent text-white' : 'bg-green-100 text-green-700'}`}>
                                    {pack.saveBadge}
                                </div>
                            )}

                            <div className="text-xs font-bold whitespace-nowrap mt-0.5">{pack.label}</div>

                            <div className="flex flex-col items-center leading-none mt-0.5">
                                <span className="text-[13px] font-bold">₹{pack.price}</span>
                                {pack.originalPrice && (
                                    <span className="text-[9px] text-gray-400 line-through mt-0.5 leading-none">₹{pack.originalPrice}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
