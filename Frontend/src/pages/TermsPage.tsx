
import React from 'react';

export const TermsPage = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Terms and Conditions</h1>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using the Votive Candles website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of the Site</h2>
                        <p>
                            You agree to use this site only for lawful purposes. You must not use this site to transmit any material that is harassing, defamatory, abusive, threatening, or otherwise objectionable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Product Information and Pricing</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>We strive to ensure all product descriptions and pricing are accurate. However, errors may occur.</li>
                            <li>We reserve the right to correct any errors and to change or update information at any time without prior notice.</li>
                            <li>Prices are subject to change without notice.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Order Acceptance and Cancellation</h2>
                        <p>
                            We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies in product or pricing information, or issues identified by our fraud avoidance department.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
                        <p>
                            All content on this site, including text, graphics, logos, images, and software, is the property of Votive Candles and is protected by Indian and international copyright laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
                        <p>
                            Votive Candles shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in [Your City, India].
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to Terms</h2>
                        <p>
                            We modify these Terms & Conditions from time to time. We will verify the effectiveness of these changes by posting the new terms on this site.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
