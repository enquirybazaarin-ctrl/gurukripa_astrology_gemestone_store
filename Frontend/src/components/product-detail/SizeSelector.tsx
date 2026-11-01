interface SizeSelectorProps {
    sizes: Array<{ name: string; price: number }>;
    selectedSize: { name: string; price: number } | null;
    onSelectSize: (size: { name: string; price: number } | null) => void;
}

export const SizeSelector = ({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) => {
    return (
        <div className="mb-5">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-3 ml-0.5">Select Size</h3>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {sizes.map((size, index) => {
                    const isSelected = selectedSize?.name === size.name;
                    return (
                        <button
                            key={index}
                            onClick={() => onSelectSize(isSelected ? null : size)}
                            className={`group relative flex flex-col items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200 min-w-[80px] sm:min-w-[100px] ${isSelected
                                ? 'border-black bg-black text-white z-10'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-black hover:bg-gray-50'
                                } cursor-pointer`}
                        >
                            <div className="text-[10px] font-black uppercase tracking-tight truncate w-full px-1">{size.name}</div>
                            <div className="text-xs font-black mt-0.5">₹{size.price.toLocaleString('en-IN')}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
