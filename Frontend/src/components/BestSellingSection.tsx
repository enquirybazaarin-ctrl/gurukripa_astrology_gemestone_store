import { Link } from 'react-router-dom';
import { Category } from '../services/category.service';
import { Product } from '../types';

interface BestSellingSectionProps {
  products?: Product[];
  categories?: Category[];
}

interface VedicGemItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  image: string;
}

// Default 10 Vedic Gemstones matching reference UI
const DEFAULT_VEDIC_GEMS: VedicGemItem[] = [
  {
    id: 'yellow-sapphire',
    name: 'Yellow Sapphire (पुखराज)',
    slug: 'yellow-sapphire-pukhraj',
    subtitle: 'Brihaspati | Marriage | Career',
    image: '/gemstones/yellow-sapphire.png',
  },
  {
    id: 'blue-sapphire',
    name: 'Blue Sapphire (नीलम)',
    slug: 'blue-sapphire-neelam',
    subtitle: 'Saturn | Debt | Disease | Job',
    image: '/gemstones/blue-sapphire.png',
  },
  {
    id: 'emerald',
    name: 'Emerald (पन्ना)',
    slug: 'emerald-panna',
    subtitle: 'Budh | Business | Money',
    image: '/gemstones/emerald.png',
  },
  {
    id: 'ruby',
    name: 'Ruby (माणिक)',
    slug: 'ruby-manikya',
    subtitle: 'Surya | Status | Energy',
    image: '/gemstones/ruby.png',
  },
  {
    id: 'opal',
    name: 'Opal (उपल)',
    slug: 'opal',
    subtitle: 'Shukra | Attraction | Luxury',
    image: '/gemstones/opal.png',
  },
  {
    id: 'hessonite',
    name: 'Hessonite (गोमेद)',
    slug: 'hessonite-gomed',
    subtitle: 'Rahu | Politics | Stock | Market',
    image: '/gemstones/hessonite.png',
  },
  {
    id: 'natural-pearl',
    name: 'Natural Pearl (मोती)',
    slug: 'natural-pearl-moti',
    subtitle: 'Chandrama | Peace in Mind',
    image: '/gemstones/natural-pearl.png',
  },
  {
    id: 'diamond',
    name: 'Diamond (हीरा)',
    slug: 'diamond-heera',
    subtitle: 'Averts | Mishaps | Courage | Overall | Strength',
    image: '/gemstones/diamond.png',
  },
  {
    id: 'cats-eye',
    name: 'Cat\'s Eye (लहसुनिया)',
    slug: 'cats-eye-lehsunia',
    subtitle: 'Great Health | Will Power | Fame & Reputation',
    image: '/gemstones/cats-eye.png',
  },
  {
    id: 'coral',
    name: 'Coral (मूंगा)',
    slug: 'red-coral-moonga',
    subtitle: 'Mars | Health | Control | Anger',
    image: '/gemstones/coral.png',
  },
];

export const BestSellingSection = ({ categories = [] }: BestSellingSectionProps) => {
  // Merge dynamic admin categories with default gemstone definitions
  const gemstoneCards: VedicGemItem[] = DEFAULT_VEDIC_GEMS.map((defaultGem) => {
    // Check if admin has created or updated this category
    const adminCategory = categories.find((c) => {
      const slugMatch = c.slug?.toLowerCase() === defaultGem.slug.toLowerCase();
      const nameMatch = c.name?.toLowerCase().includes(defaultGem.slug.split('-')[0]);
      return slugMatch || nameMatch;
    });

    if (adminCategory) {
      return {
        id: String(adminCategory._id || defaultGem.id),
        name: adminCategory.name || defaultGem.name,
        slug: adminCategory.slug || defaultGem.slug,
        subtitle: adminCategory.description || defaultGem.subtitle,
        image: adminCategory.image || defaultGem.image,
      };
    }

    return defaultGem;
  });

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 my-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Best Selling Vedic Gemstones</span>
            <span className="text-xs bg-[#eb651e]/10 text-[#eb651e] font-semibold px-2 py-0.5 rounded-full">
              100% Certified
            </span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Natural Untreated Gemstones for Planetary Alignment & Astrological Remedies
          </p>
        </div>

        <Link
          to="/category/gemstones"
          className="text-[#eb651e] hover:text-[#d25515] text-xs md:text-sm font-semibold transition-colors flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View All Gemstones</span>
          <span className="text-base leading-none">→</span>
        </Link>
      </div>

      {/* 10 Gemstones Grid: 2 cols mobile, 3 cols tablet, 5 cols desktop (2 rows of 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {gemstoneCards.map((gem) => (
          <Link
            key={gem.id}
            to={`/category/${encodeURIComponent(gem.slug)}`}
            className="group bg-white rounded-xl border border-gray-200/80 hover:border-[#eb651e] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Gemstone Image Area */}
            <div className="h-32 sm:h-36 md:h-40 p-2.5 sm:p-3 flex items-center justify-center bg-[#fafafa] overflow-hidden">
              <img
                src={gem.image}
                alt={gem.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-sm"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = '/banners/Logo/logo2.png';
                }}
              />
            </div>

            {/* Title & Benefits Footer */}
            <div className="p-2.5 sm:p-3 text-center border-t border-gray-100 bg-white flex flex-col items-center justify-center min-h-[66px]">
              <div className="text-xs sm:text-[13px] font-bold text-gray-900 group-hover:text-[#eb651e] transition-colors flex items-center justify-center gap-1 leading-snug">
                <span>{gem.name}</span>
                <span className="text-[#eb651e] text-[11px] leading-none shrink-0">▸</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 line-clamp-2 leading-tight text-center font-normal">
                {gem.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
