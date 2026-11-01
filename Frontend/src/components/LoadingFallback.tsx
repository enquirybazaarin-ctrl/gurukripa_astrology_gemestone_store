import { Skeleton } from './ui/Skeleton';
import { ProductCardSkeleton } from './skeletons/ProductCardSkeleton';

export const LoadingFallback = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full transition-opacity duration-200">
      {/* Top Announcement Bar Skeleton */}
      <div className="w-full h-8 bg-gray-100/80 border-b border-gray-200/50 flex items-center justify-center">
        <Skeleton className="h-3 w-64 md:w-80" />
      </div>

      {/* Main Header Skeleton */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo placeholder */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 md:h-10 w-32 md:w-44 rounded-lg" />
          </div>

          {/* Search Bar Placeholder */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>

          {/* Right Action Icons Placeholder */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full hidden sm:block" />
          </div>
        </div>

        {/* Mobile Search Bar Skeleton */}
        <div className="md:hidden px-4 pb-3">
          <Skeleton className="h-9 w-full rounded-full" />
        </div>

        {/* Categories Bar Skeleton */}
        <div className="border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-2 flex items-center gap-3 overflow-x-hidden">
            {[80, 96, 72, 110, 88, 92, 100].map((width, idx) => (
              <Skeleton
                key={idx}
                className="h-7 rounded-full flex-shrink-0"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Body Skeleton */}
      <main className="flex-1 container mx-auto px-4 py-4 space-y-8">
        {/* Hero Banner Skeleton */}
        <div className="w-full aspect-[16/7] md:aspect-[16/4] rounded-xl overflow-hidden shadow-xs">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>

        {/* Section 1: Best Sellers Skeleton */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-40 md:w-56 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        </section>

        {/* Section 2: Category Product Section Skeleton */}
        <section className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-48 md:w-64 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

