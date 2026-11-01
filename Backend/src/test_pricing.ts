
import { PricingService } from './modules/products/pricing.service';
import { IProduct } from './modules/products/product.model';

// Mock Product
const mockProduct: Partial<IProduct> = {
    price: 100,
    attributes: [
        {
            name: "Size",
            type: "select",
            isRequired: true,
            affectsPrice: true,
            isMultiplier: false,
            options: [
                { label: "Small", priceAdjustment: 0 },
                { label: "Large", priceAdjustment: 50 }
            ]
        },
        {
            name: "Pack",
            type: "select",
            isRequired: false,
            affectsPrice: true,
            isMultiplier: true,
            options: [
                { label: "Pack of 1", multiplier: 1 },
                { label: "Pack of 2", multiplier: 2 }
            ]
        }
    ]
} as any;

console.log("--- Testing PricingService ---");

try {
    // Test 1: Base Price (No selection, but required missing) -> Should throw or handle
    console.log("\nTest 1: Missing Required Attribute");
    try {
        PricingService.calculateFinalPrice(mockProduct as IProduct, []);
    } catch (e: any) {
        console.log("Success: Caught expected error:", e.message);
    }

    // Test 2: Select Small (+0)
    console.log("\nTest 2: Size=Small (+0)");
    const res2 = PricingService.calculateFinalPrice(mockProduct as IProduct, [{ name: "Size", label: "Small" }]);
    console.log(`Result: ${res2.finalPrice} (Expected: 100)`);

    // Test 3: Select Large (+50)
    console.log("\nTest 3: Size=Large (+50)");
    const res3 = PricingService.calculateFinalPrice(mockProduct as IProduct, [{ name: "Size", label: "Large" }]);
    console.log(`Result: ${res3.finalPrice} (Expected: 150)`);

    // Test 4: Select Large (+50) & Pack of 2 (x2)
    console.log("\nTest 4: Size=Large (+50) & Pack=Pack of 2 (x2)");
    const res4 = PricingService.calculateFinalPrice(mockProduct as IProduct, [
        { name: "Size", label: "Large" },
        { name: "Pack", label: "Pack of 2" }
    ]);
    console.log(`Result: ${res4.finalPrice} (Expected: 300)`);
    // (100 + 50) * 2 = 300

    // Test 5: Invalid Option
    console.log("\nTest 5: Invalid Option");
    try {
        PricingService.calculateFinalPrice(mockProduct as IProduct, [{ name: "Size", label: "Huge" }]);
    } catch (e: any) {
        console.log("Success: Caught expected error:", e.message);
    }

} catch (e) {
    console.error("Unexpected Error:", e);
}
