// Script to populate the database with initial stories
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3003';

async function populateStories() {
  console.log('🚀 Starting story population...');

  try {
    // Step 1: Generate initial stories for each character
    const characters = ['astronaut', 'pilot', 'farmer', 'aurora_hunter', 'power_grid_operator', 'radio_operator'];
    
    console.log('📝 Generating initial stories for each character...');
    
    for (const character of characters) {
      console.log(`\n🎭 Generating stories for ${character}...`);
      
      // Generate 3 stories per character with different variations
      for (let i = 0; i < 3; i++) {
        try {
          const eventTypes = ['solar_flare', 'geomagnetic_storm', 'solar_wind', 'coronal_mass_ejection'];
          const intensities = ['minor', 'moderate', 'strong', 'severe'];
          const ageGroups = ['8-10', '11-13', '14-17'];
          
          const response = await fetch(`${API_BASE}/api/stories`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              character: character,
              ageGroup: ageGroups[i % ageGroups.length],
              eventType: eventTypes[i % eventTypes.length],
              intensity: intensities[i % intensities.length],
              description: `Story ${i + 1} for ${character}`,
              impacts: [`Story variation ${i + 1}`, 'Educational content']
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log(`  ✅ Generated: ${data.story.title}`);
          } else {
            console.log(`  ❌ Failed: ${data.error}`);
          }
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.log(`  ❌ Error generating story ${i + 1} for ${character}:`, error.message);
        }
      }
    }

    // Step 2: Use bulk generation for additional variety
    console.log('\n🎨 Generating additional stories in bulk...');
    
    const bulkResponse = await fetch(`${API_BASE}/api/stories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characters: ['astronaut', 'pilot'],
        count: 2
      })
    });
    
    const bulkData = await bulkResponse.json();
    
    if (bulkData.success) {
      console.log(`✅ Bulk generation complete: ${bulkData.message}`);
    } else {
      console.log(`❌ Bulk generation failed: ${bulkData.error}`);
    }

    // Step 3: Check final count
    console.log('\n📊 Checking story counts...');
    
    for (const character of characters) {
      try {
        const response = await fetch(`${API_BASE}/api/stories?character=${character}&limit=20`);
        const data = await response.json();
        
        if (data.success) {
          console.log(`  📚 ${character}: ${data.stories.length} stories`);
        }
      } catch (error) {
        console.log(`  ❌ Error checking ${character}:`, error.message);
      }
    }

    console.log('\n🎉 Story population complete!');
    console.log('You can now visit the Stories page to see the pre-generated content.');

  } catch (error) {
    console.error('❌ Error in story population:', error);
  }
}

// Run if called directly
if (require.main === module) {
  populateStories();
}

module.exports = { populateStories };
