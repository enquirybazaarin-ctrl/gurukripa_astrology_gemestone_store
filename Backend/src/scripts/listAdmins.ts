import mongoose from 'mongoose';
import { User } from '../modules/auth/auth.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to list all admin users
 * Usage: tsx src/scripts/listAdmins.ts
 */

const listAdmins = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Find all admin users
        const admins = await User.find({ role: 'admin' });

        if (admins.length === 0) {
            console.log('ℹ️  No admin users found');
            process.exit(0);
        }

        console.log(`\n📋 Found ${admins.length} admin user(s):\n`);

        admins.forEach((admin, index) => {
            console.log(`${index + 1}. Phone: ${admin.phone}`);
            console.log(`   Email: ${admin.email || 'Not set'}`);
            console.log(`   Name: ${admin.name || 'Not set'}`);
            console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

listAdmins();
