
import React from 'react';

export const ShippingPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Shipping Policy</h1>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Shipping Coverage</h2>
                        <p>
                            We ship across almost all pin codes in India. We use reliable courier partners like BlueDart, Delhivery, and DTDC to ensure your orders reach you safely and on time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Processing Time</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Orders are processed within <strong>24 hours</strong> of confirmation.</li>
                            <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Delivery Timelines</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Metro Cities:</strong> 3-5 Business Days.</li>
                            <li><strong>Rest of India:</strong> 5-7 Business Days.</li>
                            <li>Please note that delivery times may be affected by factors beyond our control, such as weather conditions or courier delays.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Shipping Charges</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>We offer <strong>Free Shipping</strong> on all prepaid orders above ₹999.</li>
                            <li>A nominal shipping fee may apply for orders below ₹999 or Cash on Delivery (COD) orders, which will be calculated at checkout.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Order Tracking</h2>
                        <p>
                            Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track your order status from the "My Orders" section on our website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
