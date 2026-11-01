import { Link } from 'react-router-dom';
import { Category } from '../services/category.service';

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection = ({ categories }: CategorySectionProps) => {
  const visibleCategories = categories.slice(0, 10);

  const CategoryItem = ({ category }: { category: Category }) => {
    const imageSrc = category.image || category.icon || category.banner;

    return (
      <Link
        key={category._id}
        to={`/category/${category.slug}`}
        className="group flex flex-col items-center w-24 md:w-28 flex-shrink-0 rounded-xl p-2 transition-transform duration-200 hover:-translate-y-1"
      >
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-amber-50 to-amber-100/50 p-1 border-2 border-amber-200/80 shadow-md group-hover:border-amber-400 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={category.name}
              className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl select-none" aria-hidden="true">
              💎
            </span>
          )}
        </div>

        <span className="mt-2.5 text-xs md:text-sm font-semibold text-center text-gray-800 group-hover:text-amber-700 leading-snug line-clamp-2 transition-colors">
          {category.name}
        </span>
      </Link>
    );
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-6 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
            Shop by Vedic Gemstone
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            100% Certified Natural Gemstones for Planetary Alignment
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory">
            {visibleCategories.map((category) => (
              <div key={category._id} className="snap-start">
                <CategoryItem category={category} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet: centered flex layout */}
        <div className="hidden md:flex flex-wrap justify-center gap-6">
          {visibleCategories.map((category) => (
            <CategoryItem key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
