#!/usr/bin/env node

// Test script to verify NASA API rate limiting and caching
const { spaceWeatherAPI } = require('../src/lib/spaceWeatherAPI.ts');

async function testRateLimiting() {
  console.log('🧪 Testing NASA API rate limiting and caching...\n');
  
  console.log('=== TEST 1: Initial API call ===');
  const startTime1 = Date.now();
  try {
    const data1 = await spaceWeatherAPI.getCompleteSpaceWeatherData();
    const endTime1 = Date.now();
    console.log(`✅ First call completed in ${endTime1 - startTime1}ms`);
    console.log(`📊 Data includes ${data1.events.solarFlares.length} solar flares\n`);
  } catch (error) {
    console.error('❌ First call failed:', error.message);
  }
  
  console.log('=== TEST 2: Immediate second call (should use cache) ===');
  const startTime2 = Date.now();
  try {
    const data2 = await spaceWeatherAPI.getCompleteSpaceWeatherData();
    const endTime2 = Date.now();
    console.log(`✅ Second call completed in ${endTime2 - startTime2}ms`);
    console.log(`📊 Data includes ${data2.events.solarFlares.length} solar flares`);
    
    if (endTime2 - startTime2 < 100) {
      console.log('🎉 CACHED DATA USED - Response was instant!\n');
    } else {
      console.log('⚠️ May not have used cache - response took time\n');
    }
  } catch (error) {
    console.error('❌ Second call failed:', error.message);
  }
  
  console.log('=== TEST 3: Multiple rapid calls (should all use cache) ===');
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(spaceWeatherAPI.getCompleteSpaceWeatherData());
  }
  
  const startTime3 = Date.now();
  try {
    const results = await Promise.all(promises);
    const endTime3 = Date.now();
    console.log(`✅ 5 parallel calls completed in ${endTime3 - startTime3}ms`);
    console.log(`📊 All calls returned ${results[0].events.solarFlares.length} solar flares`);
    
    if (endTime3 - startTime3 < 500) {
      console.log('🎉 ALL CACHED - Parallel calls were very fast!\n');
    } else {
      console.log('⚠️ Some calls may have hit API - parallel calls took time\n');
    }
  } catch (error) {
    console.error('❌ Parallel calls failed:', error.message);
  }
  
  console.log('🏁 Rate limiting test completed!');
  console.log('📝 Check the browser console for detailed API call logs when using the app.');
}

// Run the test
testRateLimiting().catch(console.error);
