import axios from 'axios';

const testLogin = async () => {
  const url = 'http://localhost:5000/api/v1/auth/login';
  const credentials = {
    email: 'adminmustafa@rajahomedecor.com',
    password: 'Raja@Admin#Secure$2026'
  };

  try {
    console.log(`Attempting login at ${url}...`);
    const response = await axios.post(url, credentials);
    console.log('Login successful!');
    console.log('User role:', response.data.data.user.role);
  } catch (error: any) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin();
