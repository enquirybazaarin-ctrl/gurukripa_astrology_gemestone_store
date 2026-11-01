import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductListSkeletonProps {
    count?: number;
}

export const ProductListSkeleton = ({ count = 8 }: ProductListSkeletonProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
};
