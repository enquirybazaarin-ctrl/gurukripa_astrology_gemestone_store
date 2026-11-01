import React from 'react';
import { IVariantGroup, IVariantOption } from '../../types';

interface VariantSelectorProps {
    variants: IVariantGroup[];
    selectedVariants: Record<string, IVariantOption>;
    onChange: (groupName: string, option: IVariantOption) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selectedVariants, onChange }) => {
    if (!variants || variants.length === 0) return null;

    return (
        <div className="space-y-6 my-6">
            {variants.map((group) => (
                <div key={group.groupName} className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                        {group.groupName}: <span className="text-gray-500 font-normal capitalize">{selectedVariants[group.groupName]?.label}</span>
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {group.options.map((option) => {
                            const isSelected = selectedVariants[group.groupName]?.value === option.value;

                            if (group.uiType === 'color') {
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => onChange(group.groupName, option)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${isSelected ? 'border-gray-900 scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                        style={{ backgroundColor: option.meta || option.value }}
                                        title={option.label}
                                    />
                                );
                            }

                            if (group.uiType === 'image' && option.image) {
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => onChange(group.groupName, option)}
                                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-400'}`}
                                        title={option.label}
                                    >
                                        <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
                                    </button>
                                );
                            }

                            // Default Button / Dropdown (simplified to buttons for now)
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onChange(group.groupName, option)}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all
                    ${isSelected
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-900 border-gray-200 hover:border-gray-900'
                                        }
                  `}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
