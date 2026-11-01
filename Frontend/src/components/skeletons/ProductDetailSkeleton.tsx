import { Skeleton } from '../ui/Skeleton';

export const ProductDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-white pb-12">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">

                    {/* Left Column: Gallery Skeleton */}
                    <div className="lg:col-span-5 w-full">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="w-20 h-20 rounded-md" />
                            <Skeleton className="w-20 h-20 rounded-md" />
                            <Skeleton className="w-20 h-20 rounded-md" />
                        </div>
                    </div>

                    {/* Right Column: Info Skeleton */}
                    <div className="lg:col-span-7 mt-8 lg:mt-0 space-y-8">
                        <div>
                            <Skeleton className="h-10 w-3/4 mb-4" />
                            <div className="flex items-center gap-4 mb-6">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <Skeleton className="h-12 w-48 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="h-8 w-32" />
                            <div className="flex gap-3">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Skeleton className="w-12 h-12 rounded-full" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Skeleton className="h-14 flex-1 rounded-sm" />
                            <Skeleton className="h-14 flex-1 rounded-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
