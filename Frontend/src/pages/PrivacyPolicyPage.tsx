
import React from 'react';

export const PrivacyPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Privacy Policy</h1>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                        <p>
                            Welcome to Votive Candles ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner.
                            This Privacy Policy outlines how we collect, use, and protect your data when you visit our website or make a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                        <p>We collect information to provide better services to our users. This includes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and billing address when you register or place an order.</li>
                            <li><strong>Payment Information:</strong> We do not store your credit/debit card details. All payment transactions are processed through secure third-party payment gateways (e.g., Razorpay).</li>
                            <li><strong>Usage Data:</strong> Information on how you access and use our website, including device type, browser, and IP address.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                        <p>We use your data for the following purposes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>To process and fulfill your orders.</li>
                            <li>To communicate with you regarding order updates, offers, and promotions.</li>
                            <li>To improve our website functionality and user experience.</li>
                            <li>To prevent fraud and ensure the security of our platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing and Third Parties</h2>
                        <p>
                            We do not sell or rent your personal information to third parties. We may share detailed data with trusted partners solely for the purpose of operating our business, such as:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Logistics Partners:</strong> To deliver your products.</li>
                            <li><strong>Payment Processors:</strong> To facilitate secure transactions.</li>
                            <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
                        <p>
                            We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, but this may affect site functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information stored with us. If you wish to exercise these rights, please contact our support team.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <br />
                            <strong>Email:</strong> support@votivecandles.com <br />
                            <strong>Phone:</strong> +91-9876543210
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
