import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

const BASE_URL = 'http://localhost:5000/api/v1'; // Adjust if needed

export default function () {
    // Test 1: Get Homepage Products
    const res = http.get(`${BASE_URL}/products?page=1&limit=10`);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'duration < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
