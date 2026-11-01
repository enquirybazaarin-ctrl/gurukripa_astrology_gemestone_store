import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Category } from './src/modules/categories/category.model';
import { Product } from './src/modules/products/product.model';

dotenv.config({ path: path.join(__dirname, '.env') });

const gemstoneCategories = [
  {
    name: 'Yellow Sapphire (Pukhraj)',
    slug: 'yellow-sapphire-pukhraj',
    description: 'Natural, unheated Yellow Sapphires for Jupiter (Brihaspati). Enhances wisdom, wealth, and spiritual growth.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    icon: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Blue Sapphire (Neelam)',
    slug: 'blue-sapphire-neelam',
    description: 'Certified Natural Blue Sapphires for Saturn (Shani). Known for instant astrological impact and career advancement.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    icon: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Ruby (Manikya)',
    slug: 'ruby-manikya',
    description: 'Pure Pigeon Blood Natural Rubies for Sun (Surya). Boosts leadership, vitality, and royal favor.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    icon: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Emerald (Panna)',
    slug: 'emerald-panna',
    description: 'Vivid Green Zambian and Colombian Emeralds for Mercury (Budh). Promotes intellect, memory, and trade success.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    icon: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Red Coral (Moonga)',
    slug: 'red-coral-moonga',
    description: 'Triangular & Capsule Natural Italian Red Corals for Mars (Mangal). Best for courage and physical strength.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400',
    icon: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Pearl (Moti)',
    slug: 'natural-pearl-moti',
    description: 'Natural Basra and South Sea Pearls for Moon (Chandra). Calms the mind and stabilizes emotional balance.',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    icon: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'
  }
];

const gemstoneProducts = [
  {
    name: 'Ceylon Yellow Sapphire (Pukhraj) - 5.25 Ratti (4.78 Carat)',
    description: 'Exquisite 100% Natural, Unheated and Untreated Yellow Sapphire sourced from Ratnapura, Sri Lanka (Ceylon). Certified by Govt. Recognized Gemological Laboratory with high clarity, lemon-golden hue, and brilliant luster. Highly recommended for strengthening Jupiter (Brihaspati).',
    shortDescription: '100% Natural Sri Lankan Pukhraj | Unheated & Untreated | Free Lab Certificate & Puja Energization',
    price: 36750,
    originalPrice: 45000,
    stock: 12,
    sku: 'GK-PUK-525',
    categorySlug: 'yellow-sapphire-pukhraj',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    totalReviews: 48,
    status: 'active',
    isBestSeller: true,
    showOnHome: true,
    gemstoneType: 'Yellow Sapphire',
    variety: 'Pukhraj',
    origin: 'Sri Lanka (Ceylon)',
    caratWeight: 4.78,
    shape: 'Oval Brilliant Cut',
    cut: 'Faceted Oval',
    color: 'Vivid Canary Yellow',
    clarity: 'Eye Clean (VVS)',
    treatment: '100% Natural Unheated & Untreated',
    certification: 'Certified',
    certificateLaboratory: 'Govt. Approved Gem Testing Lab (GTL/IGI)',
    certificateNumber: 'GTL-2026-88912',
    astrologicalAssociation: 'Jupiter (Brihaspati Dev) - Planet of Fortune & Wisdom',
    tags: ['pukhraj', 'yellow sapphire', 'brihaspati', 'ceylon pukhraj', 'certified gemstone']
  },
  {
    name: 'Zambian Vivid Green Emerald (Panna) - 6.25 Ratti (5.68 Carat)',
    description: 'Natural Zambian Emerald exhibiting rich saturated green color with velvety luster. Astrologically potent for Mercury (Budh Dev). Natural Jardin inclusions confirming genuine natural origin without oiling or resin treatment.',
    shortDescription: 'Lustrous Zambian Panna | 100% Natural | Ideal for Business, Communication & Competitive Exams',
    price: 43750,
    originalPrice: 52000,
    stock: 8,
    sku: 'GK-PAN-625',
    categorySlug: 'emerald-panna',
    images: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    totalReviews: 32,
    status: 'active',
    isBestSeller: true,
    showOnHome: true,
    gemstoneType: 'Emerald',
    variety: 'Panna',
    origin: 'Zambia',
    caratWeight: 5.68,
    shape: 'Octagon / Emerald Cut',
    cut: 'Step Cut',
    color: 'Vivid Forest Green',
    clarity: 'Fine Jardin (Transparent)',
    treatment: 'Natural Untreated (No Polymer/Resin)',
    certification: 'Certified',
    certificateLaboratory: 'IGI / GIA Standard Certified',
    certificateNumber: 'IGI-2026-44219',
    astrologicalAssociation: 'Mercury (Budh Dev) - Intellect & Trade',
    tags: ['panna', 'emerald', 'budh', 'zambian emerald', 'certified gemstone']
  },
  {
    name: 'Ceylon Royal Blue Sapphire (Neelam) - 4.50 Ratti (4.10 Carat)',
    description: 'Top-tier Ceylon Blue Sapphire with striking royal cornflower blue tone. Perfect symmetry and fiery dispersion. Governed by Saturn (Shani Maharaj) for immense focus, discipline, and rapid breakthrough in ventures.',
    shortDescription: 'Deep Royal Blue Ceylon Neelam | Unheated & Untreated | Vedic Pooja Vidhi included',
    price: 58500,
    originalPrice: 72000,
    stock: 5,
    sku: 'GK-NEL-450',
    categorySlug: 'blue-sapphire-neelam',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    totalReviews: 29,
    status: 'active',
    isBestSeller: true,
    showOnHome: true,
    gemstoneType: 'Blue Sapphire',
    variety: 'Neelam',
    origin: 'Sri Lanka (Ceylon)',
    caratWeight: 4.10,
    shape: 'Cushion Cut',
    cut: 'Mixed Cushion',
    color: 'Royal Cornflower Blue',
    clarity: 'Eye Clean (VVS1)',
    treatment: '100% Natural Unheated',
    certification: 'Certified',
    certificateLaboratory: 'Govt. Gem Testing Lab',
    certificateNumber: 'GTL-2026-99120',
    astrologicalAssociation: 'Saturn (Shani Dev) - Justice, Stability & Fast Karma Relief',
    tags: ['neelam', 'blue sapphire', 'shani', 'ceylon neelam', 'astrological gemstone']
  },
  {
    name: 'Old Mine Burmese Ruby (Manikya) - 5.50 Ratti (5.00 Carat)',
    description: 'Authentic Natural Ruby showcasing royal Pigeon Blood Red hue with fiery silk luster. Representing Sun (Surya Dev), giving authoritativeness, soul power, high government status, and vitality.',
    shortDescription: 'Royal Pigeon Blood Red Manikya | Rare Natural Burma Ruby | 100% Unheated',
    price: 66000,
    originalPrice: 80000,
    stock: 7,
    sku: 'GK-RUB-550',
    categorySlug: 'ruby-manikya',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    totalReviews: 21,
    status: 'active',
    isBestSeller: true,
    showOnHome: true,
    gemstoneType: 'Ruby',
    variety: 'Manikya',
    origin: 'Burma (Myanmar)',
    caratWeight: 5.00,
    shape: 'Oval Faceted',
    cut: 'Brilliant Oval',
    color: 'Pigeon Blood Red',
    clarity: 'Translucent to Semi-Transparent with Natural Rutile Silk',
    treatment: '100% Natural Unheated',
    certification: 'Certified',
    certificateLaboratory: 'GIA / IGI Standard Gem Lab',
    certificateNumber: 'GIA-2026-11894',
    astrologicalAssociation: 'Sun (Surya Dev) - Supreme King of Planets',
    tags: ['ruby', 'manik', 'surya', 'burma ruby', 'certified natural gemstone']
  },
  {
    name: 'Italian Red Coral (Moonga Capsule) - 7.25 Ratti (6.60 Carat)',
    description: 'Premium Mediterranean Sea Italian Red Coral in pristine capsule cabochon form. Radiating deep vermilion red color with high organic gloss. Strengthens Mars (Mangal) for athletic energy, real estate prosperity, and removing Manglik Dosha.',
    shortDescription: 'Original Mediterranean Italian Moonga | Astrologically Powerful for Mangal',
    price: 18125,
    originalPrice: 22500,
    stock: 15,
    sku: 'GK-COR-725',
    categorySlug: 'red-coral-moonga',
    images: [
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    totalReviews: 44,
    status: 'active',
    isBestSeller: false,
    showOnHome: true,
    gemstoneType: 'Red Coral',
    variety: 'Moonga',
    origin: 'Italy (Mediterranean)',
    caratWeight: 6.60,
    shape: 'Capsule Cabochon',
    cut: 'Smooth Polished Dome',
    color: 'Deep Carnelian Oxblood Red',
    clarity: 'Opaque Organic Porcelain Luster',
    treatment: '100% Natural Undyed',
    certification: 'Certified',
    certificateLaboratory: 'Govt. Gem Testing Lab',
    certificateNumber: 'GTL-2026-67312',
    astrologicalAssociation: 'Mars (Mangal Dev) - Courage & Vitality',
    tags: ['moonga', 'red coral', 'mangal', 'italian moonga', 'natural gemstone']
  },
  {
    name: 'Natural South Sea Pearl (Moti) - 8.50 Ratti (7.73 Carat)',
    description: 'Lustrous Natural South Sea Pearl displaying pearlescent silvery-white orient with flawless spherical contour. Associated with Moon (Chandra) for soothing anxieties, mental clarity, and maternal peace.',
    shortDescription: 'Original South Sea Pearl | Flawless Round | Certified Natural Organics',
    price: 15300,
    originalPrice: 19000,
    stock: 20,
    sku: 'GK-PRL-850',
    categorySlug: 'natural-pearl-moti',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    totalReviews: 38,
    status: 'active',
    isBestSeller: false,
    showOnHome: true,
    gemstoneType: 'Pearl',
    variety: 'Moti',
    origin: 'South Sea',
    caratWeight: 7.73,
    shape: 'Round Spherical',
    cut: 'Natural Spherical',
    color: 'Lustrous Silvery White',
    clarity: 'High Mirror Luster (Clean Surface)',
    treatment: '100% Natural Untreated',
    certification: 'Certified',
    certificateLaboratory: 'Govt. Gem Testing Lab',
    certificateNumber: 'GTL-2026-33981',
    astrologicalAssociation: 'Moon (Chandra Dev) - Mental Peace & Intuition',
    tags: ['moti', 'pearl', 'chandra', 'south sea pearl', 'certified gemstone']
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB successfully.');

    // Remove old candle/home decor categories & products if any
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing categories and products.');

    const createdCats: Record<string, any> = {};
    for (const cat of gemstoneCategories) {
      const created = await Category.create(cat);
      createdCats[cat.slug] = created;
      console.log(`Created Category: ${cat.name}`);
    }

    for (const prod of gemstoneProducts) {
      const { categorySlug, ...rest } = prod;
      const cat = createdCats[categorySlug];
      if (cat) {
        await Product.create({
          ...rest,
          category: cat._id
        });
        console.log(`Created Product: ${prod.name}`);
      }
    }

    console.log('🎉 Successfully seeded authentic Astrology & Gemstone data!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
