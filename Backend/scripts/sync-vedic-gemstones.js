const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gurukripa_gemstone';

mongoose.connect(mongoUri).then(async () => {
  const collection = mongoose.connection.db.collection('categories');
  
  const vedicGems = [
    {
      name: 'Yellow Sapphire (पुखराज)',
      slug: 'yellow-sapphire-pukhraj',
      description: 'Brihaspati | Marriage | Career',
      image: '/gemstones/yellow-sapphire.png',
      order: 1,
      isActive: true
    },
    {
      name: 'Blue Sapphire (नीलम)',
      slug: 'blue-sapphire-neelam',
      description: 'Saturn | Debt | Disease | Job',
      image: '/gemstones/blue-sapphire.png',
      order: 2,
      isActive: true
    },
    {
      name: 'Emerald (पन्ना)',
      slug: 'emerald-panna',
      description: 'Budh | Business | Money',
      image: '/gemstones/emerald.png',
      order: 3,
      isActive: true
    },
    {
      name: 'Ruby (माणिक)',
      slug: 'ruby-manikya',
      description: 'Surya | Status | Energy',
      image: '/gemstones/ruby.png',
      order: 4,
      isActive: true
    },
    {
      name: 'Opal (उपल)',
      slug: 'opal',
      description: 'Shukra | Attraction | Luxury',
      image: '/gemstones/opal.png',
      order: 5,
      isActive: true
    },
    {
      name: 'Hessonite (गोमेद)',
      slug: 'hessonite-gomed',
      description: 'Rahu | Politics | Stock | Market',
      image: '/gemstones/hessonite.png',
      order: 6,
      isActive: true
    },
    {
      name: 'Natural Pearl (मोती)',
      slug: 'natural-pearl-moti',
      description: 'Chandrama | Peace in Mind',
      image: '/gemstones/natural-pearl.png',
      order: 7,
      isActive: true
    },
    {
      name: 'Diamond (हीरा)',
      slug: 'diamond-heera',
      description: 'Averts | Mishaps | Courage | Overall | Strength',
      image: '/gemstones/diamond.png',
      order: 8,
      isActive: true
    },
    {
      name: 'Cat\'s Eye (लहसुनिया)',
      slug: 'cats-eye-lehsunia',
      description: 'Great Health | Will Power | Fame & Reputation',
      image: '/gemstones/cats-eye.png',
      order: 9,
      isActive: true
    },
    {
      name: 'Coral (मूंगा)',
      slug: 'red-coral-moonga',
      description: 'Mars | Health | Control | Anger',
      image: '/gemstones/coral.png',
      order: 10,
      isActive: true
    }
  ];

  for (const gem of vedicGems) {
    await collection.updateOne(
      { slug: gem.slug },
      { $set: { ...gem, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log('Upserted:', gem.name);
  }

  console.log('All 10 Vedic Gemstones successfully synced to MongoDB categories!');
  process.exit(0);
}).catch(err => {
  console.error('Error syncing:', err);
  process.exit(1);
});
