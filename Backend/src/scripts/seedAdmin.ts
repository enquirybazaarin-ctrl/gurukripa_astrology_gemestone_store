
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../modules/auth/auth.model';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const seedAdmins = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const admins = [
            {
                email: 'adminmustafa@rajahomedecor.com',
                password: 'Raja@Admin#Secure$2026', // Complex password as requested
                phone: '9876543210', // Placeholder phone
                name: 'Mustafa Admin'
            },
            {
                email: 'ptamit7826@gmail.com',
                password: 'Amit@Secure!Admin%7826', // Complex password
                phone: '9696717305',
                name: 'Amit Admin'
            }
        ];

        for (const adminData of admins) {
            let user = await User.findOne({ email: adminData.email });

            if (!user) {
                console.log(`Creating new admin user: ${adminData.email}`);
                await User.create({
                    ...adminData,
                    role: 'admin'
                });
            } else {
                console.log(`Updating existing user to admin: ${adminData.email}`);
                user.password = adminData.password;
                user.role = 'admin';
                user.name = adminData.name;
                user.phone = adminData.phone;
                await user.save();
            }
        }

        // Optional: Remove any other admin accounts if strict isolation is needed, 
        // but it's safer to just provide these.

        console.log('---------------------------');
        console.log('Admin Access Configured:');
        admins.forEach(a => {
            console.log(`- Email: ${a.email}`);
            console.log(`  Password: ${a.password}`);
        });
        console.log('---------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admins:', error);
        process.exit(1);
    }
};

seedAdmins();
