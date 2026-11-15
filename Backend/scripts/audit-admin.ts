import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runAudit() {
  console.log('====================================================');
  console.log('   GURU KRIPA ASTROLOGY & GEMS STONE - ADMIN AUDIT   ');
  console.log('====================================================\n');

  const results: { module: string; test: string; status: 'PASS' | 'FAIL'; note?: string }[] = [];

  // Helper
  const logTest = (module: string, test: string, passed: boolean, note?: string) => {
    results.push({ module, test, status: passed ? 'PASS' : 'FAIL', note });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${module}] ${test} ${note ? `-> ${note}` : ''}`);
  };

  let token = '';
  let csrfToken = '';

  // 1. Admin Authentication
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@gurukripagems.com',
      password: 'GuruKripa@Admin2026'
    });
    token = loginRes.data.data?.accessToken;
    csrfToken = loginRes.data.data?.csrfToken;
    const role = loginRes.data.data?.user?.role;
    logTest('Auth', 'Admin Login & Token Generation', !!token && role === 'admin', `Role: ${role}`);
  } catch (err: any) {
    const errMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    logTest('Auth', 'Admin Login & Token Generation', false, errMsg);
    console.error('Authentication failed, aborting rest of audit. Status:', err.response?.status, 'Data:', err.response?.data);
    return;
  }

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'X-CSRF-Token': csrfToken || '',
      'Content-Type': 'application/json'
    }
  });

  // 2. Dashboard Stats
  try {
    const dashRes = await client.get('/admin/dashboard');
    const d = dashRes.data.data || dashRes.data;
    logTest('Dashboard', 'Fetch Dashboard Statistics', true, `Orders: ${d.totalOrders ?? 0}, Revenue: ₹${d.totalRevenue ?? 0}`);
  } catch (err: any) {
    logTest('Dashboard', 'Fetch Dashboard Statistics', false, err.response?.data?.message || err.message);
  }

  // 3. Category Management
  let testCategoryId = '';
  try {
    const getCat = await client.get('/categories');
    const catList = getCat.data.data?.categories || getCat.data.data || [];
    logTest('Categories', 'List Categories', Array.isArray(catList), `Found ${catList.length} categories`);

    // Create Category
    const createCat = await client.post('/categories', {
      name: 'Audit Test Gem',
      slug: `audit-test-gem-${Date.now()}`,
      description: 'Temporary category for system audit',
      isActive: true,
      order: 99
    });
    testCategoryId = createCat.data.data?.category?._id;
    logTest('Categories', 'Create Category', !!testCategoryId, `Created ID: ${testCategoryId}`);

    // Update Category
    if (testCategoryId) {
      await client.put(`/categories/${testCategoryId}`, {
        name: 'Audit Test Gem (Updated)',
        description: 'Updated description'
      });
      logTest('Categories', 'Update Category', true);

      // Delete Category
      await client.delete(`/categories/${testCategoryId}`);
      logTest('Categories', 'Delete Category', true);
    }
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    logTest('Categories', 'Category CRUD Cycle', false, msg);
    if (testCategoryId) {
      try { await client.delete(`/categories/${testCategoryId}`); } catch (_) {}
    }
  }

  // 4. Product Management
  let testProductId = '';
  try {
    const getProds = await client.get('/admin/products?limit=5');
    const prods = getProds.data.data?.products || [];
    logTest('Products', 'List Admin Products', Array.isArray(prods), `Loaded ${prods.length} products`);

    // Create Test Product
    const firstCat = (await client.get('/categories')).data.data?.categories?.[0];
    const catId = firstCat?._id || '6ae700000000000000000001';

    const createProd = await client.post('/products', {
      title: 'Audit Vedic Yellow Sapphire (Pukhraj)',
      name: 'Audit Vedic Yellow Sapphire (Pukhraj)',
      description: '100% Natural unheated gemstone for audit testing',
      price: 25000,
      stock: 5,
      category: catId,
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
      status: 'active'
    });
    testProductId = createProd.data.data?.product?._id;
    logTest('Products', 'Create Product', !!testProductId, `Created ID: ${testProductId}`);

    // Update Product
    if (testProductId) {
      await client.patch(`/products/${testProductId}`, {
        price: 27500,
        stock: 4
      });
      logTest('Products', 'Update Product', true, 'Price updated to ₹27,500');

      // Delete Product
      await client.delete(`/products/${testProductId}`);
      logTest('Products', 'Delete Product', true);
    }
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    logTest('Products', 'Product CRUD Cycle', false, msg);
    if (testProductId) {
      try { await client.delete(`/products/${testProductId}`); } catch (_) {}
    }
  }

  // 5. Orders Management
  try {
    const getOrders = await client.get('/orders/admin/all?page=1&limit=5');
    const orderData = getOrders.data.data;
    const totalOrders = orderData?.total ?? orderData?.orders?.length ?? 0;
    logTest('Orders', 'List Customer Orders', Array.isArray(orderData?.orders), `Total orders: ${totalOrders}`);
  } catch (err: any) {
    logTest('Orders', 'List Customer Orders', false, err.response?.data?.message || err.message);
  }

  // 6. Customer Enquiries & Free Janampatri Leads
  try {
    const getEnquiries = await client.get('/admin/bulk-enquiries');
    const enquiries = getEnquiries.data.data?.enquiries || [];
    logTest('Enquiries', 'List Customer Leads/Kundli Enquiries', Array.isArray(enquiries), `Count: ${enquiries.length}`);
  } catch (err: any) {
    logTest('Enquiries', 'List Customer Leads', false, err.response?.data?.message || err.message);
  }

  // 7. Reviews Management
  try {
    const getReviews = await client.get('/reviews/admin/all');
    const reviews = getReviews.data.data?.reviews || [];
    logTest('Reviews', 'List Customer Reviews', Array.isArray(reviews), `Count: ${reviews.length}`);
  } catch (err: any) {
    logTest('Reviews', 'List Customer Reviews', false, err.response?.data?.message || err.message);
  }

  // 8. Banners Management
  let testBannerId = '';
  try {
    const getBanners = await client.get('/banners/all');
    const banners = getBanners.data.data?.banners || [];
    logTest('Banners', 'List Banners', Array.isArray(banners), `Count: ${banners.length}`);

    // Create Banner
    const createBanner = await client.post('/banners', {
      title: 'Audit Vedic Banner',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200',
      link: '/category/yellow-sapphire',
      page: 'home',
      order: 99,
      isActive: true
    });
    testBannerId = createBanner.data.data?.banner?._id;
    logTest('Banners', 'Create Banner', !!testBannerId, `Created ID: ${testBannerId}`);

    // Update Banner
    if (testBannerId) {
      await client.patch(`/banners/${testBannerId}`, {
        title: 'Audit Vedic Banner (Updated)',
        isActive: false
      });
      logTest('Banners', 'Update Banner', true);

      // Delete Banner
      await client.delete(`/banners/${testBannerId}`);
      logTest('Banners', 'Delete Banner', true);
    }
  } catch (err: any) {
    logTest('Banners', 'Banner CRUD Cycle', false, err.response?.data?.message || err.message);
    if (testBannerId) {
      try { await client.delete(`/banners/${testBannerId}`); } catch (_) {}
    }
  }

  // 9. Stories Management
  try {
    const getStories = await client.get('/stories/all');
    const stories = getStories.data.data?.stories || [];
    logTest('Stories', 'List Astrology & Gemstone Stories', Array.isArray(stories), `Count: ${stories.length}`);
  } catch (err: any) {
    logTest('Stories', 'List Stories', false, err.response?.data?.message || err.message);
  }

  // 10. Coupons Management
  let testCouponId = '';
  try {
    const getCoupons = await client.get('/admin/coupons');
    const coupons = getCoupons.data.data?.coupons || [];
    logTest('Coupons', 'List Discount Coupons', Array.isArray(coupons), `Count: ${coupons.length}`);

    // Create Coupon
    const code = `TEST${Math.floor(1000 + Math.random() * 9000)}`;
    const createCoupon = await client.post('/admin/coupons', {
      code,
      type: 'percentage',
      value: 15,
      minPurchase: 5000,
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
      usageLimit: 100,
      status: 'active'
    });
    testCouponId = createCoupon.data.data?.coupon?._id;
    logTest('Coupons', 'Create Discount Coupon', !!testCouponId, `Code: ${code}`);

    // Update Coupon
    if (testCouponId) {
      await client.patch(`/admin/coupons/${testCouponId}`, {
        value: 20
      });
      logTest('Coupons', 'Update Discount Coupon', true, 'Discount updated to 20%');

      // Delete Coupon
      await client.delete(`/admin/coupons/${testCouponId}`);
      logTest('Coupons', 'Delete Discount Coupon', true);
    }
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    logTest('Coupons', 'Coupon CRUD Cycle', false, msg);
    if (testCouponId) {
      try { await client.delete(`/admin/coupons/${testCouponId}`); } catch (_) {}
    }
  }

  // 11. Store Settings (Announcement Bar)
  try {
    const getSetting = await client.get('/settings/announcement_bar');
    logTest('Settings', 'Fetch Announcement Bar Setting', true);

    await client.put('/settings/announcement_bar', {
      value: {
        isActive: true,
        text: '✨ 100% Certified Vedic Gemstones • Free Puja & Lab Report Included 🕉️'
      },
      isPublic: true,
      description: 'Top announcement bar configuration'
    });
    logTest('Settings', 'Update Announcement Bar Setting', true);

    // Verify Public Access (Frontend Endpoint)
    const publicSetting = await axios.get(`${BASE_URL}/settings/public/announcement_bar`);
    const settingText = publicSetting.data.data?.setting?.value?.text;
    logTest('Settings', 'Frontend Public Announcement Bar Fetch', !!settingText, `Active: "${settingText}"`);
  } catch (err: any) {
    const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    logTest('Settings', 'Store Settings Check', false, msg);
  }

  console.log('\n====================================================');
  const allPassed = results.every(r => r.status === 'PASS');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.filter(r => r.status === 'PASS').length} | FAILED: ${results.filter(r => r.status === 'FAIL').length}`);
  console.log(`OVERALL AUDIT STATUS: ${allPassed ? '✅ 100% PASSED' : '⚠️ ISSUES DETECTED'}`);
  console.log('====================================================\n');
}

runAudit();

