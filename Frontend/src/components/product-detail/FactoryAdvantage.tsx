
import { FiTrendingUp, FiUsers, FiBox } from "react-icons/fi";

export const FactoryAdvantage = () => {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-6 mb-2 text-white">
            <h3 className="text-md font-bold mb-4 text-center">Why Our Glass Products?</h3>

            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <FiBox className="text-yellow-400 w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">In-house manufacturing & quality control</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <FiTrendingUp className="text-green-400 w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Unbeatable factory-direct pricing</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <FiUsers className="text-blue-400 w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Trusted by hotels & bulk buyers</span>
                </div>
            </div>
        </div>
    );
};
