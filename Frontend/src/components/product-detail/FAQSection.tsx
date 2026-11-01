import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>

            <div className="space-y-2">
                {faqs.map((faq, index) => {
                    const isExpanded = expandedIndex === index;

                    return (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                                <FiChevronDown
                                    className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''
                                        }`}
                                    size={20}
                                />
                            </button>

                            {isExpanded && (
                                <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                                    <div className="pt-3">{faq.answer}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
