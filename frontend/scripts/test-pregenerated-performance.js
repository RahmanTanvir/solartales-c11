// Test script for the pre-generated story API
// Run this to verify performance improvements

const BASE_URL = 'http://localhost:3007';

async function testPerformance() {
  console.log('🧪 Testing Pre-Generated Story API Performance...\n');

  // Test 1: Current situation stories
  console.log('📋 Test 1: Current Situation Stories');
  const start1 = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/api/stories/route-pregenerated?action=current-situation`);
    const data = await response.json();
    const duration1 = Date.now() - start1;
    
    console.log(`✅ Success: ${duration1}ms`);
    console.log(`📊 Stories received: ${Object.keys(data.stories || {}).length}`);
    console.log(`👥 Characters: ${data.characters?.length || 0}`);
    console.log(`🕐 Response time: ${data.responseTime}\n`);
  } catch (error) {
    console.log(`❌ Failed: ${Date.now() - start1}ms - ${error.message}\n`);
  }

  // Test 2: Single character story
  console.log('📋 Test 2: Single Character Story');
  const start2 = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/api/stories/route-pregenerated?character=armstrong`);
    const data = await response.json();
    const duration2 = Date.now() - start2;
    
    console.log(`✅ Success: ${duration2}ms`);
    console.log(`📖 Story length: ${data.story?.length || 0} characters`);
    console.log(`🕐 Response time: ${data.responseTime}\n`);
  } catch (error) {
    console.log(`❌ Failed: ${Date.now() - start2}ms - ${error.message}\n`);
  }

  // Test 3: System stats
  console.log('📋 Test 3: System Statistics');
  const start3 = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/api/stories/route-pregenerated?action=stats`);
    const data = await response.json();
    const duration3 = Date.now() - start3;
    
    console.log(`✅ Success: ${duration3}ms`);
    console.log(`📊 Stats:`, {
      totalStories: data.stats?.totalStories,
      availableStories: data.stats?.availableStories,
      usedStories: data.stats?.usedStories,
      isGenerating: data.stats?.isGenerating
    });
    console.log('\n');
  } catch (error) {
    console.log(`❌ Failed: ${Date.now() - start3}ms - ${error.message}\n`);
  }

  // Test 4: Multiple rapid requests (stress test)
  console.log('📋 Test 4: Stress Test (10 rapid requests)');
  const promises = [];
  const startStress = Date.now();
  
  for (let i = 0; i < 10; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/stories/route-pregenerated?character=gagarin`)
        .then(r => r.json())
        .catch(e => ({ error: e.message }))
    );
  }
  
  try {
    const results = await Promise.all(promises);
    const durationStress = Date.now() - startStress;
    const successful = results.filter(r => r.success).length;
    
    console.log(`✅ Completed: ${durationStress}ms`);
    console.log(`📊 Successful requests: ${successful}/10`);
    console.log(`⚡ Average per request: ${Math.round(durationStress / 10)}ms\n`);
  } catch (error) {
    console.log(`❌ Stress test failed: ${error.message}\n`);
  }

  console.log('🎉 Performance testing complete!');
  console.log('💡 The pre-generated story system should show massive improvements over the previous version.');
}

// Run the test
testPerformance().catch(console.error);
