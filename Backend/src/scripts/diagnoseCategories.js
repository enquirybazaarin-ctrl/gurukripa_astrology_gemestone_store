
const mongoose = require('mongoose');

// Added /test to URI to force connection to that DB
const MONGO_URI = 'mongodb+srv://ptamit7826_db_user:iqvL0u3UorBsSM9j@cluster0.quoig9w.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected to [test] DB');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const checkData = async () => {
    await connectDB();

    try {
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
            name: String,
            category: mongoose.Schema.Types.Mixed,
            isActive: Boolean
        }, { strict: false }));

        const products = await Product.find({}, 'name category isActive');
        console.log(`\n--- Product Analysis (${products.length}) ---`);

        let inactive = 0;
        let active = 0;

        for (const p of products) {
            const status = p.isActive ? 'ACTIVE' : 'INACTIVE';
            if (p.isActive) active++;
            else inactive++;

            console.log(`[${status}] "${p.name}" (ID: ${p._id})`);
        }

        console.log(`\n--- Summary ---`);
        console.log(`Active: ${active}`);
        console.log(`Inactive: ${inactive}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkData();
