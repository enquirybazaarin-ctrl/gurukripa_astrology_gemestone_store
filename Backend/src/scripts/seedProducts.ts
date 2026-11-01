import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { Category } from '../modules/categories/category.model';
import { Product } from '../modules/products/product.model';

// Mock Data (Manual copy to avoid importing from frontend which might fail due to path issues or TS configs)
const CATEGORIES = [
    { name: 'Candle Jars', slug: 'candle-jars', description: 'Premium Glass Candle Jars' },
    { name: 'Votives', slug: 'votives', description: 'Elegant Votive Holders' },
    { name: 'Gift Hampers', slug: 'gift-hampers', description: 'Exclusive Gift Sets' },
    { name: 'Bowls & Thali', slug: 'bowls-thali', description: 'Traditional & Modern Serving Ware' },
    { name: 'Bell Jars', slug: 'bell-jars', description: 'Glass Bell Jars & Domes' }
];

const PRODUCTS = [
    // Candle Jars
    {
        name: 'Premium Cylinder Glass Candle Jar 200ml',
        images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'],
        rating: 4.5,
        totalReviews: 234,
        price: 299,
        originalPrice: 599,
        description: 'Premium quality cylinder glass candle jar',
        categorySlug: 'candle-jars',
        tag: 'Factory Price',
        capacity: 200,
        height: 3,
        lid: 'with-lid',
        finish: 'clear',
        shape: 'cylinder',
        design: 'plain',
        sku: 'CJ-001',
        stock: 100
    },
    {
        name: 'Diamond Cut Glass Candle Holder 300ml',
        images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'],
        rating: 4.8,
        totalReviews: 456,
        price: 449,
        originalPrice: 899,
        description: 'Beautiful diamond cut pattern glass holder',
        categorySlug: 'candle-jars',
        tag: 'Best Seller',
        isBestSeller: true,
        capacity: 300,
        height: 4,
        lid: 'without-lid',
        finish: 'clear',
        shape: 'cylinder',
        design: 'diamond',
        sku: 'CJ-002',
        stock: 50
    },
    // Votives
    {
        name: 'Clear Glass Votive Holder 60ml',
        images: ['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80'],
        rating: 4.3,
        totalReviews: 198,
        price: 99,
        originalPrice: 199,
        description: 'Small clear glass votive holder',
        categorySlug: 'votives',
        tag: 'Factory Price',
        capacity: 60,
        size: 2,
        finish: 'clear',
        shape: 'round',
        sku: 'VT-001',
        stock: 200
    },
    // Gift Hampers
    {
        name: 'Premium Bird Lid Gift Jar - Single',
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'],
        rating: 4.8,
        totalReviews: 234,
        price: 899,
        originalPrice: 1499,
        description: 'Elegant gift jar with bird lid design',
        categorySlug: 'gift-hampers',
        tag: 'Best Seller',
        isBestSeller: true,
        setType: 'single',
        lidDesign: 'bird',
        finish: 'gold',
        occasion: 'wedding',
        sku: 'GH-001',
        stock: 30
    },
    // Bowls & Thali
    {
        name: 'Glass Serving Bowl 6" with Gold Stand',
        images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'],
        rating: 4.6,
        totalReviews: 234,
        price: 799,
        originalPrice: 1299,
        description: 'Elegant serving bowl with stand',
        categorySlug: 'bowls-thali',
        tag: 'Best Seller',
        isBestSeller: true,
        diameter: 6,
        capacity: 500,
        stand: 'yes',
        finish: 'gold',
        use: 'serving',
        sku: 'BT-001',
        stock: 40
    },
    // Bell Jars
    {
        name: 'Clear Glass Bell Jar 8" - Cake Cover',
        images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'],
        rating: 4.6,
        totalReviews: 234,
        price: 899,
        originalPrice: 1499,
        description: 'Perfect for displaying cakes',
        categorySlug: 'bell-jars',
        tag: 'Best Seller',
        isBestSeller: true,
        diameter: 8,
        height: 10,
        capacity: 1500,
        finish: 'clear',
        sku: 'BJ-001',
        stock: 60
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('📦 Connected to Database');

        // 1. Seed Categories
        console.log('🌱 Seeding Categories...');
        const categoryMap: Record<string, string> = {};

        for (const cat of CATEGORIES) {
            const category = await Category.findOneAndUpdate(
                { slug: cat.slug },
                cat,
                { upsert: true, new: true }
            );
            categoryMap[cat.slug] = category._id.toString();
        }
        console.log(`✅ Seeded ${Object.keys(categoryMap).length} categories`);

        // 2. Seed Products
        console.log('🌱 Seeding Products...');
        let productCount = 0;
        for (const prod of PRODUCTS) {
            const { categorySlug, ...productData } = prod;
            const categoryId = categoryMap[categorySlug];

            if (!categoryId) {
                console.warn(`⚠️ Category not found for slug: ${categorySlug}, skipping product: ${prod.name}`);
                continue;
            }

            await Product.findOneAndUpdate(
                { sku: prod.sku },
                { ...productData, category: categoryId },
                { upsert: true, new: true }
            );
            productCount++;
        }
        console.log(`✅ Seeded ${productCount} products`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
