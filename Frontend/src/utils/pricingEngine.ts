/**
 * Universal Pricing Engine (Frontend Version)
 * Centralized logic for calculating final product prices.
 * Mirrors backend logic for consistency.
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
        selectedVariant = product.variants.find((v: any) => v._id === selection.variantId || v.id === selection.variantId);
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
            selectedPack = selectedVariant.packs.find((p: any) => p._id === selection.packId || p.id === selection.packId);
        }
        // Fallback to top-level packs (if any, for backward compatibility or simple products)
        if (!selectedPack && product.packs?.length > 0) {
            selectedPack = product.packs.find((p: any) => p._id === selection.packId || p.id === selection.packId);
        }

        if (selectedPack) {
            // Pack Pricing Logic
            // If pack has a fixed price, usually it overrides the unit price logic
            // We assume the finalPrice returned here is the PRICE PER UNIT in the pack context or PRICE OF THE PACK?
            // Standard convention: If user buys "Pack of 2", quantity=1. 
            // If fixedPrice is set, that's the price of the pack.
            if (selectedPack.price && selectedPack.price > 0) {
                finalPrice = selectedPack.price;
            } else {
                // Auto-calculate if no fixed price? 
                // For now assume Pack Price is mandatory if valid
                finalPrice = selectedPack.price || (finalPrice * selectedPack.quantity);
            }
            packAdjustment = finalPrice - basePrice; // Just for breakdown logic (approx)
        }
    }

    // 3. Style Adjustment (Added to Price)
    let styleAdjustment = 0;
    if (selection.styleId) {
        // Find which pack is active to check for specific styles
        let activePack = null;
        if (selection.packId) {
            if (selectedVariant?.packs) activePack = selectedVariant.packs.find((p: any) => p._id === selection.packId || p.id === selection.packId);
            if (!activePack && product.packs) activePack = product.packs.find((p: any) => p._id === selection.packId || p.id === selection.packId);
        }

        const packStyles = (activePack as any)?.styles;

        if (packStyles && packStyles.length > 0) {
            // Priority: Find by ID or Label in pack styles
            const selectedStyleInPack = packStyles.find((s: any) =>
                s._id === selection.styleId || s.id === selection.styleId || s.label === selection.styleId
            );
            if (selectedStyleInPack) {
                styleAdjustment = selectedStyleInPack.priceAdjustment || 0;
            }
        } else if (product.styles?.length > 0) {
            // Fallback to global styles
            const selectedStyle = product.styles.find((s: any) =>
                s._id === selection.styleId || s.id === selection.styleId || s.label === selection.styleId
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
        selection.addOnIds.forEach((id: string) => {
            const addOn = product.addOns.find((a: any) => a._id === id || a.id === id);
            if (addOn) {
                addOnsTotal += addOn.price || 0;
            }
        });
        finalPrice += addOnsTotal;
    }

    // Calculate Discount
    // If originalPrice exists (on Pack, Variant or Base), use it to calculate discount
    let originalPrice = product.originalPrice;

    // 1. Pack Original Price (Highest Priority if pack selected)
    // We need to re-find selectedPack here or store it earlier. 
    // Optimization: Let's find logic above.
    // For now, re-find is safe.
    let activePack = null;
    if (selection.packId) {
        if (selectedVariant?.packs) activePack = selectedVariant.packs.find((p: any) => p._id === selection.packId || p.id === selection.packId);
        if (!activePack && product.packs) activePack = product.packs.find((p: any) => p._id === selection.packId || p.id === selection.packId);
    }

    if (activePack) {
        if (activePack.originalPrice) {
            originalPrice = activePack.originalPrice;
        } else {
            // If pack doesn't have explicit MRP, derive from variant/product MRP * quantity
            const unitMrp = selectedVariant?.originalPrice || product.originalPrice;
            if (unitMrp) {
                originalPrice = unitMrp * activePack.quantity;
            }
        }
    }
    // 2. Variant Original Price (Only if no pack selected)
    else if (selectedVariant && selectedVariant.originalPrice) {
        originalPrice = selectedVariant.originalPrice;
    }

    // Adjust original price as well to show accurate discount
    if (originalPrice) {
        // If style/add-ons add cost, they likely add to the "original" value too
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
