// Test current story generation API
const testStoryGeneration = async () => {
  console.log('🧪 Testing Story Generation API');
  console.log('=' .repeat(50));
  
  try {
    console.log('1. Testing story generation for astronaut...');
    
    const response = await fetch('http://localhost:3004/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: 'astronaut',
        ageGroup: '11-13',
        eventType: 'solar_flare',
        intensity: 'moderate',
        description: 'A moderate solar flare erupts from the Sun',
        impacts: ['Radio blackouts', 'GPS disruptions']
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      console.log('✅ Story generation successful!');
      console.log('Generated story title:', data.story.title);
    } else {
      console.log('❌ Story generation failed:', data.error);
    }
    
    console.log('\n2. Testing story retrieval for astronaut...');
    
    const retrieveResponse = await fetch('http://localhost:3004/api/stories?character=astronaut&limit=5');
    const retrieveData = await retrieveResponse.json();
    
    console.log('Retrieved stories count:', retrieveData.stories?.length || 0);
    if (retrieveData.stories?.length > 0) {
      console.log('✅ Stories retrieved successfully!');
      retrieveData.stories.forEach((story, i) => {
        console.log(`Story ${i + 1}: ${story.title}`);
      });
    } else {
      console.log('❌ No stories found');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testStoryGeneration();
