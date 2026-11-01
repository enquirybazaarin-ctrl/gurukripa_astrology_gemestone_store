import React from 'react';

interface ProductSpecificationsProps {
    product: {
        gemstoneType?: string;
        variety?: string;
        origin?: string;
        caratWeight?: number;
        shape?: string;
        cut?: string;
        color?: string;
        clarity?: string;
        treatment?: string;
        certification?: string;
        certificateLaboratory?: string;
        certificateNumber?: string;
        astrologicalAssociation?: string;
        material?: string;
        finish?: string;
        capacity?: number;
        weight?: number;
        dimensions?: {
            height?: number;
            width?: number;
            length?: number;
            weight?: number;
        };
        specifications?: Array<{ key: string; value: string }>;
    };
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
    const specs: Array<{ label: string; value: string }> = [];

    // Gemstone Specific Specifications
    if (product.gemstoneType) specs.push({ label: 'Gemstone Type', value: product.gemstoneType });
    if (product.variety) specs.push({ label: 'Variety / Indian Name', value: product.variety });
    if (product.origin) specs.push({ label: 'Origin / Mine', value: product.origin });

    if (product.caratWeight) {
        const carat = product.caratWeight;
        const ratti = (carat * 1.099).toFixed(2);
        specs.push({ label: 'Weight (Carat / Ratti)', value: `${carat} Carat (~${ratti} Ratti)` });
    }

    if (product.color) specs.push({ label: 'Color / Hue', value: product.color });
    if (product.shape) specs.push({ label: 'Shape & Cut', value: `${product.shape}${product.cut ? ` (${product.cut})` : ''}` });
    if (product.clarity) specs.push({ label: 'Clarity / Luster', value: product.clarity });
    if (product.treatment) specs.push({ label: 'Treatment Status', value: product.treatment });

    if (product.certification || product.certificateLaboratory) {
        specs.push({
            label: 'Certification',
            value: `${product.certificateLaboratory || 'Govt. Recognized Lab'}${product.certificateNumber ? ` (ID: ${product.certificateNumber})` : ''}`
        });
    }

    if (product.astrologicalAssociation) {
        specs.push({ label: 'Ruling Planet / Astrology', value: product.astrologicalAssociation });
    }

    // Legacy Fallbacks
    if (product.material) specs.push({ label: 'Material', value: product.material });
    if (product.finish) specs.push({ label: 'Finish', value: product.finish });

    // Custom Specs
    if (product.specifications && Array.isArray(product.specifications)) {
        product.specifications.forEach((spec) => {
            if (spec.key && spec.value) {
                specs.push({ label: spec.key, value: spec.value });
            }
        });
    }

    if (specs.length === 0) return null;

    return (
        <div className="border-t border-amber-100 bg-amber-50/30 rounded-xl p-5 pt-6 mt-6 border">
            <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                    Gemstone & Astrological Specifications
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {specs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-amber-100/60 last:border-0 sm:last:border-b">
                        <span className="text-sm text-gray-600 font-medium">{spec.label}</span>
                        <span className="text-sm text-gray-950 font-bold text-right ml-4">{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
