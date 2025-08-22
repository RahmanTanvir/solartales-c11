// Optimized API Route for Fast Story Loading
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// In-memory cache for super fast responses
const storyCache = new Map<string, any[]>();
const cacheTimestamps = new Map<string, number>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Placeholder stories for instant loading
const getPlaceholderStories = (character: string) => [
  {
    id: `${character}-placeholder-1`,
    title: 'The Great Solar Storm',
    content: 'A magnificent solar storm creates breathtaking auroras while challenging our technology...',
    character: character,
    generated_at: new Date().toISOString(),
    story_type: 'placeholder',
    space_weather_context: 'Solar flare activity with geomagnetic effects'
  },
  {
    id: `${character}-placeholder-2`,
    title: 'Dancing Lights in the Sky',
    content: 'Witness the aurora borealis through the eyes of our legendary space pioneer...',
    character: character,
    generated_at: new Date().toISOString(),
    story_type: 'placeholder',
    space_weather_context: 'Geomagnetic storm creating aurora displays'
  },
  {
    id: `${character}-placeholder-3`,
    title: 'Solar Wind Symphony',
    content: 'The solar wind carries particles across the solar system in a cosmic dance...',
    character: character,
    generated_at: new Date().toISOString(),
    story_type: 'placeholder',
    space_weather_context: 'Enhanced solar wind activity'
  }
];

function isCacheValid(key: string): boolean {
  const timestamp = cacheTimestamps.get(key);
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_TTL;
}

function getCachedStories(key: string): any[] | null {
  if (isCacheValid(key)) {
    return storyCache.get(key) || null;
  }
  return null;
}

function setCachedStories(key: string, stories: any[]): void {
  storyCache.set(key, stories);
  cacheTimestamps.set(key, Date.now());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const character = searchParams.get('character') || 'neil_armstrong';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const cacheKey = `${character}-${limit}`;
    
    // Try cache first for instant response
    const cachedStories = getCachedStories(cacheKey);
    if (cachedStories && cachedStories.length > 0) {
      console.log(`📦 Returning cached stories for ${character}`);
      return NextResponse.json({
        success: true,
        stories: cachedStories.slice(0, limit),
        source: 'cache'
      });
    }

    // For super fast response, return placeholder stories immediately
    // and fetch real data in background
    const placeholderStories = getPlaceholderStories(character);
    
    // Start background fetch (don't await)
    fetchRealStoriesInBackground(character, limit, cacheKey);
    
    console.log(`⚡ Returning instant placeholder stories for ${character}`);
    return NextResponse.json({
      success: true,
      stories: placeholderStories.slice(0, limit),
      source: 'placeholder',
      message: 'Loading real stories in background...'
    });

  } catch (error) {
    console.error('Stories API Error:', error);
    
    // Even on error, return placeholder stories for fast response
    const character = 'neil_armstrong';
    return NextResponse.json({
      success: true,
      stories: getPlaceholderStories(character),
      source: 'fallback',
      message: 'Using fallback stories'
    });
  }
}

// Background function to fetch real stories without blocking response
async function fetchRealStoriesInBackground(character: string, limit: number, cacheKey: string) {
  try {
    console.log(`🔄 Fetching real stories for ${character} in background...`);
    
    const { data: stories, error } = await supabase
      .from('generated_stories')
      .select('*')
      .eq('character', character)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (!error && stories && stories.length > 0) {
      console.log(`✅ Cached ${stories.length} real stories for ${character}`);
      setCachedStories(cacheKey, stories);
    } else {
      console.log(`⚠️ No real stories found for ${character}, using placeholder cache`);
      setCachedStories(cacheKey, getPlaceholderStories(character));
    }
  } catch (error) {
    console.error(`❌ Background fetch failed for ${character}:`, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { character = 'neil_armstrong' } = body;

    // Immediate response - don't wait for story generation
    console.log(`🚀 Starting story generation for ${character} in background...`);
    
    // Start generation in background (don't await)
    generateStoryInBackground(character);
    
    return NextResponse.json({
      success: true,
      message: `Story generation started for ${character}. Check back in a few moments.`,
      character,
      estimated_time: '30-60 seconds'
    });

  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to start story generation'
    }, { status: 500 });
  }
}

// Background story generation
async function generateStoryInBackground(character: string) {
  try {
    console.log(`🎯 Generating story for ${character}...`);
    
    // Import heavy dependencies only when needed
    const { spaceWeatherAPI } = await import('@/lib/spaceWeatherAPI');
    
    // Get space weather data
    const spaceWeatherData = await spaceWeatherAPI.getCompleteSpaceWeatherData();
    
    // Create story context
    const context = `Current space weather conditions for story generation:
Solar Wind: ${spaceWeatherData.solarWind.speed} km/s
Geomagnetic Activity: ${spaceWeatherData.geomagneticActivity.activity}
Aurora Visibility: ${spaceWeatherData.auroralActivity.visibility}

Generate a compelling 300-word story from the perspective of ${character} experiencing these space weather conditions.`;

    // Try to generate with AI (if available)
    let story;
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      });

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are writing educational space weather stories from the perspective of ${character}. Keep it engaging and scientifically accurate.`
          },
          {
            role: 'user',
            content: context
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      story = {
        title: `${character}'s Space Weather Chronicle`,
        content: completion.choices[0]?.message?.content || 'An amazing space weather adventure unfolds...',
      };
    } catch (aiError) {
      console.warn('AI generation failed, using fallback story');
      story = {
        title: `${character}'s Space Weather Adventure`,
        content: `${character} observes the current space weather conditions with wonder. The solar wind streams at ${spaceWeatherData.solarWind.speed} km/s, creating a magnificent display of cosmic forces. As the geomagnetic activity reaches ${spaceWeatherData.geomagneticActivity.activity} levels, the aurora dances across the sky in a breathtaking spectacle that reminds us of the incredible connection between our planet and the Sun.`
      };
    }

    // Store the generated story
    const { error } = await supabase
      .from('generated_stories')
      .insert({
        title: story.title,
        content: story.content,
        character: character,
        space_weather_context: JSON.stringify(spaceWeatherData),
        generated_at: new Date().toISOString(),
        story_type: 'background_generated'
      });

    if (error) {
      console.error('Failed to store generated story:', error);
    } else {
      console.log(`✅ Story generated and stored for ${character}: "${story.title}"`);
      
      // Clear cache so next request gets fresh data
      const cacheKey = `${character}-20`;
      storyCache.delete(cacheKey);
      cacheTimestamps.delete(cacheKey);
    }

  } catch (error) {
    console.error(`❌ Story generation failed for ${character}:`, error);
  }
}
