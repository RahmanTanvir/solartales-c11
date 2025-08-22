// Simple test for OpenRouter API integration
const OpenAI = require('openai').default;
const { config } = require('dotenv');

config({ path: '.env.local' });

async function testOpenRouterAPI() {
  console.log('🤖 Testing OpenRouter API Integration...');

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
      console.log('\n📖 Generated Story Sample:');
      console.log(story);
      console.log('\n🎯 API Integration successful!');
      return true;
    } else {
      console.log('❌ No response from API');
      return false;
    }

  } catch (error) {
    console.error('❌ OpenRouter API Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 Tip: Check your API key is correct and has access to free models');
    } else if (error.message.includes('quota')) {
      console.log('\n💡 Tip: You may have exceeded your free quota. Try again later or upgrade.');
    }
    
    return false;
  }
}

// Run the test
testOpenRouterAPI().then(success => {
  console.log('\n📊 Test Result:', success ? '✅ Success' : '❌ Failed');
  process.exit(success ? 0 : 1);
});
