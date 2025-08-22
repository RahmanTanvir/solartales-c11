// Test script for the AI Stories API
async function testAPIEndpoint() {
  console.log('🧪 Testing AI Stories API endpoint...\n');

  try {
    // Test 1: Generate a story via API
    console.log('Test 1: Generating story via API...');
    const generateResponse = await fetch('http://localhost:3002/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: 'astronaut',
        ageGroup: '11-13',
        eventType: 'solar_flare',
        intensity: 'moderate',
        description: 'Test solar flare event',
        impacts: ['Radio communication disruptions', 'Satellite navigation affected']
      })
    });
    
    if (generateResponse.ok) {
      const generateData = await generateResponse.json();
      if (generateData.success) {
        console.log('✅ Story generation successful!');
        console.log(`   Title: ${generateData.story.title}`);
        console.log(`   Character: ${generateData.story.character}`);
        console.log(`   Age Group: ${generateData.story.ageGroup}`);
        console.log(`   Educational Facts: ${generateData.story.educationalFacts.length}`);
        console.log('');
      } else {
        console.log('❌ Story generation failed:', generateData.error);
      }
    } else {
      console.log('❌ API request failed:', generateResponse.status);
    }

    // Test 2: Fetch stories via API
    console.log('Test 2: Fetching stories via API...');
    const fetchResponse = await fetch('http://localhost:3002/api/stories?limit=5');
    
    if (fetchResponse.ok) {
      const fetchData = await fetchResponse.json();
      if (fetchData.success) {
        console.log(`✅ Found ${fetchData.stories.length} stories`);
        fetchData.stories.forEach((story, index) => {
          console.log(`   ${index + 1}. ${story.title} (${story.character})`);
        });
      } else {
        console.log('❌ Failed to fetch stories:', fetchData.error);
      }
    } else {
      console.log('❌ API request failed:', fetchResponse.status);
    }

    console.log('\n🎉 API Testing Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPIEndpoint();
