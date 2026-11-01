
import { FiPackage, FiTruck, FiShield } from "react-icons/fi";

export const PackagingDelivery = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Packaging & Delivery</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <FiPackage className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Secure Packaging</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Three-layer break-safe packing to ensure your candle arrives in perfect condition.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <FiTruck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Fast Delivery</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Dispatched within 24-48 hours. Pan-India delivery available.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                        <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Purchase Protection</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Safe and secure payments. Easy returns for damaged items.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
