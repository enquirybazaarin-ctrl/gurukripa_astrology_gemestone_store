import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/modules/auth/auth.model';

const checkSpecificAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(uri);
    
    const emails = ['adminmustafa@rajahomedecor.com', 'ptamit7826@gmail.com'];
    
    for (const email of emails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`User ${email} exists. Role: ${user.role}`);
      } else {
        console.log(`User ${email} does not exist.`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking user', error);
    process.exit(1);
  }
};

checkSpecificAdmin();
