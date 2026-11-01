import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from './src/modules/products/product.model';
import { Category } from './src/modules/categories/category.model';

dotenv.config({ path: path.join(__dirname, '.env') });

const productsToSeed = [
    {
        name: 'Classic Scented Candle',
        description: 'A beautiful scented candle in a glass jar. Perfect for any room.',
        price: 499,
        originalPrice: 699,
        stock: 50,
        sku: 'CAN-001',
        images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800'],
        categorySlug: 'candle-jars',
        status: 'active',
        isBestSeller: true,
        showOnHome: true
    },
    {
        name: 'Lavender Votive Set',
        description: 'Set of 3 lavender scented votives. Ideal for gifts.',
        price: 299,
        originalPrice: 399,
        stock: 30,
        sku: 'VOT-001',
        images: ['https://images.unsplash.com/photo-1570830821501-83190825fdb3?auto=format&fit=crop&q=80&w=800'],
        categorySlug: 'votives',
        status: 'active',
        isBestSeller: false,
        showOnHome: true
    },
    {
        name: 'Luxury Gift Hamper',
        description: 'A premium gift hamper containing candles, votives and more.',
        price: 1299,
        originalPrice: 1599,
        stock: 20,
        sku: 'GFT-001',
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'],
        categorySlug: 'gift-hampers',
        status: 'active',
        isBestSeller: true,
        showOnHome: true
    }
];

async function seedProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');

        for (const prodData of productsToSeed) {
            const { categorySlug, ...rest } = prodData;
            const category = await Category.findOne({ slug: categorySlug });
            
            if (!category) {
                console.log(`Category not found for slug: ${categorySlug}`);
                continue;
            }

            const exists = await Product.findOne({ sku: rest.sku });
            if (exists) {
                console.log(`Product exists: ${rest.name} (${rest.sku})`);
            } else {
                console.log(`Creating product: ${rest.name}...`);
                await Product.create({
                    ...rest,
                    category: category._id
                });
                console.log(`Created: ${rest.name}`);
            }
        }

        console.log('Product seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts();
