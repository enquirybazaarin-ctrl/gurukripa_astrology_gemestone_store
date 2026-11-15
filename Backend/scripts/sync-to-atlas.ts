import 'dotenv/config';
import { MongoClient } from 'mongodb';

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/gurukripa_gemstone';
const ATLAS_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gurukripa_gemstone';

async function syncToAtlas() {
  console.log('Connecting to Local and Atlas databases...');
  const localClient = new MongoClient(LOCAL_URI);
  const atlasClient = new MongoClient(ATLAS_URI);

  try {
    await localClient.connect();
    console.log('✅ Connected to Local MongoDB');

    await atlasClient.connect();
    console.log('✅ Connected to MongoDB Atlas Cloud');

    const localDb = localClient.db('gurukripa_gemstone');
    const atlasDb = atlasClient.db('gurukripa_gemstone');

    const collections = await localDb.listCollections().toArray();

    for (const colInfo of collections) {
      const colName = colInfo.name;
      const count = await localDb.collection(colName).countDocuments();
      if (count === 0) continue;

      console.log(`\nSyncing ${colName} (${count} documents)...`);
      const docs = await localDb.collection(colName).find({}).toArray();

      const atlasCol = atlasDb.collection(colName);
      await atlasCol.deleteMany({}); // Clean sync
      await atlasCol.insertMany(docs);
      console.log(`✅ Synced ${docs.length} docs to Atlas collection "${colName}"`);
    }

    console.log('\n=============================================');
    console.log('🎉 ALL DATA SUCCESSFULLY SYNCED TO ATLAS! 🎉');
    console.log('=============================================\n');
  } catch (err) {
    console.error('Sync failed:', err);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

syncToAtlas();
