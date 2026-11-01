import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductService, ProductParams } from '../services/product.service';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';
import { getFiltersForCategory, priceRangeConfig } from '../data/categoryFilters';
import { MobileFilterSheet } from '../components/MobileFilterSheet';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ProductListSkeleton } from '../components/skeletons/ProductListSkeleton';
import { SEO } from '../components/SEO';

export const ProductListPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  // State for Filters
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([priceRangeConfig.min, priceRangeConfig.max]);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Derive filters for API
  // Note: specific filter mapping (e.g. 'pack' -> subCategories) depends on backend.
  // For now, passing them generally.

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', categoryId, page, selectedFilters, priceRange, sortBy],
    queryFn: () => {
      const filters: ProductParams = {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: sortBy,
        // rating: selectedFilters.rating ? Number(selectedFilters.rating[0]) : undefined,
      };

      if (categoryId) {
        filters.category = categoryId;
      }

      const search = searchParams.get('q');
      if (search) {
        filters.search = search;
      }

      return ProductService.getAllProducts({ page, limit: 20, ...filters });
    }
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setPriceRange([priceRangeConfig.min, priceRangeConfig.max]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden md:block w-64 flex-shrink-0 space-y-4">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <ProductListSkeleton count={12} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Failed to load products. Please try again.</div>;
  }

  const { products, pagination } = data?.data || { products: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={categoryId ? `${categoryId} Products` : 'All Products'} 
        description={`Browse our premium selection of ${categoryId || 'home decor and candle products'} at Raja Home Decor.`} 
      />
      <div className="flex flex-col md:flex-row gap-8">

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterPanel
            filters={getFiltersForCategory(categoryId || '')}
            selectedFilters={selectedFilters}
            priceRange={priceRange}
            onFilterChange={(id, value) => {
              setSelectedFilters(prev => {
                const current = prev[id] || [];
                const updated = current.includes(value)
                  ? current.filter(item => item !== value)
                  : [...current, value];
                return { ...prev, [id]: updated };
              });
            }}
            onPriceChange={setPriceRange}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Mobile Filters Trigger */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium"
          >
            <FiFilter /> Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* Product Grid & Header */}
        <div className="flex-1">
          {/* Desktop Header with Sort */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold capitalize">{categoryId || 'All Products'} <span className="text-gray-500 text-sm font-normal">({pagination.total} items)</span></h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none text-sm font-medium focus:ring-0 cursor-pointer bg-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              <button onClick={clearAllFilters} className="mt-4 text-primary-600 hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product: Product) => (
                <ProductCard key={product._id} product={product as any} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`p-2 rounded-lg border ${page === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`}
              >
                <FiChevronLeft />
              </button>

              {/* Simple page numbers: 1 ... current ... last could be implemented. For now simple numbers */}
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${page === p
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages}
                className={`p-2 rounded-lg border ${page === pagination.pages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={getFiltersForCategory(categoryId || '')}
        selectedFilters={selectedFilters}
        priceRange={priceRange}
        onFilterChange={(id, value) => {
          setSelectedFilters(prev => {
            const current = prev[id] || [];
            const updated = current.includes(value)
              ? current.filter(item => item !== value)
              : [...current, value];
            return { ...prev, [id]: updated };
          });
        }}
        onPriceChange={setPriceRange}
        onClearAll={clearAllFilters}
        onApply={() => setIsMobileFiltersOpen(false)}
      />
    </div>
  );
};
