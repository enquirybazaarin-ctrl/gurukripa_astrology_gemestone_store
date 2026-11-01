
import { FiCheck } from "react-icons/fi";

export const FactoryAdvantageThali = () => {
    return (
        <div className="bg-gray-900 px-4 py-6 mb-2 text-white">
            <h3 className="text-md font-bold mb-4 text-center">Why Our Bowls & Thali?</h3>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold">Direct Factory Manufacturing</h4>
                        <p className="text-xs text-gray-400">Skip the middleman, get the best rates.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold">Heavy Quality Steel</h4>
                        <p className="text-xs text-gray-400">Durable, rust-free, and long-lasting.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold">Bulk Orders Supported</h4>
                        <p className="text-xs text-gray-400">Custom pricing for hotels, caterers, and events.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold">Better Pricing Than Market</h4>
                        <p className="text-xs text-gray-400">Unbeatable value for premium quality.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
