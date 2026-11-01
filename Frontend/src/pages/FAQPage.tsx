import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What are your shipping charges?",
        answer: "We offer free shipping on orders above ₹500. For orders below ₹500, a flat shipping charge of ₹50 applies across India."
    },
    {
        question: "How long does delivery take?",
        answer: "Standard delivery takes 5-7 business days. For metro cities, delivery is usually completed within 3-5 business days. You'll receive a tracking number once your order is shipped."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery. Products must be unused and in original packaging. Refunds are processed within 5-7 business days after we receive the returned item."
    },
    {
        question: "Do you offer Cash on Delivery (COD)?",
        answer: "Yes, we offer Cash on Delivery for orders up to ₹5,000. COD is available across India with a small handling fee of ₹40."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the 'My Orders' section."
    },
    {
        question: "Are the products authentic?",
        answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors. We guarantee quality and authenticity."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. All online payments are processed through secure payment gateways."
    },
    {
        question: "Can I cancel my order?",
        answer: "Yes, you can cancel your order before it's shipped. Once shipped, cancellation is not possible, but you can return the product after delivery as per our return policy."
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Yes! We offer special discounts on bulk orders. Please use our Bulk Inquiry form or contact us directly for custom quotes on large orders."
    },
    {
        question: "How do I contact customer support?",
        answer: "You can reach us via email, phone, or WhatsApp. Our customer support team is available Monday to Saturday, 10 AM to 6 PM IST."
    }
];

const FAQAccordion = ({ faq }: { faq: FAQItem }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <span className="text-lg font-medium text-gray-900 pr-4">{faq.question}</span>
                {isOpen ? (
                    <FiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
            )}
        </div>
    );
};

export const FAQPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600">
                        Find answers to common questions about our products, shipping, and policies
                    </p>
                </div>

                {/* FAQ List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {faqs.map((faq, index) => (
                        <FAQAccordion key={index} faq={faq} />
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-amber-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Still have questions?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Can't find the answer you're looking for? Please contact our customer support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@example.com"
                            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                        >
                            Email Us
                        </a>
                        <a
                            href="tel:+919876543210"
                            className="px-6 py-3 bg-white text-amber-600 border-2 border-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium"
                        >
                            Call Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
