
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../modules/auth/auth.model';

import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
console.log('Loading env from:', path.join(process.cwd(), '.env'));

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const phone = '9696717305'; // The user's phone number
        const user = await User.findOne({ phone });

        if (!user) {
            console.log(`User with phone ${phone} not found. Creating new admin user...`);
            await User.create({
                phone,
                role: 'admin',
                name: 'Admin User',
                email: 'admin@example.com' // Optional but good to have
            });
            console.log('Admin user created successfully.');
        } else {
            console.log(`User found. Updating role to admin...`);
            user.role = 'admin';
            await user.save();
            console.log('User promoted to admin successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
