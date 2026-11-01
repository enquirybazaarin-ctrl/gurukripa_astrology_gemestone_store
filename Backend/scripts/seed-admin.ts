import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/modules/auth/auth.model';

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    
    // Default admin emails to seed
    const emailsToSeed = ['adminmustafa@rajahomedecor.com'];
    
    // Add admin email from .env if present
    if (process.env.ADMIN_EMAILS) {
      const envEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim());
      envEmails.forEach(email => {
        if (!emailsToSeed.includes(email)) {
          emailsToSeed.push(email);
        }
      });
    }
    
    for (const email of emailsToSeed) {
      // Check if this specific admin exists
      let admin = await User.findOne({ email: email.toLowerCase() });
      
      const adminPassword = 'Raja@Admin#Secure$2026';
      
      if (admin) {
        console.log(`Admin ${email} already exists. Resetting password and ensuring role...`);
        admin.password = adminPassword;
        admin.role = 'admin';
        await admin.save();
      } else {
        console.log(`Creating admin: ${email}...`);
        admin = new User({
          email: email,
          password: adminPassword,
          name: email.split('@')[0],
          role: 'admin',
          phone: email === 'adminmustafa@rajahomedecor.com' ? '9876543210' : Math.floor(7000000000 + Math.random() * 3000000000).toString()
        });
        await admin.save();
      }
      console.log(`Success! Admin access configured for: ${email}`);
    }
    
    console.log(`\nAll admins password set to: Raja@Admin#Secure$2026`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin', error);
    process.exit(1);
  }
};


seedAdmin();
