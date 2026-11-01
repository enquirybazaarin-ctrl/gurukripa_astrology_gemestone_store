
import React from 'react';
import { IAttribute, IAttributeOption } from '../../types';
import { FiCheck } from 'react-icons/fi';

interface ProductAttributesProps {
    attributes: IAttribute[];
    selectedAttributes: Record<string, string>;
    onChange: (attributeName: string, value: string) => void;
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
    attributes,
    selectedAttributes,
    onChange
}) => {
    if (!attributes || attributes.length === 0) return null;

    return (
        <div className="space-y-6 py-4 px-4 bg-white border-t border-gray-100">
            {attributes.map((attr) => (
                <div key={attr.name}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">{attr.name}</span>
                        {/* Display selected value label if needed */}
                        <span className="text-sm text-gray-500">
                            {selectedAttributes[attr.name] || 'Select'}
                        </span>
                    </div>

                    {attr.type === 'color' ? (
                        <div className="flex flex-wrap gap-3">
                            {attr.options.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => onChange(attr.name, option.label)}
                                    title={`${option.label}${option.priceAdjustment ? ` (${option.priceAdjustment > 0 ? '+' : ''}₹${option.priceAdjustment})` : ''}`}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedAttributes[attr.name] === option.label
                                        ? 'border-blue-600 scale-110 shadow-sm'
                                        : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: option.hexColor || '#eee' }}
                                >
                                    {selectedAttributes[attr.name] === option.label && (
                                        <FiCheck className={`w-5 h-5 ${isLightColor(option.hexColor) ? 'text-black' : 'text-white'}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : attr.type === 'radio' ? (
                        <div className="flex flex-wrap gap-2">
                            {attr.options.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => onChange(attr.name, option.label)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedAttributes[attr.name] === option.label
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {option.label}
                                    {option.priceAdjustment ? (
                                        <span className="ml-1 text-xs text-gray-500">
                                            ({option.priceAdjustment > 0 ? '+' : ''}₹{option.priceAdjustment})
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Select / Dropdown
                        <div className="relative">
                            <select
                                value={selectedAttributes[attr.name] || ''}
                                onChange={(e) => onChange(attr.name, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="" disabled>Select {attr.name}</option>
                                {attr.options.map((option) => (
                                    <option key={option.label} value={option.label}>
                                        {option.label} {option.priceAdjustment ? `(${option.priceAdjustment > 0 ? '+' : ''}₹${option.priceAdjustment})` : ''}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Helper to check for light colors to adjust checkmark contrast
const isLightColor = (hex?: string) => {
    if (!hex) return true;
    const c = hex.substring(1);      // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >> 8) & 0xff;  // extract green
    const b = (rgb >> 0) & 0xff;  // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma > 180;
};
