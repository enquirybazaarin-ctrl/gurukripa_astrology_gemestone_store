
import { FiCheckCircle } from "react-icons/fi";

export const WhatsIncluded = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">What's Included in the Set</h3>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <FiCheckCircle className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">1 × Large Thali (12 inch)</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <FiCheckCircle className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">3 × Small Bowls (Katori)</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <FiCheckCircle className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">Smooth edges for safe use</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};
