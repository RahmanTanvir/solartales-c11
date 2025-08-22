// Simple API test for NASA endpoints
const NASA_API_KEY = 'DEMO_KEY';

async function quickTest() {
  // Simple test for OpenRouter API integration
import OpenAI from 'openai';
import { config } from 'dotenv';

config();

async function testOpenRouterAPI() {
  console.log('🤖 Testing OpenRouter API Integration...
');

  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    console.log('⚠️  OpenRouter API key not set. Please set OPENROUTER_API_KEY in .env.local');
    console.log('   Get your free API key from: https://openrouter.ai/');
    console.log('   Free models available: gpt-4o-mini, gpt-3.5-turbo');
    return false;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    console.log('Testing basic story generation...');
    
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative storyteller for children. Create engaging space weather stories that are educational and fun.'
        },
        {
          role: 'user',
          content: 'Write a short 150-word story about an astronaut experiencing a solar flare while on the International Space Station. Make it appropriate for 8-10 year olds.'
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const story = completion.choices[0]?.message?.content;
    
    if (story) {
      console.log('✅ OpenRouter API Working!');
      console.log('
📖 Generated Story Sample:');
      console.log(story);
      console.log('
🎯 API Integration successful!');
      return true;
    } else {
      console.log('❌ No response from API');
      return false;
    }

  } catch (error) {
    console.error('❌ OpenRouter API Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('
💡 Tip: Check your API key is correct and has access to free models');
    } else if (error.message.includes('quota')) {
      console.log('
💡 Tip: You may have exceeded your free quota. Try again later or upgrade.');
    }
    
    return false;
  }
}

// Run the test
testOpenRouterAPI().then(success => {
  console.log('
📊 Test Result:', success ? '✅ Success' : '❌ Failed');
  process.exit(success ? 0 : 1);
});
  
  try {
    // Test DONKI API
    const response = await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=2025-01-01&endDate=2025-08-20&api_key=${NASA_API_KEY}`);
    const data = await response.json();
    console.log('✅ NASA DONKI API working! Found', data.length, 'solar flare events');
    
    // Test NOAA API
    const noaaResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    const noaaData = await noaaResponse.json();
    console.log('✅ NOAA Space Weather API working! Got', noaaData.length, 'K-index readings');
    
    // Test APOD
    const apodResponse = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
    const apodData = await apodResponse.json();
    console.log('✅ NASA APOD API working! Today:', apodData.title);
    
    console.log('\n🎉 All APIs are working correctly!\n');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

quickTest();
