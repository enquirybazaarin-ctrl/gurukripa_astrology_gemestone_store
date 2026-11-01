/**
 * Universal Pricing Engine
 * Centralized logic for calculating final product prices.
 * Used by: Backend (Cart/Order), Frontend (PDP), Admin (Preview)
 */

export interface PricingRule {
    variantId?: string;
    packId?: string;
    styleId?: string;
    addOnIds?: string[];
    quantity?: number;
}

export interface PricingResult {
    finalPrice: number;       // Unit price after all adjustments
    basePrice: number;        // Price before discount
    discountAmount: number;   // Total discount value
    discountPercent: number;  // Percentage off
    breakdown: {
        base: number;
        packAdjustment: number;
        styleAdjustment: number;
        addOnsTotal: number;
    };
}

export const calculateFinalPrice = (product: any, selection: PricingRule): PricingResult => {
    let finalPrice = product.price; // Start with base price
    let basePrice = product.price;

    // 1. Variant Selection (Overrides Base Price)
    let selectedVariant = null;
    if (selection.variantId && product.variants?.length > 0) {
        selectedVariant = product.variants.find((v: any) => v._id?.toString() === selection.variantId || v.id === selection.variantId);
        if (selectedVariant) {
            finalPrice = selectedVariant.price;
            basePrice = selectedVariant.price; // Variant becomes the new base
        }
    }

    // 2. Pack Selection (Overrides Variant/Base Price)
    let packAdjustment = 0;
    if (selection.packId) {
        // Check packs in selected variant first
        let selectedPack = null;
        if (selectedVariant?.packs?.length > 0) {
            selectedPack = selectedVariant.packs.find((p: any) => p._id?.toString() === selection.packId || p.id === selection.packId);
        }
        // Fallback to top-level packs (if any, for backward compatibility or simple products)
        if (!selectedPack && product.packs?.length > 0) {
            selectedPack = product.packs.find((p: any) => p._id?.toString() === selection.packId || p.id === selection.packId);
        }

        if (selectedPack) {
            // Pack Pricing Logic
            // If pack has a fixed price, it overrides everything
            if (selectedPack.price && selectedPack.price > 0) {
                // Calculate per-unit price from the pack
                // Pack price is usually for the WHOLE pack. 
                // We need to decide if finalPrice is PER ITEM or PER PACK. 
                // Standard ecommerce cart usually treats "Pack of 3" as Qty 1 of that Item.
                // So finalPrice should be the Price of the Pack.
                finalPrice = selectedPack.price;
            } else {
                // Auto-calculate if no fixed price? 
                // For now assume Pack Price is mandatory if valid
                finalPrice = selectedPack.price || (finalPrice * selectedPack.quantity);
            }
            packAdjustment = finalPrice - basePrice; // Just for breakdown
        }
    }

    // 3. Style Adjustment (Added to Price)
    let styleAdjustment = 0;
    if (selection.styleId) {
        // Find which pack is active to check for specific styles
        let activePack = null;
        if (selection.packId) {
            if (selectedVariant?.packs) activePack = selectedVariant.packs.find((p: any) => p._id?.toString() === selection.packId || p.id === selection.packId);
            if (!activePack && product.packs) activePack = product.packs.find((p: any) => p._id?.toString() === selection.packId || p.id === selection.packId);
        }

        const packStyles = (activePack as any)?.styles;

        if (packStyles && packStyles.length > 0) {
            // Priority: Find by ID or Label in pack styles
            const selectedStyleInPack = packStyles.find((s: any) =>
                s._id?.toString() === selection.styleId || s.id === selection.styleId || s.label === selection.styleId
            );
            if (selectedStyleInPack) {
                styleAdjustment = selectedStyleInPack.priceAdjustment || 0;
            }
        } else if (product.styles?.length > 0) {
            // Fallback to global styles
            const selectedStyle = product.styles.find((s: any) =>
                s._id?.toString() === selection.styleId || s.id === selection.styleId || s.label === selection.styleId
            );
            if (selectedStyle) {
                styleAdjustment = selectedStyle.priceAdjustment || 0;
            }
        }

        finalPrice += styleAdjustment;
    }

    // 4. Add-Ons (Added to Price)
    let addOnsTotal = 0;
    if (selection.addOnIds && selection.addOnIds.length > 0 && product.addOns?.length > 0) {
        selection.addOnIds.forEach(id => {
            const addOn = product.addOns.find((a: any) => a._id?.toString() === id || a.id === id);
            if (addOn) {
                addOnsTotal += addOn.price || 0;
            }
        });
        finalPrice += addOnsTotal;
    }

    // Calculate Discount
    // Calculate Discount
    // If originalPrice exists (on Pack, Variant or Base), use it to calculate discount
    let originalPrice = product.originalPrice;

    // 1. Pack Original Price (Highest Priority if pack selected)
    let activePack = null;
    if (selection.packId) {
        if (selectedVariant?.packs) activePack = selectedVariant.packs.find((p: any) => p._id?.toString() === selection.packId || p.id === selection.packId);
        if (!activePack && product.packs) activePack = product.packs.find((p: any) => p._id?.toString() === selection.packId || p.id === selection.packId);
    }

    if (activePack && activePack.originalPrice) {
        originalPrice = activePack.originalPrice;
    }
    // 2. Variant Original Price
    else if (selectedVariant && selectedVariant.originalPrice) {
        originalPrice = selectedVariant.originalPrice;
    }

    // If Add-ons/Styles added value, original price should pro-rate? 
    // Usually Original Price = Base Original + Style + Addons
    if (originalPrice) {
        originalPrice += styleAdjustment + addOnsTotal;
    }

    const discountAmount = Math.max(0, (originalPrice || finalPrice) - finalPrice);
    const discountPercent = originalPrice ? Math.round((discountAmount / originalPrice) * 100) : 0;

    return {
        finalPrice,
        basePrice: originalPrice || finalPrice,
        discountAmount,
        discountPercent,
        breakdown: {
            base: basePrice,
            packAdjustment,
            styleAdjustment,
            addOnsTotal
        }
    };
};
