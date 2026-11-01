
import { FiMinimize2, FiSmile, FiShield } from "react-icons/fi";

export const GlassQuality = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Built for Daily Use</h3>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Crack Resistant</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Thick borosilicate glass designed to withstand minor impacts.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <FiMinimize2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Smooth Edges</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Precision cut and polished edges for safe handling.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                        <FiSmile className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Quality Checked</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Every piece inspect manually before packing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
