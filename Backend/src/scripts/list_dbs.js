
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://ptamit7826_db_user:iqvL0u3UorBsSM9j@cluster0.quoig9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
    try {
        const client = await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const { databases } = await admin.listDatabases();

        console.log('\nAvailable Databases:');
        for (const dbInfo of databases) {
            console.log(` - ${dbInfo.name} (Size: ${dbInfo.sizeOnDisk})`);
        }

        // Check specific databases for 'products'
        const dbsToCheck = ['ecommerce-db', 'test', 'admin', 'local'];

        for (const dbName of dbsToCheck) {
            try {
                console.log(`\nChecking DB: [${dbName}]...`);
                // Switch DB
                const conn = mongoose.connection.useDb(dbName);
                const collections = await conn.db.listCollections().toArray();

                if (collections.length === 0) {
                    console.log(`   (No collections found)`);
                    continue;
                }

                for (const col of collections) {
                    const count = await conn.db.collection(col.name).countDocuments();
                    console.log(`   - Collection: ${col.name} (Count: ${count})`);
                }
            } catch (err) {
                console.log(`   Error checking ${dbName}: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
