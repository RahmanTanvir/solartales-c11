// Test OpenRouter AI integration
import { config } from 'dotenv';

config();

// Test story generation
async function testStoryGeneration() {
  console.log('🤖 Testing OpenRouter AI Story Generation...\n');

  // Mock space weather event
  const testEvent = {
    type: 'solar_flare',
    intensity: 'moderate',
    timestamp: new Date('2025-08-20'),
    description: 'A moderate solar flare erupted from the Sun, sending electromagnetic radiation towards Earth.',
    impacts: ['Radio blackouts on sunlit side of Earth', 'GPS navigation disruptions', 'Possible aurora at high latitudes']
  };

  // Test configuration
  const testConfig = {
    character: 'astronaut',
    ageGroup: '8-10',
    length: 'short',
    educationalLevel: 'beginner',
    includeScientificFacts: true
  };

  try {
    // Import here to avoid module loading issues
    const { aiStoryGenerator } = await import('../src/lib/aiStoryGenerator.js');
    
    console.log('Generating story for astronaut character...');
    const result = await aiStoryGenerator.generateStory(testEvent, testConfig);
    
    console.log('\n✅ Story Generation Successful!');
    console.log('\n📖 Generated Story:');
    console.log('Title:', result.title);
    console.log('Story:', result.story.substring(0, 200) + '...');
    console.log('Educational Facts:', result.educationalFacts);
    
    return true;
  } catch (error) {
    console.error('❌ Story Generation Failed:', error.message);
    return false;
  }
}

// Test multiple character perspectives
async function testMultipleCharacters() {
  console.log('\n🎭 Testing Multiple Character Perspectives...\n');

  const testEvent = {
    type: 'geomagnetic_storm' as const,
    intensity: 'strong' as const,
    timestamp: new Date('2025-08-20'),
    description: 'A strong geomagnetic storm is affecting Earth\'s magnetosphere.',
    impacts: ['Enhanced aurora activity', 'Satellite operations affected', 'Power grid fluctuations']
  };

  const characters = ['astronaut', 'aurora_hunter', 'power_grid_operator'] as const;
  const baseConfig = {
    ageGroup: '11-13' as const,
    length: 'short' as const,
    educationalLevel: 'intermediate' as const,
    includeScientificFacts: true
  };

  try {
    console.log('Generating stories for multiple characters...');
    const stories = await aiStoryGenerator.generateMultiplePerscpectives(
      testEvent, 
      characters, 
      baseConfig
    );
    
    console.log('\n✅ Multiple Character Stories Generated!');
    stories.forEach((story, index) => {
      console.log(`\n${index + 1}. ${story.character.toUpperCase()}:`);
      console.log('Title:', story.title);
      console.log('Preview:', story.story.substring(0, 150) + '...');
    });
    
    return true;
  } catch (error) {
    console.error('❌ Multiple Character Generation Failed:', error.message);
    return false;
  }
}

// Test historical event story
async function testHistoricalStory() {
  console.log('\n📜 Testing Historical Event Story...\n');

  const carringtonEvent = {
    name: 'The Carrington Event',
    date: new Date('1859-09-01'),
    description: 'The most powerful geomagnetic storm in recorded history',
    impacts: ['Telegraph systems worldwide failed', 'Aurora seen as far south as the Caribbean', 'Telegraph wires sparked and caught fire'],
    historicalContext: 'During the Victorian era when telegraph was the main form of long-distance communication'
  };

  const testConfig = {
    character: 'radio_operator' as const,
    ageGroup: '11-13' as const,
    length: 'medium' as const,
    educationalLevel: 'intermediate' as const,
    includeScientificFacts: true
  };

  try {
    console.log('Generating historical Carrington Event story...');
    const result = await aiStoryGenerator.generateHistoricalStory(carringtonEvent, testConfig);
    
    console.log('\n✅ Historical Story Generated!');
    console.log('Title:', result.title);
    console.log('Preview:', result.story.substring(0, 200) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Historical Story Generation Failed:', error.message);
    return false;
  }
}

// Run all AI tests
async function runAITests() {
  console.log('🚀 Starting OpenRouter AI Integration Tests...\n');
  
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    console.log('⚠️  OpenRouter API key not set. Please set OPENROUTER_API_KEY in .env.local');
    console.log('   Get your free API key from: https://openrouter.ai/');
    return false;
  }
  
  const results = {
    basicStory: await testStoryGeneration(),
    multipleCharacters: await testMultipleCharacters(),
    historicalStory: await testHistoricalStory()
  };
  
  console.log('\n📊 AI Test Results Summary:');
  console.log('Basic Story Generation:', results.basicStory ? '✅ Working' : '❌ Failed');
  console.log('Multiple Characters:', results.multipleCharacters ? '✅ Working' : '❌ Failed');
  console.log('Historical Stories:', results.historicalStory ? '✅ Working' : '❌ Failed');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('\nOverall AI Integration:', allPassed ? '✅ All Tests Passed' : '❌ Some Tests Failed');
  
  return allPassed;
}

// Export for use in other modules
export { runAITests, testStoryGeneration, testMultipleCharacters, testHistoricalStory };

// Run tests if this file is executed directly
if (require.main === module) {
  runAITests();
}
