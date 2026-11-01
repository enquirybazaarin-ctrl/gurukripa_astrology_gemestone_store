import { Product } from '../types';

export interface ProductSection {
    id: string;
    type: string;
    data?: any;
}

export const generateDefaultSections = (product: Product | Partial<Product>): ProductSection[] => {
    return [
        {
            id: "product_specs",
            type: "product_specs",
            data: {
                specs: [
                    { label: 'Category', value: product.category || 'General' },
                    { label: 'Material', value: product.material || 'Standard' },
                    { label: 'Finish', value: product.finish || 'Standard' },
                    { label: 'Usage', value: (product as any).occasion || 'Home Decor' },
                ]
            }
        },
        {
            id: "usage_scenarios",
            type: "usage_scenarios",
            data: {
                scenarios: [{ label: 'Home Décor' }, { label: 'Gifting' }, { label: 'Festivals' }]
            }
        },
        { id: "packaging_delivery", type: "packaging_delivery" },
        { id: "reviews", type: "reviews" },
        { id: "faq", type: "faq" },
        { id: "related_products", type: "related_products" }
    ];
};
