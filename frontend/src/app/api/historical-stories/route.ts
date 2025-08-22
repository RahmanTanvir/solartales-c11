import { NextRequest, NextResponse } from 'next/server';
import { aiStoryGenerator } from '@/lib/aiStoryGenerator';
import { historicalEvents, getEventById } from '@/lib/timeTravelEvents';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, character, ageGroup = '11-13' } = body;

    // Validate inputs
    if (!eventId || !character) {
      return NextResponse.json(
        { error: 'Event ID and character are required' },
        { status: 400 }
      );
    }

    // Get the historical event
    const historicalEvent = getEventById(eventId);
    if (!historicalEvent) {
      return NextResponse.json(
        { error: 'Historical event not found' },
        { status: 404 }
      );
    }

    // Configure story generation
    const storyConfig = {
      character: character as any,
      ageGroup: ageGroup as any,
      length: 'medium' as const,
      educationalLevel: 'intermediate' as const,
      includeScientificFacts: true
    };

    // Generate the historical story
    const story = await aiStoryGenerator.generateHistoricalStory(
      {
        name: historicalEvent.name,
        date: historicalEvent.date,
        era: historicalEvent.era,
        description: historicalEvent.description,
        impacts: historicalEvent.impacts,
        historicalContext: historicalEvent.historicalContext,
        severity: historicalEvent.severity
      },
      storyConfig
    );

    // Return the generated story
    return NextResponse.json({
      success: true,
      story: {
        id: `${eventId}-${character}-${Date.now()}`,
        title: story.title,
        content: story.story,
        character,
        eventId,
        eventName: historicalEvent.name,
        era: historicalEvent.era,
        educationalFacts: story.educationalFacts,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating historical story:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate historical story',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'events') {
      // Return available historical events
      return NextResponse.json({
        success: true,
        events: historicalEvents.map(event => ({
          id: event.id,
          name: event.name,
          date: event.date.toISOString(),
          era: event.era,
          description: event.description,
          severity: event.severity,
          characters: event.characters
        }))
      });
    }

    if (action === 'event') {
      const eventId = searchParams.get('id');
      if (!eventId) {
        return NextResponse.json(
          { error: 'Event ID is required' },
          { status: 400 }
        );
      }

      const event = getEventById(eventId);
      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        event: {
          id: event.id,
          name: event.name,
          date: event.date.toISOString(),
          era: event.era,
          description: event.description,
          longDescription: event.longDescription,
          impacts: event.impacts,
          historicalContext: event.historicalContext,
          characters: event.characters,
          severity: event.severity,
          significance: event.significance,
          theme: event.theme
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in historical stories API:', error);
    
    return NextResponse.json(
      { 
        error: 'API request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
