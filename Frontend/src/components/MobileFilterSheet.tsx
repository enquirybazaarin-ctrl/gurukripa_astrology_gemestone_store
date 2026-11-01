import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FilterPanel } from './FilterPanel';
import { FilterConfig } from '../data/categoryFilters';

interface MobileFilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterConfig[];
    selectedFilters: Record<string, string[]>;
    priceRange: [number, number];
    onFilterChange: (filterId: string, value: string) => void;
    onPriceChange: (range: [number, number]) => void;
    onClearAll: () => void;
    onApply: () => void;
}

export const MobileFilterSheet = ({
    isOpen,
    onClose,
    filters,
    selectedFilters,
    priceRange,
    onFilterChange,
    onPriceChange,
    onClearAll,
    onApply,
}: MobileFilterSheetProps) => {
    // Prevent body scroll when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                {/* Handle Bar */}
                <div className="flex justify-center py-2">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close filters"
                    >
                        <FiX size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Filter Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <FilterPanel
                        filters={filters}
                        selectedFilters={selectedFilters}
                        priceRange={priceRange}
                        onFilterChange={onFilterChange}
                        onPriceChange={onPriceChange}
                        onClearAll={onClearAll}
                        isMobile={true}
                        onApply={() => {
                            onApply();
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
