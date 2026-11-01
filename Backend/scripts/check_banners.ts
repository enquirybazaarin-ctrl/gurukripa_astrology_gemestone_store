
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Banner } from '../src/modules/banners/banner.model';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkBanners = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce'; // Fallback
        console.log('Connecting to MongoDB:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const allBanners = await Banner.find({});
        console.log(`Total Banners Found: ${allBanners.length}`);

        allBanners.forEach(b => {
            console.log(`Banner ID: ${b._id}`);
            console.log(`  Title: ${b.title}`);
            console.log(`  IsActive: ${b.isActive}`);
            console.log(`  Start Date: ${b.startDate}`);
            console.log(`  End Date: ${b.endDate}`);
            console.log(`  Order: ${b.order}`);
            console.log('---');
        });

        const now = new Date();
        const activeBanners = await Banner.find({
            isActive: true,
            $or: [
                { startDate: { $lte: now }, endDate: { $gte: now } },
                { startDate: null, endDate: null }
            ]
        });

        console.log(`Active Banners (Query Match): ${activeBanners.length}`);

    } catch (error) {
        console.error('Error checking banners:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

checkBanners();
