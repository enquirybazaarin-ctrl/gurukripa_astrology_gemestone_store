import mongoose from 'mongoose';
import { Category } from '../modules/categories/category.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to seed categories into the database
 * Usage: tsx src/scripts/seedCategories.ts
 */

const categories = [
    {
        name: 'Candle Jars',
        slug: 'candle-jars',
        description: 'Beautiful candle jars for home decor and ambiance',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
        banner: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60',
        isActive: true,
        order: 1
    },
    {
        name: 'Votives',
        slug: 'votives',
        description: 'Elegant votive candle holders for special occasions',
        image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80',
        banner: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60',
        isActive: true,
        order: 2
    },
    {
        name: 'Gift Hampers',
        slug: 'gift-hampers',
        description: 'Curated gift hampers for every occasion',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        banner: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60',
        isActive: true,
        order: 3
    },
    {
        name: 'Bowls & Thali',
        slug: 'bowls-thali',
        description: 'Decorative bowls and thali sets for home and gifting',
        image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80',
        banner: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60',
        isActive: true,
        order: 4
    },
    {
        name: 'Bell Jars',
        slug: 'bell-jars',
        description: 'Elegant bell jar decorative pieces',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
        banner: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60',
        isActive: true,
        order: 5
    }
];

const seedCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Check if categories already exist
        const existingCount = await Category.countDocuments();

        if (existingCount > 0) {
            console.log(`ℹ️  Found ${existingCount} existing categories`);
            console.log('⚠️  Skipping seed to avoid duplicates');
            console.log('💡 To re-seed, delete existing categories first');
            process.exit(0);
        }

        // Insert categories
        console.log('📝 Seeding categories...');
        const result = await Category.insertMany(categories);

        console.log(`✅ Successfully seeded ${result.length} categories:\n`);

        result.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
            console.log(`   ID: ${cat._id}`);
        });

        console.log('\n🎉 Category seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
