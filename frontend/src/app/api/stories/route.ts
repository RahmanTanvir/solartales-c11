// API Route for AI Story Generation
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

// Types for the request
interface StoryGenerationRequest {
  character: string;
  ageGroup: string;
  storySize?: 'short' | 'medium' | 'long';
  mood?: string;
  moodParameters?: {
    intensity?: 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
    region?: 'equator' | 'mid-latitudes' | 'polar';
    season?: 'spring' | 'summer' | 'autumn' | 'winter';
    era?: '1850s' | '1950s' | '1990s' | '2025';
    profession?: 'emergency' | 'satellite' | 'airline' | 'maritime' | 'research';
    historicalEvent?: 'carrington' | 'quebec' | 'halloween' | 'bastille';
    flareClass?: 'C' | 'M' | 'X';
    cmeSpeed?: 'slow' | 'medium' | 'fast';
    infrastructure?: 'power' | 'telecom' | 'transport' | 'agriculture';
  };
  eventType?: string;
  intensity?: string;
  description?: string;
  impacts?: string[];
}

// OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
});

const FREE_MODELS = {
  'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
};

// Character prompts
const getCharacterPrompt = (character: string): string => {
  const characterPrompts: Record<string, string> = {
    solar_flare: "You are a Solar Flare - a burst of electromagnetic energy from the Sun's surface. Tell your story as you journey from the Sun to Earth, describing what you see and feel along the way.",
    astronaut: "You are Sumaiya Subha, an astronaut aboard the International Space Station. You're a mission specialist who has experienced multiple space weather events during your time in orbit. Describe your experience during a space weather event, focusing on how it affects the space station, the safety protocols you must follow, the amazing views of Earth's aurora from space, and how you protect yourself and your crewmates from radiation. Explain space weather in simple terms and share the wonder of seeing these cosmic phenomena from the unique perspective of space.",
    pilot: "You are Captain Tanvir Rahman, an experienced airline pilot with 20 years of flying experience. You're piloting a flight during a space weather event and must explain to your passengers what's happening. Describe how space weather affects your aircraft's navigation systems, radio communications, and GPS equipment. Share how you and your crew adapt your flight plan to ensure passenger safety, the backup procedures you use when technology fails, and how space weather can create both challenges and beautiful sights like aurora during polar flights.",
    aurora_hunter: "You are Saad Wasit, a member of the general public - a photography enthusiast and aurora chaser from northern Canada. You've been tracking space weather forecasts all week hoping to capture the perfect aurora photograph. Share your excitement as you witness the beautiful Northern Lights caused by space weather. Explain in simple terms what creates these magical lights and how space weather affects everyday people like you. Describe the community of aurora watchers and how space weather brings people together to witness nature's most spectacular light show.",
    power_grid_operator: "You are Ibrahim Ilham, a power grid operator working at the regional electrical control center. You're monitoring electrical systems during a geomagnetic storm that threatens to overload transformers and cause blackouts. Describe the challenges you face as space weather creates electrical surges and fluctuations in the power grid. Explain how you and your team work together to implement protective measures, reroute power, and keep the lights on for millions of people. Share how space weather affects the electricity that powers our homes, schools, and hospitals.",
    farmer: "You are Wasif Ahmad, a modern farmer who relies on GPS-guided tractors and precision agriculture technology. During a space weather event, your GPS systems start giving inaccurate readings, affecting your planting and harvesting operations. Tell your story of how space weather impacts farming in the 21st century, from GPS-guided equipment to weather monitoring systems. Explain how you adapt when technology fails and describe the connection between space weather and agriculture. Share how farmers have always watched the sky, but now must also understand invisible forces from space.",
    radio_operator: "You are Arman Khan, a ham radio operator and emergency communications volunteer. You represent both radio enthusiasts and everyday citizens who rely on communications during emergencies. During a solar event, describe how space weather disrupts radio communications, affects cell phone networks, and impacts emergency services. Share your experience maintaining critical communications when other systems fail, and explain how space weather affects the technology that connects our modern world - from radio waves to internet satellites."
  };
  return characterPrompts[character] || characterPrompts['astronaut'];
};

// Age-appropriate prompts
const getAgePrompt = (ageGroup: string): string => {
  const agePrompts: Record<string, string> = {
    '8-10': "Use simple words, short sentences, and exciting descriptions that a 3rd grader can understand. Include fun sound effects and emotions.",
    '11-13': "Use engaging vocabulary appropriate for middle school students. Include some scientific terms but explain them clearly.",
    '14-17': "Use more sophisticated language and detailed scientific explanations appropriate for high school students."
  };
  return agePrompts[ageGroup] || agePrompts['11-13'];
};

// Story size prompts
const getStorySizePrompt = (storySize: string): string => {
  const sizePrompts: Record<string, string> = {
    'short': "Write a concise, focused story of 200-300 words (2-3 minute read). Keep it punchy and impactful, focusing on the most dramatic moment of the space weather event.",
    'medium': "Write a detailed story of 400-600 words (4-6 minute read). Include character development, multiple scenes, and educational elements while maintaining engagement.",
    'long': "Write an immersive, comprehensive story of 700-1000 words (7-10 minute read). Include rich descriptions, multiple perspectives, detailed scientific explanations, and a complete narrative arc with buildup, climax, and resolution."
  };
  return sizePrompts[storySize] || sizePrompts['medium'];
};

// Mood-specific prompts
const getMoodPrompt = (mood: string, parameters: any = {}): string => {
  const moodPrompts: Record<string, string> = {
    real_time: `Create a story based on ACTUAL current space weather conditions. Use real-time data to make the story authentic and immediate. Emphasize that this is happening RIGHT NOW in the real world. Include current solar activity levels, magnetic field readings, and any ongoing space weather events.`,
    
    extreme_storm: `Focus on a ${parameters.intensity || 'G3'} geomagnetic storm scenario. Emphasize the worst-case impacts on ${parameters.infrastructure || 'power grid'} systems. Show how professionals respond to extreme conditions and protect critical infrastructure.`,
    
    regional_focus: `Set the story specifically in the ${parameters.region || 'mid-latitudes'} region. Highlight how space weather effects differ by geographic location. Include local phenomena like aurora visibility, GPS accuracy variations, and regional communication impacts.`,
    
    custom_scenario: `Create a scenario with specific parameters: ${parameters.flareClass || 'M'}-class solar flare, ${parameters.cmeSpeed || 'medium'} speed CME, during ${parameters.season || 'autumn'} season. Show how these exact conditions interact to create unique space weather effects.`,
    
    career_day: `Focus on the ${parameters.profession || 'emergency'} profession's perspective. Show detailed day-in-the-life operations, professional protocols, teamwork, and how space weather training helps protect people and infrastructure.`,
    
    seasonal_storyteller: `Set during ${parameters.season || 'winter'} season. Emphasize seasonal space weather patterns, how atmospheric conditions change with seasons, equinox effects if spring/autumn, and seasonal aurora visibility patterns.`,
    
    technology_timeline: `Set the story in ${parameters.era || '2025'}. Show how the same space weather event would affect the technology of that era. Compare impacts on period-appropriate infrastructure and communication systems.`,
    
    historical_events: `Recreate the famous ${parameters.historicalEvent || 'carrington'} space weather event. Use historical context, real impacts that occurred, and show how people of that era experienced and understood the phenomenon.`
  };
  
  return moodPrompts[mood] || '';
};

// Historical event details
const getHistoricalEventDetails = (event: string): string => {
  const eventDetails: Record<string, string> = {
    carrington: "The 1859 Carrington Event was the most powerful geomagnetic storm in recorded history. Telegraph systems worldwide failed, with some operators receiving electric shocks. Telegraph lines sparked and caught fire. Aurora were visible as far south as the Caribbean.",
    quebec: "The March 1989 geomagnetic storm caused a 9-hour blackout in Quebec, Canada, affecting 6 million people. The storm damaged transformers and caused $2 billion in damages. It showed how vulnerable modern power grids are to space weather.",
    halloween: "The October-November 2003 Halloween Storms were a series of solar flares and CMEs that disrupted satellites, airlines, and power grids worldwide. Multiple X-class flares occurred, creating widespread aurora and technology failures.",
    bastille: "The July 14, 2000 Bastille Day Event was a major solar storm that occurred on France's national holiday. It caused significant satellite anomalies and beautiful aurora displays across northern regions."
  };
  
  return eventDetails[event] || '';
};

export async function POST(request: NextRequest) {
  try {
    const body: StoryGenerationRequest = await request.json();
    const { character, ageGroup, storySize, mood, moodParameters, eventType, intensity, description, impacts } = body;

    // Validate required fields
    if (!character || !ageGroup) {
      return NextResponse.json(
        { error: 'Character and age group are required' },
        { status: 400 }
      );
    }

    // Create space weather event for story generation
    const currentEvent = {
      type: eventType || 'solar_flare',
      intensity: intensity || 'moderate',
      timestamp: new Date(),
      description: description || 'Current space weather conditions',
      impacts: impacts || ['Ongoing space weather activity']
    };

    // Add randomization to ensure unique stories
    const storyVariations = [
      "beginning of the event", "peak intensity", "aftermath and recovery", 
      "preparation phase", "unexpected twist"
    ];
    const timeOfDay = ["dawn", "midday", "twilight", "midnight", "early morning"];
    const weatherConditions = ["clear skies", "stormy weather", "foggy conditions", "windy day", "calm atmosphere"];
    
    const randomVariation = storyVariations[Math.floor(Math.random() * storyVariations.length)];
    const randomTime = timeOfDay[Math.floor(Math.random() * timeOfDay.length)];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const uniqueId = Math.random().toString(36).substring(2, 9);

    // Generate the story using OpenAI
    const moodPrompt = mood ? getMoodPrompt(mood, moodParameters) : '';
    const historicalDetails = moodParameters?.historicalEvent ? getHistoricalEventDetails(moodParameters.historicalEvent) : '';
    const storySizePrompt = getStorySizePrompt(storySize || 'medium');
    
    const systemPrompt = `You are an expert storyteller and science educator creating engaging space weather stories for children. 
    
    ${getCharacterPrompt(character)}
    
    ${moodPrompt ? `Special Story Mode: ${moodPrompt}` : ''}
    
    ${historicalDetails ? `Historical Context: ${historicalDetails}` : ''}
    
    Guidelines:
    - ${getAgePrompt(ageGroup)}
    - ${storySizePrompt}
    - Include 4-5 scientific concepts with clear explanations
    - Make the story exciting and engaging while being scientifically accurate
    - Include sensory details (what you see, hear, feel)
    - Create emotional connection and wonder about space
    - End with a positive message about science and discovery
    - Each story should be completely unique and different from previous ones
    
    Return your response as a JSON object with:
    {
      "title": "An exciting title for the story",
      "story": "The complete narrative",
      "educationalFacts": ["fact1", "fact2", "fact3"]
    }`;

    const userPrompt = `Create a UNIQUE story based on this space weather event:
    
    Event Type: ${currentEvent.type}
    Intensity: ${currentEvent.intensity}
    Time: ${currentEvent.timestamp.toISOString()}
    Description: ${currentEvent.description}
    Impacts: ${currentEvent.impacts.join(', ')}
    
    Character Perspective: ${character}
    Target Age: ${ageGroup}
    ${mood ? `Story Mode: ${mood}` : ''}
    ${moodParameters ? `Special Parameters: ${JSON.stringify(moodParameters)}` : ''}
    
    Story Variation: Focus on the ${randomVariation}
    Setting Time: ${randomTime}
    Weather Conditions: ${randomWeather}
    Unique Story ID: ${uniqueId}
    
    Make this story completely different from any previous stories. Use unique scenarios, different challenges, and fresh perspectives.`;

    const completion = await openai.chat.completions.create({
      model: FREE_MODELS['gpt-4o-mini'],
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9, // Increased temperature for more creativity
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI model');
    }

    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      parsedResponse = {
        title: `${character.replace('_', ' ').toUpperCase()}'s Space Weather Adventure`,
        story: response,
        educationalFacts: [
          'Space weather can affect technology on Earth',
          'The Sun is the source of space weather events',
          'Aurora lights are caused by solar particles interacting with Earth\'s atmosphere'
        ]
      };
    }

    // Generate unique ID for the story
    const storyId = `${Date.now()}-${character}-${ageGroup}`;

    // Save story to Supabase
    const storyData = {
      id: storyId,
      title: parsedResponse.title || 'Space Weather Adventure',
      story: parsedResponse.story || response,
      character: character,
      age_group: ageGroup,
      educational_facts: parsedResponse.educationalFacts || [],
      space_weather_event: currentEvent,
      generated_at: new Date().toISOString(),
      is_active: true
    };

    const { error: insertError } = await supabase
      .from('generated_stories')
      .insert(storyData);

    if (insertError) {
      console.error('Error saving story to database:', insertError);
      // Continue anyway, return the story even if saving fails
    }

    return NextResponse.json({
      success: true,
      story: {
        id: storyId,
        title: parsedResponse.title || 'Space Weather Adventure',
        story: parsedResponse.story || response,
        character,
        ageGroup,
        educationalFacts: parsedResponse.educationalFacts || [],
        spaceWeatherEvent: currentEvent,
        generatedAt: new Date(),
        isActive: true
      }
    });

  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate story', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const character = searchParams.get('character');
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('generated_stories')
      .select('*')
      .eq('is_active', true)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (character && character !== 'all') {
      query = query.eq('character', character);
    }

    if (eventType) {
      query = query.eq('space_weather_event->type', eventType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const stories = data?.map(row => ({
      id: row.id,
      title: row.title,
      story: row.story,
      character: row.character,
      ageGroup: row.age_group,
      educationalFacts: row.educational_facts,
      spaceWeatherEvent: row.space_weather_event,
      generatedAt: new Date(row.generated_at),
      isActive: row.is_active
    })) || [];

    return NextResponse.json({
      success: true,
      stories
    });

  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stories', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Bulk story generation endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { characters, count = 5, storySize = 'medium' } = body;

    if (!characters || !Array.isArray(characters)) {
      return NextResponse.json(
        { error: 'Characters array is required' },
        { status: 400 }
      );
    }

    const generatedStories = [];
    const ageGroups = ['8-10', '11-13', '14-17'];
    const eventTypes = ['solar_flare', 'geomagnetic_storm', 'solar_wind', 'coronal_mass_ejection'];
    const intensities = ['minor', 'moderate', 'strong', 'severe'];

    for (const character of characters) {
      for (let i = 0; i < count; i++) {
        try {
          // Randomize parameters for each story
          const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          const intensity = intensities[Math.floor(Math.random() * intensities.length)];
          
          // Add more randomization
          const storyVariations = [
            "beginning of the event", "peak intensity", "aftermath and recovery", 
            "preparation phase", "unexpected twist", "scientific discovery", "heroic response"
          ];
          const timeOfDay = ["dawn", "midday", "twilight", "midnight", "early morning", "sunset"];
          const weatherConditions = ["clear skies", "stormy weather", "foggy conditions", "windy day", "calm atmosphere", "overcast"];
          
          const randomVariation = storyVariations[Math.floor(Math.random() * storyVariations.length)];
          const randomTime = timeOfDay[Math.floor(Math.random() * timeOfDay.length)];
          const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
          const uniqueId = Math.random().toString(36).substring(2, 9);

          // Create space weather event
          const currentEvent = {
            type: eventType,
            intensity: intensity,
            timestamp: new Date(),
            description: `${intensity} ${eventType.replace('_', ' ')} event`,
            impacts: [`Impact on ${character} operations`, `${intensity} space weather effects`]
          };

          // Generate story
          const storySizePrompt = getStorySizePrompt(storySize || 'medium');
          
          const systemPrompt = `You are an expert storyteller and science educator creating engaging space weather stories for children. 
          
          ${getCharacterPrompt(character)}
          
          Guidelines:
          - ${getAgePrompt(ageGroup)}
          - ${storySizePrompt}
          - Include 4-5 scientific concepts with clear explanations
          - Make the story exciting and engaging while being scientifically accurate
          - Include sensory details (what you see, hear, feel)
          - Create emotional connection and wonder about space
          - End with a positive message about science and discovery
          - Each story should be completely unique and different from previous ones
          
          Return your response as a JSON object with:
          {
            "title": "An exciting title for the story",
            "story": "The complete narrative",
            "educationalFacts": ["fact1", "fact2", "fact3"]
          }`;

          const userPrompt = `Create a UNIQUE story #${i + 1} based on this space weather event:
          
          Event Type: ${currentEvent.type}
          Intensity: ${currentEvent.intensity}
          Time: ${currentEvent.timestamp.toISOString()}
          Description: ${currentEvent.description}
          Impacts: ${currentEvent.impacts.join(', ')}
          
          Character Perspective: ${character}
          Target Age: ${ageGroup}
          
          Story Variation: Focus on the ${randomVariation}
          Setting Time: ${randomTime}
          Weather Conditions: ${randomWeather}
          Unique Story ID: ${uniqueId}
          
          Make this story completely different from any previous stories. Use unique scenarios, different challenges, and fresh perspectives.`;

          const completion = await openai.chat.completions.create({
            model: FREE_MODELS['gpt-4o-mini'],
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.9,
            max_tokens: 1500,
          });

          const response = completion.choices[0]?.message?.content;
          if (!response) continue;

          // Parse response
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(response);
          } catch {
            parsedResponse = {
              title: `${character.replace('_', ' ').toUpperCase()}'s Space Weather Adventure #${i + 1}`,
              story: response,
              educationalFacts: [
                'Space weather can affect technology on Earth',
                'The Sun is the source of space weather events',
                'Aurora lights are caused by solar particles interacting with Earth\'s atmosphere'
              ]
            };
          }

          // Generate unique ID
          const storyId = `${Date.now()}-${character}-${ageGroup}-${uniqueId}`;

          // Save to database
          const storyData = {
            id: storyId,
            title: parsedResponse.title || `Space Weather Adventure #${i + 1}`,
            story: parsedResponse.story || response,
            character: character,
            age_group: ageGroup,
            educational_facts: parsedResponse.educationalFacts || [],
            space_weather_event: currentEvent,
            generated_at: new Date().toISOString(),
            is_active: true
          };

          const { error: insertError } = await supabase
            .from('generated_stories')
            .insert(storyData);

          if (!insertError) {
            generatedStories.push(storyData);
          }

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`Error generating story ${i + 1} for ${character}:`, error);
          continue;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedStories.length} stories`,
      stories: generatedStories
    });

  } catch (error) {
    console.error('Error in bulk story generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate bulk stories', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
