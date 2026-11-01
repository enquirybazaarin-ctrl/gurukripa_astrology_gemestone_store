export interface IVariantOption {
    _id?: string;
    label: string;
    value: string;
    priceModifier: number;
    priceType: 'absolute' | 'percentage';
    stock?: number;
    image?: string;
    meta?: string;
}

export interface IVariantGroup {
    groupName: string;
    uiType: 'button' | 'dropdown' | 'color' | 'image';
    required: boolean;
    allowMultiple: boolean;
    options: IVariantOption[];
}


export interface IAddOn {
    name: string;
    pricingMode: 'flat' | 'size_dependent';
    flatPrice?: number;
    sizePricing?: { sizeLabel: string, price: number }[];
    isRequired?: boolean;
}

export interface IAttributeOption {
    label: string;
    value?: string;
    absolutePrice?: number; // New
    priceAdjustment?: number;
    multiplier?: number;
    skuCode?: string;
    isDefault?: boolean;
    hexColor?: string;
}

export interface IAttribute {
    name: string;
    type: 'select' | 'radio' | 'color';
    isRequired: boolean;
    isBaseAttribute?: boolean; // New
    affectsPrice: boolean;
    isMultiplier: boolean;
    options: IAttributeOption[];
}

export interface Product {
    id: string;
    _id?: string; // For backend compatibility
    title: string; // Mapped from name
    name?: string; // Backend field
    price: number;
    originalPrice?: number;
    images: string[];
    rating: number;
    totalReviews: number;
    slug?: string;
    category: string;
    categoryId?: string;
    categorySlug?: string;
    categoryName?: string;
    description?: string;
    shortDescription?: string;
    tags?: string[];
    stock?: number;
    sku?: string;
    variants?: IVariantGroup[];
    attributes?: IAttribute[];
    addOns?: IAddOn[]; // New

    // Gemstone Specific Fields
    gemstoneType?: string;
    variety?: string;
    origin?: string;
    caratWeight?: number;
    shape?: string;
    cut?: string;
    color?: string;
    clarity?: string;
    treatment?: string;
    certification?: 'Certified' | 'Non-certified';
    certificateNumber?: string;
    certificateLaboratory?: string;
    astrologicalAssociation?: string;
    [key: string]: any;
}

export interface Category {
    id: string;
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}
