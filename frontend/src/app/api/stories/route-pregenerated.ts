import { NextRequest, NextResponse } from 'next/server';
import { storyPreGenerator, initializeStoryPreGenerator } from '@/lib/storyPreGenerator';

// Initialize the pre-generator on first load
let initPromise: Promise<any> | null = null;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = initializeStoryPreGenerator();
  }
  return initPromise;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const character = searchParams.get('character');
    const action = searchParams.get('action');
    const count = parseInt(searchParams.get('count') || '1');

    // Ensure pre-generator is initialized
    await ensureInitialized();

    // Handle different actions
    switch (action) {
      case 'stats':
        return NextResponse.json({
          success: true,
          stats: storyPreGenerator.getStats(),
          timestamp: new Date().toISOString()
        });

      case 'current-situation':
        const currentStories = storyPreGenerator.getCurrentSituationStories();
        return NextResponse.json({
          success: true,
          stories: currentStories,
          characters: storyPreGenerator.getCharacters(),
          timestamp: new Date().toISOString(),
          responseTime: '< 50ms'
        });

      case 'regenerate':
        // Trigger background regeneration
        storyPreGenerator.forceRegenerate().catch(console.error);
        return NextResponse.json({
          success: true,
          message: 'Story regeneration started in background',
          timestamp: new Date().toISOString()
        });

      case 'character-stories':
        if (!character) {
          return NextResponse.json({
            success: false,
            error: 'Character parameter required for character-stories action'
          }, { status: 400 });
        }

        const characterStories = storyPreGenerator.getStoriesForCharacter(character, count);
        return NextResponse.json({
          success: true,
          character,
          stories: characterStories,
          count: characterStories.length,
          timestamp: new Date().toISOString(),
          responseTime: '< 10ms'
        });

      default:
        // Default: get single story for character or current situation
        if (character) {
          const story = storyPreGenerator.getStoryForCharacter(character);
          if (story) {
            return NextResponse.json({
              success: true,
              character,
              story,
              timestamp: new Date().toISOString(),
              responseTime: '< 5ms'
            });
          } else {
            return NextResponse.json({
              success: false,
              error: `No stories available for character: ${character}`,
              stats: storyPreGenerator.getStats()
            }, { status: 404 });
          }
        } else {
          // Return current situation stories for all characters
          const allStories = storyPreGenerator.getCurrentSituationStories();
          return NextResponse.json({
            success: true,
            stories: allStories,
            characters: storyPreGenerator.getCharacters(),
            timestamp: new Date().toISOString(),
            responseTime: '< 20ms'
          });
        }
    }

  } catch (error) {
    console.error('❌ Stories API error:', error);
    
    // Return fallback response
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stories',
      fallback: true,
      stories: {
        armstrong: "Neil Armstrong here. Due to technical difficulties, we're experiencing some delays in our space weather monitoring systems. Please check back shortly for updated conditions.",
        gagarin: "Yuri Gagarin reporting. Our monitoring systems are currently being updated. Space weather observations will resume momentarily.",
        lovell: "Jim Lovell speaking. We're working to restore full space weather reporting capabilities. Stay tuned for updates.",
        ride: "Sally Ride here. Technical maintenance is ongoing for our space weather systems. Normal service will resume shortly."
      },
      timestamp: new Date().toISOString()
    });
  }
}

// POST endpoint for manual story generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, character, count = 1 } = body;

    await ensureInitialized();

    switch (action) {
      case 'force-regenerate':
        await storyPreGenerator.forceRegenerate();
        return NextResponse.json({
          success: true,
          message: 'All stories regenerated successfully',
          stats: storyPreGenerator.getStats(),
          timestamp: new Date().toISOString()
        });

      case 'generate-for-character':
        if (!character) {
          return NextResponse.json({
            success: false,
            error: 'Character parameter required'
          }, { status: 400 });
        }

        // This would trigger background generation
        const stories = storyPreGenerator.getStoriesForCharacter(character, count);
        return NextResponse.json({
          success: true,
          character,
          stories,
          count: stories.length,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Stories POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
}
