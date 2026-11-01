
interface ThaliSpecsProps {
    specs: {
        material: string;
        thickness: string;
        finish: string;
        shape: string;
        dishwasherSafe: string;
    };
}

export const ThaliSpecs = ({ specs }: ThaliSpecsProps) => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Product Specifications</h3>

            <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Material</span>
                    <span className="text-sm font-medium text-gray-900">{specs.material}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Thickness</span>
                    <span className="text-sm font-medium text-gray-900">{specs.thickness}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Finish</span>
                    <span className="text-sm font-medium text-gray-900">{specs.finish}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Shape</span>
                    <span className="text-sm font-medium text-gray-900">{specs.shape}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Dishwasher Safe</span>
                    <span className="text-sm font-medium text-green-700">{specs.dishwasherSafe}</span>
                </div>
            </div>
        </div>
    );
};
