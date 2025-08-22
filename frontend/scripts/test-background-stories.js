// Test script for background story generation
const { backgroundStoryService } = require('../src/lib/backgroundStoryService');

async function testBackgroundStoryGeneration() {
  console.log('🧪 Testing Background Story Generation System');
  console.log('=' .repeat(50));
  
  try {
    // Get initial status
    console.log('1. Getting initial status...');
    const initialStatus = backgroundStoryService.getStatus();
    console.log('Initial Status:', initialStatus);
    
    // Get configuration
    console.log('\n2. Getting configuration...');
    const config = backgroundStoryService.getConfig();
    console.log('Configuration:', config);
    
    // Test today's stories count
    console.log('\n3. Checking today\'s stories count...');
    const todayCount = await backgroundStoryService.getTodayStoriesCount();
    console.log('Stories generated today:', todayCount);
    
    // Start background generation
    console.log('\n4. Starting background generation...');
    backgroundStoryService.startBackgroundGeneration();
    
    // Wait a moment and check status
    setTimeout(() => {
      const runningStatus = backgroundStoryService.getStatus();
      console.log('\n5. Status after starting:', runningStatus);
      
      if (runningStatus.isRunning) {
        console.log('✅ Background story generation is running!');
      } else {
        console.log('❌ Background story generation failed to start');
      }
      
      // Test manual trigger (if API key is available)
      console.log('\n6. Testing manual story generation...');
      backgroundStoryService.triggerGeneration()
        .then(() => {
          console.log('✅ Manual generation triggered successfully');
        })
        .catch((error) => {
          console.log('⚠️ Manual generation failed (likely due to missing API key):', error.message);
        });
      
    }, 2000);
    
    // Set up event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('backgroundStoryGenerated', (event) => {
        console.log('\n🎉 New background story generated!');
        console.log('Title:', event.detail.story.title);
        console.log('Context:', event.detail.context);
      });
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Test configuration updates
function testConfigurationUpdates() {
  console.log('\n🔧 Testing Configuration Updates');
  console.log('=' .repeat(50));
  
  try {
    const originalConfig = backgroundStoryService.getConfig();
    console.log('Original config:', originalConfig);
    
    // Update configuration
    const newConfig = {
      maxStoriesPerDay: 5,
      generationInterval: 15 * 60 * 1000, // 15 minutes
      minStoryGap: 5 * 60 * 1000 // 5 minutes
    };
    
    backgroundStoryService.updateConfiguration(newConfig);
    
    const updatedConfig = backgroundStoryService.getConfig();
    console.log('Updated config:', updatedConfig);
    
    if (updatedConfig.maxStoriesPerDay === 5) {
      console.log('✅ Configuration update successful');
    } else {
      console.log('❌ Configuration update failed');
    }
    
    // Restore original config
    backgroundStoryService.updateConfiguration(originalConfig);
    console.log('✅ Configuration restored');
    
  } catch (error) {
    console.error('Error testing configuration:', error);
  }
}

// Run tests
if (typeof window !== 'undefined') {
  // Browser environment
  window.testBackgroundStories = testBackgroundStoryGeneration;
  window.testStoryConfig = testConfigurationUpdates;
  
  console.log('🌐 Background story tests available in browser console:');
  console.log('- Run testBackgroundStories() to test background generation');
  console.log('- Run testStoryConfig() to test configuration updates');
} else {
  // Node.js environment
  testBackgroundStoryGeneration();
  setTimeout(testConfigurationUpdates, 5000);
}

module.exports = {
  testBackgroundStoryGeneration,
  testConfigurationUpdates
};
