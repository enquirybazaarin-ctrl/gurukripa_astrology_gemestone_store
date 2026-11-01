import { useState, useEffect } from 'react';
import { ProductService as productService } from '../services/product.service';
import { bannerService } from '../services/banner.service';
import { Product } from '../types';

import { BannerSlider } from '../components/BannerSlider';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { categoryService, Category } from '../services/category.service';
import { BestSellingSection } from '../components/BestSellingSection';
import { AstrologyServicesSection } from '../components/AstrologyServicesSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { BulkCTASection } from '../components/BulkCTASection';
import { Stories } from '../components/home/Stories';
import { ProductListSkeleton } from '../components/skeletons/ProductListSkeleton';
import { SEO } from '../components/SEO';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, bannersData, categoriesData] = await Promise.all([
          productService.getAllProducts({ showOnHome: true, limit: 100 } as any), // Fetch only home products
          bannerService.getActiveBanners('home'),
          categoryService.getCategories()
        ]);

        // Process Products
        const mappedProducts: Product[] = productsData.map((p: any) => ({
          ...p,
          id: p._id,
          title: p.name,
          rating: p.rating || 4.5,
          totalReviews: p.reviews?.length || 0,
          originalPrice: p.price * 1.2,
          // Robust Category Mapping
          categoryId: p.category?._id || (typeof p.category === 'string' ? p.category : undefined),
          categorySlug: p.category?.slug,
          categoryName: p.category?.name,
        }));
        setProducts(mappedProducts);

        // Process Banners
        console.log('Banners Data Response:', bannersData);
        if (bannersData?.data?.banners) {
          console.log('Setting Banners:', bannersData.data.banners);
          setBanners(bannersData.data.banners);
        } else {
          console.warn('No banners found in response');
        }

        // Process Categories
        if (categoriesData?.data?.categories) {
          setCategories(categoriesData.data.categories);
        }

      } catch (error) {
        console.error('Failed to fetch home data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products for category sections
  const getProductsForSection = (categorySlug: string) => {
    if (categorySlug === 'best-selling') {
      return products.filter(p => p.isBestSeller).slice(0, 6);
    }

    // Find target category for ID matching
    const targetCategory = categories.find(c => c.slug === categorySlug);

    if (categorySlug.includes('votive')) {
      console.log(`[DEBUG] Checking Votives. Slug: ${categorySlug}`, targetCategory);
      console.log(`[DEBUG] Total Products: ${products.length}`);
      const possibleMatches = products.filter(p =>
        (p.categoryName && p.categoryName.toLowerCase().includes('votive')) ||
        (p.categorySlug && p.categorySlug.includes('votive'))
      );
      console.log(`[DEBUG] Potential Votive candidates:`, possibleMatches);
    }

    // Filter by Category Slug
    const categoryProducts = products.filter(p => {
      // Match by ID (Robust String Comparison)
      if (p.categoryId && targetCategory && String(targetCategory._id) === String(p.categoryId)) return true;

      // Match by Slug
      if (p.categorySlug && p.categorySlug === categorySlug) return true;

      // Match by Name (Case Insensitive)
      if (p.categoryName && targetCategory && p.categoryName.toLowerCase() === targetCategory.name.toLowerCase()) return true;

      // Fallback: Match by mapped category string
      if (p.category === categorySlug) return true;

      return false;
    });

    if (categorySlug.includes('votive')) {
      console.log(`[DEBUG] Final Matched Votives: ${categoryProducts.length}`);
    }

    return categoryProducts.slice(0, 6);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 md:pb-10">
        {/* Banner Skeleton */}
        <div className="w-full mt-2 aspect-[16/4] bg-gray-200 animate-pulse"></div>

        <div className="container mx-auto px-4 mt-8">
          {/* Best Selling Skeleton */}
          <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6"></div>
          <ProductListSkeleton count={4} />

          {/* Category Skeleton */}
          <div className="mt-12">
            <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6"></div>
            <ProductListSkeleton count={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-10">
      <SEO title="Guru Kripa Astrology & GemsTone - Certified Natural Gemstones" />
      <h1 className="sr-only">Guru Kripa Astrology & GemsTone - 100% Certified Natural Gemstones, Vedic Astrology Consultations, Pukhraj, Neelam, Emerald & Consecrated Gems</h1>
      {/* Category Section Showcase (Controlled by Admin Panel) */}
      <CategoryShowcase categories={categories} />

      {/* Banner Slider - Full Width */}
      <div className="w-full mt-2">
        <BannerSlider banners={banners} />
      </div>

      <div className="container mx-auto px-4 mt-4">
        {/* Best Selling Section */}
        <BestSellingSection products={getProductsForSection('best-selling')} categories={categories} />

        {/* Our Astrology Services & Astrologer Consultation Section */}
        <AstrologyServicesSection />
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Bulk CTA Section (Commented out for now) */}
      {/* <BulkCTASection /> */}

      <Stories />
    </main>
  );
};
