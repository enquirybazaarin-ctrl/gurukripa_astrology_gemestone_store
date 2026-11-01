import { Skeleton } from '../ui/Skeleton';

export const ProductCardSkeleton = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 h-full">
            {/* Image Placeholder */}
            <div className="relative w-full aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Content Placeholder */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />

                <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
};
