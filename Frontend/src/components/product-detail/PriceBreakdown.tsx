import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

interface BreakdownItem {
    label: string;
    amount: number;
    type: 'base' | 'attribute' | 'addon';
}

interface PriceBreakdownProps {
    basePrice: number; // The absolute base price (e.g. Small Candle)
    attributes: BreakdownItem[];
    addons: BreakdownItem[];
    packMultiplier: number;
    finalPrice: number;
    unitLabel?: string; // e.g. "Candle"
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
    basePrice,
    attributes,
    addons,
    packMultiplier,
    finalPrice,
    unitLabel = 'Unit'
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const singleUnitTotal = basePrice + attributes.reduce((s, i) => s + i.amount, 0) + addons.reduce((s, i) => s + i.amount, 0);

    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiInfo className="text-blue-500" />
                    Price Breakdown
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
            </button>

            {isOpen && (
                <div className="p-4 pt-0 text-sm border-t border-gray-100 bg-white">
                    <div className="space-y-2 py-3">
                        {/* Base */}
                        <div className="flex justify-between text-gray-600">
                            <span>Base Price ({unitLabel})</span>
                            <span>₹{basePrice}</span>
                        </div>

                        {/* Attributes */}
                        {attributes.map((attr, idx) => (
                            <div key={`attr-${idx}`} className="flex justify-between text-gray-600 pl-2 border-l-2 border-blue-100">
                                <span>{attr.label}</span>
                                <span>+₹{attr.amount}</span>
                            </div>
                        ))}

                        {/* Add-Ons */}
                        {addons.map((addon, idx) => (
                            <div key={`addon-${idx}`} className="flex justify-between text-gray-600 pl-2 border-l-2 border-purple-100">
                                <span>{addon.label}</span>
                                <span>+₹{addon.amount}</span>
                            </div>
                        ))}

                        {/* Subtotal */}
                        <div className="flex justify-between font-medium text-gray-800 pt-2 border-t border-dashed border-gray-200">
                            <span>Single Unit Total</span>
                            <span>₹{singleUnitTotal}</span>
                        </div>

                        {/* Multiplier */}
                        {packMultiplier > 1 && (
                            <div className="flex justify-between items-center bg-green-50 p-2 rounded text-green-800 mt-2">
                                <span className="flex items-center gap-1">
                                    <span className="font-bold">x {packMultiplier}</span> Pack Multiplier
                                </span>
                                <span className="font-bold">Total: ₹{finalPrice}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
