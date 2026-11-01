
import { FiDroplet, FiThermometer, FiLayout } from "react-icons/fi";

export const GlassCare = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Cleaning & Care</h3>
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <FiDroplet className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-[10px] font-medium text-gray-700">Hand Wash Recommended</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <FiLayout className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-[10px] font-medium text-gray-700">Use Soft Cloth</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <FiThermometer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-[10px] font-medium text-gray-700">Avoid Thermal Shock</p>
                </div>
            </div>
        </div>
    );
};
