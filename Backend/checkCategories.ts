
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Category } from './src/modules/categories/category.model';

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const categoriesToSeed = [
    { name: 'Candle Jars', slug: 'candle-jars', isActive: true },
    { name: 'Votives', slug: 'votives', isActive: true },
    { name: 'Gift Hampers', slug: 'gift-hampers', isActive: true },
    { name: 'Bowls & Thali', slug: 'bowls-thali', isActive: true },
    { name: 'Bell Jars', slug: 'bell-jars', isActive: true }
];

async function seedCategories() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');

        for (const cat of categoriesToSeed) {
            const exists = await Category.findOne({ slug: cat.slug });
            if (exists) {
                console.log(`Category exists: ${cat.name} (${cat.slug})`);
            } else {
                console.log(`Creating category: ${cat.name}...`);
                await Category.create(cat);
                console.log(`Created: ${cat.name}`);
            }
        }

        console.log('Seeding check complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
