
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from './src/modules/products/product.model';
import { Category } from './src/modules/categories/category.model';

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkProducts() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGODB_URI as string);

        const products = await Product.find({}).populate('category');
        console.log(`Found ${products.length} products.`);

        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`  - ID: ${p._id}`);
            console.log(`  - Category Field: ${p.category}`);
            if (p.category && (p.category as any).name) {
                console.log(`  - Resolved Category: ${(p.category as any).name} (${(p.category as any).slug})`);
            } else {
                console.log(`  - WARNING: Category NOT resolved or null.`);
            }
        });

        const categories = await Category.find({});
        console.log('\n--- Categories in DB ---');
        categories.forEach(c => console.log(`${c.name} (Slug: ${c.slug}, ID: ${c._id})`));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkProducts();
