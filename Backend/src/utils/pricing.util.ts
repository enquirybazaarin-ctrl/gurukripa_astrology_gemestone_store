/**
 * Pricing Utility for Mobile-First PDP
 * 
 * Calculates final product price based on:
 * - Size (absolute price)
 * - Pack (multiplier)
 * - Fragrance (price adjustment)
 * - Add-ons (lid option, etc.)
 */

export interface PricingInput {
    sizePrice: number;
    packMultiplier?: number;
    fragranceAdjustment?: number;
    addOns?: number;
}

export interface PackPricingInput {
    basePrice: number;
    quantity: number;
    pricingType: 'auto' | 'fixed' | 'discount';
    fixedPrice?: number;
    discountPercent?: number;
}

/**
 * Calculate final price for PDP
 * Formula: (SizePrice + FragranceAdjustment + AddOns) × PackMultiplier
 */
export function calculateFinalPrice(input: PricingInput): number {
    const {
        sizePrice,
        packMultiplier = 1,
        fragranceAdjustment = 0,
        addOns = 0
    } = input;

    const basePrice = sizePrice + fragranceAdjustment + addOns;
    const finalPrice = basePrice * packMultiplier;

    return Math.round(finalPrice * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate pack price based on pricing type
 */
export function calculatePackPrice(input: PackPricingInput): number {
    const { basePrice, quantity, pricingType, fixedPrice, discountPercent } = input;

    switch (pricingType) {
        case 'fixed':
            return fixedPrice || basePrice * quantity;

        case 'discount':
            if (discountPercent) {
                const discountedUnitPrice = basePrice * (1 - discountPercent / 100);
                return Math.round(discountedUnitPrice * quantity * 100) / 100;
            }
            return basePrice * quantity;

        case 'auto':
        default:
            return basePrice * quantity;
    }
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(sellingPrice: number, mrp: number): number {
    if (!mrp || mrp <= sellingPrice) return 0;

    const discount = ((mrp - sellingPrice) / mrp) * 100;
    return Math.round(discount);
}

/**
 * Validate pricing configuration
 */
export function validatePricing(input: PricingInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (input.sizePrice <= 0) {
        errors.push('Size price must be greater than 0');
    }

    if (input.packMultiplier && input.packMultiplier < 1) {
        errors.push('Pack multiplier must be at least 1');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
