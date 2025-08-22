// Test script for the new story functionality
const { default: fetch } = require('node-fetch');

const API_BASE = 'http://localhost:3003';

async function testStoryFeatures() {
  console.log('🧪 Testing Story Features...\n');

  try {
    // Test 1: Single story generation
    console.log('📝 Test 1: Generating a single story...');
    const singleResponse = await fetch(`${API_BASE}/api/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: 'astronaut',
        ageGroup: '11-13',
        eventType: 'solar_flare',
        intensity: 'moderate',
        description: 'Test story generation',
        impacts: ['Test impact']
      })
    });
    
    const singleData = await singleResponse.json();
    console.log(singleData.success ? '✅ Single story generation: PASS' : '❌ Single story generation: FAIL');
    if (singleData.success) {
      console.log(`   📖 Title: ${singleData.story.title}`);
      console.log(`   📊 Length: ${singleData.story.story.length} characters`);
      console.log(`   🎯 Facts: ${singleData.story.educationalFacts.length} educational facts`);
    }

    console.log('\n⏳ Waiting 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 2: Retrieve stories by character
    console.log('📚 Test 2: Retrieving stories by character...');
    const getResponse = await fetch(`${API_BASE}/api/stories?character=astronaut&limit=5`);
    const getData = await getResponse.json();
    console.log(getData.success ? '✅ Story retrieval: PASS' : '❌ Story retrieval: FAIL');
    if (getData.success) {
      console.log(`   📊 Retrieved ${getData.stories.length} stories`);
      getData.stories.forEach((story, index) => {
        console.log(`   ${index + 1}. ${story.title} (${story.ageGroup}, ${story.spaceWeatherEvent.type})`);
      });
    }

    // Test 3: Check for story uniqueness
    console.log('\n🔍 Test 3: Checking story uniqueness...');
    if (getData.success && getData.stories.length > 1) {
      const titles = getData.stories.map(s => s.title);
      const uniqueTitles = [...new Set(titles)];
      const isUnique = titles.length === uniqueTitles.length;
      console.log(isUnique ? '✅ Story uniqueness: PASS' : '❌ Story uniqueness: FAIL');
      console.log(`   📊 ${titles.length} stories, ${uniqueTitles.length} unique titles`);
    }

    // Test 4: Check story content variety
    console.log('\n📖 Test 4: Checking story content variety...');
    if (getData.success && getData.stories.length > 1) {
      const storyLengths = getData.stories.map(s => s.story.length);
      const avgLength = storyLengths.reduce((a, b) => a + b, 0) / storyLengths.length;
      const lengthVariation = Math.max(...storyLengths) - Math.min(...storyLengths);
      
      console.log(`   📊 Average length: ${Math.round(avgLength)} characters`);
      console.log(`   📈 Length variation: ${lengthVariation} characters`);
      console.log(lengthVariation > 100 ? '✅ Content variety: PASS' : '⚠️ Content variety: LIMITED');
    }

    // Test 5: Test all characters have stories
    console.log('\n👥 Test 5: Checking all characters have stories...');
    const characters = ['astronaut', 'pilot', 'farmer', 'aurora_hunter', 'power_grid_operator', 'radio_operator'];
    let characterCounts = {};
    
    for (const character of characters) {
      const response = await fetch(`${API_BASE}/api/stories?character=${character}&limit=10`);
      const data = await response.json();
      characterCounts[character] = data.success ? data.stories.length : 0;
    }
    
    const totalStories = Object.values(characterCounts).reduce((a, b) => a + b, 0);
    console.log(`📊 Total stories across all characters: ${totalStories}`);
    
    Object.entries(characterCounts).forEach(([character, count]) => {
      const status = count >= 3 ? '✅' : count >= 1 ? '⚠️' : '❌';
      console.log(`   ${status} ${character}: ${count} stories`);
    });

    console.log('\n🎉 Story testing complete!');
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`• Total stories in database: ${totalStories}`);
    console.log(`• Characters with stories: ${Object.values(characterCounts).filter(c => c > 0).length}/${characters.length}`);
    console.log(`• Ready for production: ${totalStories >= 15 ? 'YES ✅' : 'NO ❌ (need more stories)'}`);

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run if called directly
if (require.main === module) {
  testStoryFeatures();
}

module.exports = { testStoryFeatures };
