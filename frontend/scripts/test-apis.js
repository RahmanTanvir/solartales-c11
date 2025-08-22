// Test NASA APIs integration
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const DONKI_BASE_URL = 'https://api.nasa.gov/DONKI/';
const NOAA_BASE_URL = 'https://services.swpc.noaa.gov/products/';

// Test NASA DONKI API for Solar Flares
async function testDONKIAPI() {
  try {
    console.log('Testing NASA DONKI API...');
    
    // Get recent solar flares
    const flareResponse = await fetch(
      `${DONKI_BASE_URL}FLR?startDate=2025-01-01&endDate=2025-08-20&api_key=${NASA_API_KEY}`
    );
    
    if (!flareResponse.ok) {
      throw new Error(`DONKI API Error: ${flareResponse.status}`);
    }
    
    const flareData = await flareResponse.json();
    console.log('✅ Solar Flares API working:', flareData.length, 'events found');
    
    // Get recent CMEs
    const cmeResponse = await fetch(
      `${DONKI_BASE_URL}CME?startDate=2025-01-01&endDate=2025-08-20&api_key=${NASA_API_KEY}`
    );
    
    if (!cmeResponse.ok) {
      throw new Error(`CME API Error: ${cmeResponse.status}`);
    }
    
    const cmeData = await cmeResponse.json();
    console.log('✅ CME API working:', cmeData.length, 'events found');
    
    return { flares: flareData, cmes: cmeData };
  } catch (error) {
    console.error('❌ DONKI API Error:', error);
    return null;
  }
}

// Test NOAA Space Weather API
async function testNOAAAPI() {
  try {
    console.log('Testing NOAA Space Weather API...');
    
    // Get current space weather conditions
    const response = await fetch(`${NOAA_BASE_URL}noaa-planetary-k-index.json`);
    
    if (!response.ok) {
      throw new Error(`NOAA API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ NOAA K-Index API working:', data.length, 'data points');
    
    return data;
  } catch (error) {
    console.error('❌ NOAA API Error:', error);
    return null;
  }
}

// Test NASA APOD API (as SDO proxy)
async function testAPODAPI() {
  try {
    console.log('Testing NASA APOD API...');
    
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`APOD API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ APOD API working:', data.title);
    
    return data;
  } catch (error) {
    console.error('❌ APOD API Error:', error);
    return null;
  }
}

// Run all tests
async function runAPITests() {
  console.log('🚀 Starting NASA API Integration Tests...\n');
  
  const results = {
    donki: await testDONKIAPI(),
    noaa: await testNOAAAPI(),
    apod: await testAPODAPI()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('DONKI API:', results.donki ? '✅ Working' : '❌ Failed');
  console.log('NOAA API:', results.noaa ? '✅ Working' : '❌ Failed');
  console.log('APOD API:', results.apod ? '✅ Working' : '❌ Failed');
  
  return results;
}

// Export for use in other modules
export { testDONKIAPI, testNOAAAPI, testAPODAPI, runAPITests };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests();
}
