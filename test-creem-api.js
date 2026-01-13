// Test Creem API
const { HttpsProxyAgent } = require('https-proxy-agent');
const CREEM_API_KEY = 'creem_test_4vFz6q3zXXKAvGspi6iup0';
const PRODUCT_ID = 'prod_2h4o9YVLDdR33ch289vaBs';
const PROXY_URL = 'http://127.0.0.1:7897';

const proxyAgent = new HttpsProxyAgent(PROXY_URL);

async function testCreemAPI() {
  console.log('Testing Creem API...\n');
  console.log('API Key:', CREEM_API_KEY);
  console.log('Product ID:', PRODUCT_ID);
  console.log('Proxy:', PROXY_URL);

  // Test 1: List products to verify API key
  console.log('\n--- Test 1: Listing products ---');
  try {
    const response = await fetch('https://api.creem.io/v1/products', {
      method: 'GET',
      headers: {
        'x-api-key': CREEM_API_KEY,
      },
      // @ts-ignore
      agent: proxyAgent,
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    // Check if our product is in the list
    if (data.products) {
      const product = data.products.find(p => p.id === PRODUCT_ID);
      if (product) {
        console.log('\n✅ Product found:', product);
      } else {
        console.log('\n❌ Product NOT found in list');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test 2: Create checkout
  console.log('\n--- Test 2: Creating checkout ---');
  try {
    const response = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_API_KEY,
      },
      // @ts-ignore
      agent: proxyAgent,
      body: JSON.stringify({
        product_id: PRODUCT_ID,
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/pricing',
        units: 1,
      }),
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCreemAPI();
