import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import { FilterConfig, priceRangeConfig } from '../data/categoryFilters';

interface FilterPanelProps {
    filters: FilterConfig[];
    selectedFilters: Record<string, string[]>;
    priceRange: [number, number];
    onFilterChange: (filterId: string, value: string) => void;
    onPriceChange: (range: [number, number]) => void;
    onClearAll: () => void;
    isMobile?: boolean;
    onApply?: () => void;
}

interface AccordionState {
    [key: string]: boolean;
}

export const FilterPanel = ({
    filters,
    selectedFilters,
    priceRange,
    onFilterChange,
    onPriceChange,
    onClearAll,
    isMobile = false,
    onApply,
}: FilterPanelProps) => {
    // Initialize all accordions as open
    const initialAccordionState: AccordionState = {};
    filters.forEach((filter) => {
        initialAccordionState[filter.id] = true;
    });
    initialAccordionState['price'] = true;

    const [accordionState, setAccordionState] = useState<AccordionState>(initialAccordionState);

    const toggleAccordion = (id: string) => {
        setAccordionState((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr.length > 0) ||
        priceRange[0] !== priceRangeConfig.min ||
        priceRange[1] !== priceRangeConfig.max;

    return (
        <div className={`bg-white ${isMobile ? '' : 'rounded-lg border border-gray-100 shadow-sm'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="divide-y divide-gray-100">
                {/* Price Range Filter */}
                <div className="p-5">
                    <button
                        onClick={() => toggleAccordion('price')}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="font-medium text-[15px] text-gray-800">Price Range</span>
                        {accordionState['price'] ? (
                            <FiChevronUp className="text-gray-500" />
                        ) : (
                            <FiChevronDown className="text-gray-500" />
                        )}
                    </button>

                    {accordionState['price'] && (
                        <div className="mt-5">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Min (₹)</label>
                                    <input
                                        type="number"
                                        min={priceRangeConfig.min}
                                        max={priceRangeConfig.max}
                                        value={priceRange[0]}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val <= priceRange[1]) {
                                                onPriceChange([val, priceRange[1]]);
                                            }
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                                    />
                                </div>
                                <div className="text-gray-400 font-medium mt-5">-</div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase">Max (₹)</label>
                                    <input
                                        type="number"
                                        min={priceRangeConfig.min}
                                        max={priceRangeConfig.max}
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val >= priceRange[0]) {
                                                onPriceChange([priceRange[0], val]);
                                            }
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Filters */}
                {filters.map((filter) => (
                    <div key={filter.id} className="p-5">
                        <button
                            onClick={() => toggleAccordion(filter.id)}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <span className="font-medium text-[15px] text-gray-800">{filter.name}</span>
                            {accordionState[filter.id] ? (
                                <FiChevronUp className="text-gray-500" />
                            ) : (
                                <FiChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {accordionState[filter.id] && (
                            <div className="mt-4 space-y-3">
                                {filter.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[filter.id]?.includes(option.value) || false}
                                            onChange={() => onFilterChange(filter.id, option.value)}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 accent-primary-600"
                                        />
                                        <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors flex items-center gap-1">
                                            {filter.id === 'rating' && <FiStar className="text-yellow-500 fill-current" />}
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Apply Button - Mobile Only */}
            {isMobile && onApply && (
                <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                        onClick={onApply}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    );
};
