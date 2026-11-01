import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/modules/auth/auth.model';

const checkDetails = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(uri);
    
    const user = await User.findOne({ email: 'ptamit7826@gmail.com' }).select('+password');
    if (user) {
      console.log(`User: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Phone: ${user.phone}`);
      console.log(`Has Password: ${!!user.password}`);
    } else {
      console.log('User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking user', error);
    process.exit(1);
  }
};

checkDetails();
