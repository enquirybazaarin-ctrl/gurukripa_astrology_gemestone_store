import mongoose from 'mongoose';
import { User } from '../modules/auth/auth.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to promote a user to admin role
 * Usage: tsx src/scripts/makeAdmin.ts <phone_number>
 */

const makeAdmin = async (phone: string) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Find user by phone
        const user = await User.findOne({ phone });

        if (!user) {
            console.error(`❌ User with phone ${phone} not found`);
            process.exit(1);
        }

        // Check if already admin
        if (user.role === 'admin') {
            console.log(`ℹ️  User ${phone} is already an admin`);
            process.exit(0);
        }

        // Update role to admin
        user.role = 'admin';
        await user.save();

        console.log(`✅ Successfully promoted user ${phone} to admin`);
        console.log(`User details:`);
        console.log(`  - Phone: ${user.phone}`);
        console.log(`  - Email: ${user.email || 'Not set'}`);
        console.log(`  - Name: ${user.name || 'Not set'}`);
        console.log(`  - Role: ${user.role}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

// Get phone number from command line arguments
const phone = process.argv[2];

if (!phone) {
    console.error('❌ Please provide a phone number');
    console.log('Usage: tsx src/scripts/makeAdmin.ts <phone_number>');
    console.log('Example: tsx src/scripts/makeAdmin.ts 9696717305');
    process.exit(1);
}

makeAdmin(phone);
