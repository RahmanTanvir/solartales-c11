// Comprehensive NASA API Integration Test
const { config } = require('dotenv');

config();

// Test NASA APIs integration
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
    
    // Get recent geomagnetic storms
    const gstResponse = await fetch(
      `${DONKI_BASE_URL}GST?startDate=2025-01-01&endDate=2025-08-20&api_key=${NASA_API_KEY}`
    );
    
    if (!gstResponse.ok) {
      throw new Error(`GST API Error: ${gstResponse.status}`);
    }
    
    const gstData = await gstResponse.json();
    console.log('✅ Geomagnetic Storm API working:', gstData.length, 'events found');
    
    return { flares: flareData, cmes: cmeData, storms: gstData };
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
    
    // Test solar wind data
    const solarWindResponse = await fetch(`${NOAA_BASE_URL}solar-wind/mag-1-day.json`);
    if (solarWindResponse.ok) {
      const solarWindData = await solarWindResponse.json();
      console.log('✅ NOAA Solar Wind API working:', solarWindData.length, 'data points');
    }
    
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
  console.log('🚀 Starting Comprehensive NASA API Integration Tests...\n');
  
  const results = {
    donki: await testDONKIAPI(),
    noaa: await testNOAAAPI(),
    apod: await testAPODAPI()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('DONKI API (Solar Flares, CMEs, Storms):', results.donki ? '✅ Working' : '❌ Failed');
  console.log('NOAA API (K-Index, Solar Wind):', results.noaa ? '✅ Working' : '❌ Failed');
  console.log('APOD API (Solar Images):', results.apod ? '✅ Working' : '❌ Failed');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\nOverall API Integration:', allPassed ? '✅ All Tests Passed' : '❌ Some Tests Failed');
  
  if (allPassed) {
    console.log('\n🎉 All NASA and NOAA APIs are working correctly!');
    console.log('Ready for space weather data integration and story generation!');
  }
  
  return allPassed;
}

// Run tests
runAPITests().then(success => {
  process.exit(success ? 0 : 1);
});
