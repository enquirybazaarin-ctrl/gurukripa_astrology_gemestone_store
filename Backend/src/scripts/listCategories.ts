import mongoose from 'mongoose';
import { Category } from '../modules/categories/category.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to list all categories in the database
 * Usage: tsx src/scripts/listCategories.ts
 */

const listCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Find all categories
        const categories = await Category.find().sort({ name: 1 });

        if (categories.length === 0) {
            console.log('ℹ️  No categories found in database');
            console.log('💡 You may need to seed categories first');
            process.exit(0);
        }

        console.log(`\n📋 Found ${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}:\n`);

        categories.forEach((cat, index) => {
            console.log(`${index + 1}. Name: ${cat.name}`);
            console.log(`   Slug: ${cat.slug}`);
            console.log(`   Active: ${cat.isActive ? '✅' : '❌'}`);
            console.log(`   ID: ${cat._id}`);
            if (cat.description) {
                console.log(`   Description: ${cat.description.substring(0, 50)}...`);
            }
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

listCategories();
