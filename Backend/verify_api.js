const axios = require('axios');
const API_URL = 'http://127.0.0.1:5000/api/v1';

async function verify() {
    console.log('🚀 Starting API Verification on ' + API_URL);

    try {
        // 1. Health Check
        try {
            const health = await axios.get('http://127.0.0.1:5000/health');
            console.log('✅ Health Check:', health.data);
        } catch (e) {
            console.error('❌ Health Check Failed:', e.message);
            if (e.code) console.error('   Code:', e.code);
        }

        // 2. Products
        try {
            const products = await axios.get(`${API_URL}/products`);
            console.log(`✅ Products: Found ${products.data.data.products.length} items`);
        } catch (e) {
            console.error('❌ Products API Failed:', e.message);
            if (e.response) console.error('   Status:', e.response.status, e.response.statusText);
        }

    } catch (error) {
        console.error('❌ Verification script critical error:', error);
    }
}

verify();
