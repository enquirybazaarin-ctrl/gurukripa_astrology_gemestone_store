
import React from 'react';

export const RefundPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Refund and Cancellation Policy</h1>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Order Cancellation</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Before Shipment:</strong> You can cancel your order anytime before it has been dispatched from our warehouse. In such cases, a full refund will be processed to your original payment method within 5-7 business days.</li>
                            <li><strong>After Shipment:</strong> Once an order has been shipped, it cannot be canceled. You may choose to return the product in accordance with our return policy below.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Returns and Replacements</h2>
                        <p>
                            We take pride in our "Damage? We Replace" policy. Given the fragile nature of glassware, rare breakages can happen during transit.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Damaged/Defective Items:</strong> If you receive a damaged or defective product, you must notify us within <strong>48 hours</strong> of delivery. Please email us at support@votivecandles.com with photos/videos of the damaged item and the original packaging.</li>
                            <li><strong>Verification:</strong> Our team will verify the damage. Upon verification, we will ship a replacement for the damaged piece(s) free of cost.</li>
                            <li><strong>Change of Mind:</strong> We do not accept returns due to a change of mind or incorrectly ordered items, as our products are factory-direct and checked before dispatch.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Refunds</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Refunds are only processed if we are unable to provide a replacement for a damaged item.</li>
                            <li>Approved refunds will be credited back to the original source of payment within 5-7 business days.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Contact Support</h2>
                        <p>
                            For any cancellation or refund requests, please reach out to our support team: <br />
                            <strong>Email:</strong> support@votivecandles.com <br />
                            <strong>WhatsApp:</strong> +91-9876543210
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
