import { Skeleton } from '../ui/Skeleton';

export const OrderSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Header Skeleton */}
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-6 text-sm">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
                <Skeleton className="h-4 w-24" />
            </div>

            {/* Body Skeleton */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="md:w-64 flex-shrink-0 border-r pr-6 border-gray-100 space-y-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="w-16 h-16 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
