
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

export const SafetyCare = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <FiAlertTriangle className="text-orange-500" />
                    <h3 className="text-md font-bold text-gray-900">Safety First</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 ml-1">
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                        Use on heat-resistant, flat surfaces only.
                    </li>
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                        Keep away from children and pets.
                    </li>
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                        Never leave a burning candle unattended.
                    </li>
                </ul>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FiCheckCircle className="text-green-600" />
                    <h3 className="text-md font-bold text-gray-900">Care Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 ml-1">
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                        Trim wick to 1/4 inch before every lighting.
                    </li>
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                        Avoid drafty areas for an even burn.
                    </li>
                    <li className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                        Store in a cool, dry place away from sunlight.
                    </li>
                </ul>
            </div>
        </div>
    );
};
