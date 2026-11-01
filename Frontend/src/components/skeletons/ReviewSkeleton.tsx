import { Skeleton } from '../ui/Skeleton';

export const ReviewSkeleton = () => {
    return (
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-3 h-3 rounded-full" />
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-3 w-24" />
        </div>
    );
};
