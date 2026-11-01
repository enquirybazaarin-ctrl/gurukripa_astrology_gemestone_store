interface ProductDescriptionProps {
    shortDescription: string;
    fullDescription: string;
    showFull: boolean;
    onToggle: () => void;
}

export const ProductDescription = ({
    shortDescription,
    fullDescription,
    showFull,
    onToggle
}: ProductDescriptionProps) => {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Product Details</h3>

            <div className="text-sm text-gray-700 leading-relaxed">
                {showFull ? (
                    <div className="whitespace-pre-line">{fullDescription}</div>
                ) : (
                    <div className="line-clamp-3">{shortDescription}...</div>
                )}
            </div>

            <button
                onClick={onToggle}
                className="text-primary-600 font-medium text-sm hover:underline"
            >
                {showFull ? 'Show Less' : 'View Details'}
            </button>
        </div>
    );
};
