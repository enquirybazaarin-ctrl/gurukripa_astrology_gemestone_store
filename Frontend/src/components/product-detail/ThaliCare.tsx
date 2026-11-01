
import { FiDroplet, FiLayout, FiMaximize } from "react-icons/fi";

export const ThaliCare = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Cleaning & Care</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                        <FiDroplet />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Wash before first use</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm">
                        <FiLayout />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Dishwasher Safe</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
                        <FiMaximize />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Use soft scrub for shine</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
                        <FiDroplet />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Dry after wash</span>
                </div>
            </div>
        </div>
    );
};
