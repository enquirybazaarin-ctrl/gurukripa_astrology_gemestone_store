import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/modules/auth/auth.model';

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    
    // Default admin emails to seed
    const emailsToSeed = [
      'admin@gurukripagems.com',
      'admin@gurukripagemstone.com',
      'adminmustafa@rajahomedecor.com'
    ];
    
    // Add admin email from .env if present
    if (process.env.ADMIN_EMAILS) {
      const envEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim());
      envEmails.forEach(email => {
        if (!emailsToSeed.includes(email)) {
          emailsToSeed.push(email);
        }
      });
    }
    
    const adminPassword = 'GuruKripa@Admin2026';

    for (const email of emailsToSeed) {
      // Check if this specific admin exists
      let admin = await User.findOne({ email: email.toLowerCase() });
      
      if (admin) {
        console.log(`Admin ${email} already exists. Resetting password and ensuring role...`);
        admin.password = adminPassword;
        admin.role = 'admin';
        await admin.save();
      } else {
        console.log(`Creating admin: ${email}...`);
        admin = new User({
          email: email.toLowerCase(),
          password: adminPassword,
          name: email.split('@')[0],
          role: 'admin',
          phone: email === 'admin@gurukripagems.com' ? '9323600011' : Math.floor(7000000000 + Math.random() * 3000000000).toString()
        });
        await admin.save();
      }
      console.log(`Success! Admin access configured for: ${email}`);
    }
    
    console.log(`\nAll admins password set to: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin', error);
    process.exit(1);
  }
};


seedAdmin();
