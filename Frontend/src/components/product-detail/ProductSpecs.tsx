
interface ProductSpecsProps {
    specs: { label: string; value: string }[];
}

export const ProductSpecs = ({ specs }: ProductSpecsProps) => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4 font-sans">Specifications</h3>
            <div className="grid grid-cols-1 gap-y-3">
                {specs.map((spec, index) => (
                    <div key={index} className="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="text-sm text-gray-500 w-1/3 flex-shrink-0">{spec.label}</span>
                        <span className="text-sm text-gray-900 font-medium">{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
