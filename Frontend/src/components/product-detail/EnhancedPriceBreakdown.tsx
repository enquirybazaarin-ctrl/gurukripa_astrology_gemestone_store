import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiInfo, FiTag } from 'react-icons/fi';

interface EnhancedPriceBreakdownProps {
    basePrice: number;
    selectedSize?: { name: string; price: number } | null;
    selectedStyles: string[];
    productStyles?: { label: string; priceAdjustment: number }[];
    selectedPack?: {
        label: string;
        quantity: number;
        pricingType: 'auto' | 'discount' | 'fixed';
        fixedPrice?: number;
        discountPercent?: number;
    };
    finalPrice: number;
}

export const EnhancedPriceBreakdown = ({
    basePrice,
    selectedSize,
    selectedStyles,
    productStyles,
    selectedPack,
    finalPrice
}: EnhancedPriceBreakdownProps) => {
    const [isOpen, setIsOpen] = useState(true);

    // Calculate components
    const sizePrice = selectedSize ? selectedSize.price : basePrice;
    const sizeAdjustment = sizePrice - basePrice;

    // Calculate styles total
    let stylesAmount = 0;
    if (productStyles && selectedStyles.length > 0) {
        selectedStyles.forEach(styleLabel => {
            const style = productStyles.find(s => s.label === styleLabel);
            if (style) stylesAmount += style.priceAdjustment;
        });
    }

    const subtotal = sizePrice + stylesAmount;
    const packQuantity = selectedPack?.quantity || 1;

    // Calculate savings for discount packs
    const regularTotal = subtotal * packQuantity;
    let savings = 0;
    let savingsPercent = 0;

    if (selectedPack?.pricingType === 'discount' && selectedPack.discountPercent) {
        savings = regularTotal * (selectedPack.discountPercent / 100);
        savingsPercent = selectedPack.discountPercent;
    } else if (selectedPack?.pricingType === 'fixed' && selectedPack.fixedPrice) {
        savings = regularTotal - selectedPack.fixedPrice;
        savingsPercent = Math.round((savings / regularTotal) * 100);
    }

    const perItemPrice = Math.round(finalPrice / packQuantity);

    return (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiInfo className="text-primary-600" size={18} />
                    Price Breakdown
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                        ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                    </span>
                    {isOpen ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                </div>
            </button>

            {/* Breakdown Details */}
            {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* Base Price */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base Price</span>
                        <span className="font-medium text-gray-900">₹{basePrice}</span>
                    </div>

                    {/* Size Adjustment */}
                    {sizeAdjustment !== 0 && (
                        <div className="flex justify-between text-sm pl-3 border-l-2 border-blue-200">
                            <span className="text-gray-600">
                                Size: {selectedSize?.name}
                            </span>
                            <span className="font-medium text-blue-600">
                                +₹{sizeAdjustment}
                            </span>
                        </div>
                    )}

                    {/* Styles Adjustment */}
                    {selectedStyles.length > 0 && productStyles && (
                        <div className="flex flex-col gap-1 pl-3 border-l-2 border-purple-200">
                            {selectedStyles.map(styleLabel => {
                                const style = productStyles.find(s => s.label === styleLabel);
                                if (!style || style.priceAdjustment === 0) return null;
                                return (
                                    <div key={styleLabel} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{styleLabel}</span>
                                        <span className="font-medium text-purple-600">
                                            {style.priceAdjustment > 0 ? '+' : ''}₹{style.priceAdjustment}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Subtotal */}
                    {(sizeAdjustment !== 0 || stylesAmount !== 0) && (
                        <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gray-200">
                            <span className="text-gray-700 font-medium">Subtotal (per item)</span>
                            <span className="font-semibold text-gray-900">₹{subtotal}</span>
                        </div>
                    )}

                    {/* Pack Multiplier */}
                    {packQuantity > 1 && (
                        <>
                            <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-700 font-medium">
                                    Quantity: {packQuantity} items
                                </span>
                                <span className="font-semibold text-gray-900">
                                    ×{packQuantity}
                                </span>
                            </div>

                            {/* Regular Total (before discount) */}
                            {savings > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Regular Price</span>
                                    <span className="text-gray-500 line-through">
                                        ₹{Math.round(regularTotal).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Savings Display */}
                    {savings > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FiTag className="text-green-600" size={16} />
                                    <span className="text-sm font-medium text-green-800">
                                        You Save
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-green-700">
                                        ₹{Math.round(savings).toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-xs text-green-600">
                                        ({savingsPercent}% off)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Special Bundle Price Notice */}
                    {selectedPack?.pricingType === 'fixed' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">💎</span>
                                <div className="text-sm">
                                    <div className="font-medium text-blue-900">Special Bundle Price</div>
                                    <div className="text-blue-700 text-xs">All-inclusive package deal</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Per Item Price */}
                    {packQuantity > 1 && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Price per item</span>
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{perItemPrice.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Final Total */}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                        <span className="text-base font-semibold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-primary-600">
                            ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
