import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../services/category.service';

interface CategoryShowcaseProps {
  categories?: Category[];
}

// 9 Gems for the Gemstone multi-grid preview
const navratnaGrid = [
  { name: 'Yellow Sapphire', color: 'bg-amber-400', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=150' },
  { name: 'Blue Sapphire', color: 'bg-blue-600', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=150' },
  { name: 'Emerald', color: 'bg-emerald-500', img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=150' },
  { name: 'Ruby', color: 'bg-rose-600', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=150' },
  { name: 'Hessonite', color: 'bg-amber-700', img: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=150' },
  { name: 'Pearl', color: 'bg-slate-200', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=150' },
  { name: 'Red Coral', color: 'bg-red-600', img: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=150' },
  { name: 'Opal', color: 'bg-pink-100', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=150' },
  { name: "Cat's Eye", color: 'bg-yellow-600', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=150' }
];

// Fallback items in case database has not loaded or has no categories
const fallbackCategories: Category[] = [
  {
    _id: 'cat-gemstone',
    name: 'Gemstone',
    slug: 'gemstones',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: 'cat-rudraksha',
    name: 'Rudraksha',
    slug: 'rudraksha',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591475878-a006db315802?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: 'cat-mala',
    name: 'Mala',
    slug: 'mala',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: 'cat-consultation',
    name: 'Free Gems Recommendation',
    slug: 'free-gems-recommendation',
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: 'cat-crystals',
    name: 'Crystal Products',
    slug: 'crystal-products',
    image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=600'
  }
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories }) => {
  // Use admin panel dynamic categories if provided, otherwise fallback
  const itemsToRender = (categories && categories.length > 0)
    ? categories
    : fallbackCategories;

  return (
    <section className="bg-white py-4 md:py-6 border-b border-gray-200/80 shadow-2xs">
      <div className="container mx-auto px-4">
        {/* Horizontal Scroll on Mobile / Dynamic Flex on Desktop */}
        <div className="flex items-start gap-3.5 md:gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {itemsToRender.map((category) => {
            const isGemstoneGrid = category.slug === 'gemstones' || category.slug === 'gemstone' || category.name.toLowerCase() === 'gemstone' || category.name.toLowerCase() === 'gemstones';
            const targetLink = category.slug === 'free-gems-recommendation' ? '/free-janampatri' : `/category/${category.slug}`;
            const displayImage = category.image || category.banner || category.icon || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600';

            return (
              <Link
                key={category._id || category.slug}
                to={targetLink}
                className="flex flex-col items-center flex-shrink-0 w-32 sm:w-36 md:w-44 lg:w-[calc(14.28%-14px)] group text-center"
              >
                {/* Card Image Container */}
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-xs group-hover:shadow-md group-hover:border-[#eb651e] transition-all duration-300 relative">
                  {isGemstoneGrid ? (
                    /* 3x3 Mini Gemstone Grid matching reference image */
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1 bg-white gap-0.5">
                      {navratnaGrid.map((gem, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-xs border border-gray-100 bg-gray-50 flex items-center justify-center">
                          <img
                            src={gem.img}
                            alt={gem.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <img
                      src={displayImage}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                </div>

                {/* Title (Controlled by Admin Panel name) */}
                <h3 className="mt-2 text-xs sm:text-[13px] md:text-sm font-semibold text-gray-800 group-hover:text-[#eb651e] transition-colors leading-tight px-1">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
