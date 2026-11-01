
interface GlassSpecsProps {
    specs: {
        material: string;
        thickness: string;
        heatResistance: string;
        finish: string;
        weight: string;
    };
}

export const GlassSpecs = ({ specs }: GlassSpecsProps) => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Glass Specifications</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Thickness Card - Highlighted */}
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex flex-col items-center text-center col-span-1">
                    <span className="text-xs text-blue-600 uppercase font-semibold tracking-wide">Thickness</span>
                    <span className="text-xl font-bold text-blue-900 mt-1">{specs.thickness}</span>
                </div>

                {/* Weight Card */}
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg flex flex-col items-center text-center col-span-1">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Weight</span>
                    <span className="text-lg font-bold text-gray-900 mt-1">{specs.weight}</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Material</span>
                    <span className="text-sm font-medium text-gray-900">{specs.material}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Heat Resistance</span>
                    <span className="text-sm font-medium text-gray-900">{specs.heatResistance}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Finish</span>
                    <span className="text-sm font-medium text-gray-900">{specs.finish}</span>
                </div>
            </div>
        </div>
    );
};
