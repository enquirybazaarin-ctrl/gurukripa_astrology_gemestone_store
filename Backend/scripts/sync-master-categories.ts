import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Category } from '../src/modules/categories/category.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const masterCategories = [
  {
    name: 'Gemstones',
    slug: 'gemstones',
    description: '100% Certified Natural Unheated Vedic Gemstones',
    order: 1,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Rudraksha',
    slug: 'rudraksha',
    description: 'Authentic 1 to 14 Mukhi Nepali & Indonesian Rudraksha Beads',
    order: 2,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Energized Astrological & Crystal Healing Bead Bracelets',
    order: 3,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1611591475878-a006db315802?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1611591475878-a006db315802?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Mala',
    slug: 'mala',
    description: 'Siddh Sphatik, Tulsi & Rudraksha 108 Beads Japa Mala',
    order: 4,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Astrological Gemstone Rings in Panchdhatu, Gold & Silver',
    order: 5,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Shivlings',
    slug: 'shivlings',
    description: 'Sacred Narmadeshwar & Natural Sphatik Crystal Shivlings',
    order: 6,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Free Gems Recommendation',
    slug: 'free-gems-recommendation',
    description: 'Free Kundli Astrology Analysis by Vedic Acharyas',
    order: 7,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Crystal Products',
    slug: 'crystal-products',
    description: 'Natural Raw Healing Crystals, Geodes, Clusters & Pyramids',
    order: 8,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=1200'
  }
];

async function syncCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB.');

    for (const cat of masterCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true, new: true }
      );
      console.log(`Synced Category: ${cat.name}`);
    }

    console.log('✅ Master categories successfully synced with database and admin panel!');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing categories:', err);
    process.exit(1);
  }
}

syncCategories();
