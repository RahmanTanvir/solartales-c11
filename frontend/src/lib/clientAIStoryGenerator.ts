// Client-side AI Story Generator - Using free AI models like AskAI section
import { getFallbackStory, getAITroubleMessage, PreGeneratedStory } from './preGeneratedStories';

interface Character {
  id: string;
  name: string;
  description: string;
}

interface StoryConfig {
  character: Character;
  ageGroup: '8-10' | '11-13' | '14-17';
  storySize: 'short' | 'medium' | 'long';
  mood?: string;
  eventType: string;
  intensity: string;
  eventTime: string;
}

// Free AI models that don't require payment (prioritized by speed)
const FREE_AI_MODELS = [
  'qwen/qwen-2.5-72b-instruct:free', // Fastest response time
  'openai/gpt-4o-mini:free',
  'openai/gpt-3.5-turbo:free',
  'google/gemma-2-9b-it:free',
  'openai/gpt-oss-20b:free',
  'anthropic/claude-3-haiku'
];

class ClientAIStoryGenerator {
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from environment first
    this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || 
                  process.env.OPENROUTER_API_KEY ||
                  null;
  }

  private getCharacterPrompt(characterId: string): string {
    const characterPrompts: Record<string, string> = {
      solar_flare: "You are a Solar Flare - a burst of electromagnetic energy from the Sun's surface. Tell your story as you journey from the Sun to Earth, describing what you see and feel along the way.",
      astronaut: "You are Sumaiya Subha, an astronaut aboard the International Space Station. You're a mission specialist who has experienced multiple space weather events during your time in orbit. Describe your experience during a space weather event, focusing on how it affects the space station, the safety protocols you must follow, the amazing views of Earth's aurora from space, and how you protect yourself and your crewmates from radiation.",
      pilot: "You are Captain Tanvir Rahman, an experienced airline pilot with 20 years of flying experience. You're piloting a flight during a space weather event and must explain to your passengers what's happening. Describe how space weather affects your aircraft's navigation systems, radio communications, and GPS equipment.",
      aurora_hunter: "You are Saad Wasit, a member of the general public - a photography enthusiast and aurora chaser from northern Canada. You've been tracking space weather forecasts all week hoping to capture the perfect aurora photograph. Share your excitement as you witness the beautiful Northern Lights caused by space weather.",
      power_grid_operator: "You are Ibrahim Ilham, a power grid operator working at the regional electrical control center. You're monitoring electrical systems during a geomagnetic storm that threatens to overload transformers and cause blackouts.",
      farmer: "You are Wasif Ahmad, a modern farmer who relies on GPS-guided tractors and precision agriculture technology. During a space weather event, your GPS systems start giving inaccurate readings, affecting your planting and harvesting operations.",
      radio_operator: "You are Arman Khan, a ham radio operator and emergency communications volunteer. During a solar event, describe how space weather disrupts radio communications, affects cell phone networks, and impacts emergency services."
    };
    
    return characterPrompts[characterId] || characterPrompts['astronaut'];
  }

  private getAgeGroupPrompt(ageGroup: string): string {
    const agePrompts = {
      '8-10': "Write for 8-10 year olds using simple vocabulary, short sentences, and exciting descriptions that spark curiosity. Include comparisons to familiar things like toys, games, or everyday objects.",
      '11-13': "Write for 11-13 year olds using moderate vocabulary and engaging storytelling. Include some scientific terms with explanations and relate concepts to their experiences with technology and nature.",
      '14-17': "Write for 14-17 year olds using more sophisticated vocabulary and detailed explanations. Include scientific concepts, cause-and-effect relationships, and connections to current events and technology they use daily."
    };
    
    return agePrompts[ageGroup as keyof typeof agePrompts] || agePrompts['11-13'];
  }

  private getLengthPrompt(length: string): string {
    const lengthPrompts = {
      short: "Write a concise story of 200-300 words.",
      medium: "Write a detailed story of 400-600 words.",
      long: "Write an elaborate story of 700-1000 words with multiple scenes."
    };

    return lengthPrompts[length as keyof typeof lengthPrompts] || lengthPrompts['medium'];
  }

  async generateStory(config: StoryConfig): Promise<{ story: string; title: string; educationalFacts: string[]; isPreGenerated?: boolean; troubleMessage?: any }> {
    // If no API key available, return fallback story immediately
    if (!this.apiKey) {
      console.log('No API key available, using pre-generated fallback story');
      return this.generatePreGeneratedFallback(config);
    }

    const prompt = `Create a space weather story with the following requirements:

CHARACTER: ${this.getCharacterPrompt(config.character.id)}

AUDIENCE: ${this.getAgeGroupPrompt(config.ageGroup)}

LENGTH: ${this.getLengthPrompt(config.storySize)}

SPACE WEATHER EVENT: The current space weather event is a ${config.eventType} with ${config.intensity} intensity occurring at ${config.eventTime}.

STORY REQUIREMENTS:
- Make the story exciting and engaging while being scientifically accurate
- Include sensory details (what you see, hear, feel)
- Create emotional connection and wonder about space
- End with a positive message about science and discovery

CRITICAL: You must respond with ONLY valid JSON and nothing else. No explanations, no additional text, no markdown. Just pure JSON:
{
  "title": "An exciting title for the story",
  "story": "The complete narrative",
  "educationalFacts": ["fact1", "fact2", "fact3", "fact4", "fact5"]
}`;

    let lastError: Error | null = null;

    // Try each free AI model until one works
    for (const model of FREE_AI_MODELS) {
      try {
        console.log(`🤖 Trying AI model for story generation: ${model}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
            'X-Title': 'SolarTales - Story Generation'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are a space weather story generator for SolarTales. You must respond with ONLY valid JSON and nothing else. No explanations, no additional text, no markdown. Just pure JSON with title, story, and educationalFacts.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: config.storySize === 'long' ? 1200 : config.storySize === 'medium' ? 800 : 500,
            temperature: 0.8
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Model ${model} returned status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error(`Invalid response structure from ${model}`);
        }

        const content = data.choices[0].message.content.trim();
        
        // Try to parse JSON response
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(content);
        } catch (parseError) {
          // If JSON parsing fails, try to extract content
          console.warn(`JSON parsing failed for ${model}, attempting fallback parsing`);
          throw new Error(`Invalid JSON response from ${model}`);
        }

        // Validate response structure
        if (!parsedResponse.title || !parsedResponse.story || !parsedResponse.educationalFacts) {
          throw new Error(`Incomplete response from ${model}`);
        }

        console.log(`✅ Successfully generated story using ${model}`);
        return {
          title: parsedResponse.title,
          story: parsedResponse.story,
          educationalFacts: Array.isArray(parsedResponse.educationalFacts) 
            ? parsedResponse.educationalFacts 
            : this.getDefaultEducationalFacts(config.eventType),
          isPreGenerated: false
        };

      } catch (error) {
        console.warn(`❌ Model ${model} failed:`, error);
        lastError = error as Error;
        continue; // Try next model
      }
    }

    // If all AI models failed, use pre-generated fallback
    console.log('All AI models failed, using pre-generated fallback story');
    return this.generatePreGeneratedFallback(config);
  }

  private generatePreGeneratedFallback(config: StoryConfig): { story: string; title: string; educationalFacts: string[]; isPreGenerated: boolean; troubleMessage: any } {
    const troubleMessage = getAITroubleMessage();
    const fallbackStory = getFallbackStory(
      config.character.id,
      config.mood || 'real_time',
      config.ageGroup,
      config.storySize,
      config.eventType
    );

    if (fallbackStory) {
      return {
        title: fallbackStory.title,
        story: fallbackStory.story,
        educationalFacts: fallbackStory.educationalFacts,
        isPreGenerated: true,
        troubleMessage
      };
    }

    // Ultimate fallback if no pre-generated story found
    return {
      title: "An Amazing Space Weather Adventure",
      story: `Hi there! I'm ${config.character.name}, and I'm here to tell you about an incredible space weather event happening right now - a ${config.eventType}! 

Even though our AI storyteller is taking a cosmic break among the stars, I can still share this amazing adventure with you. Space weather events like this ${config.eventType} are some of nature's most spectacular phenomena, connecting our Sun to Earth in ways that affect everything from beautiful aurora lights to the technology we use every day.

This ${config.eventType} started on our Sun and traveled through the vast emptiness of space to reach Earth. It's a reminder that we live in a connected cosmic neighborhood where events on the Sun can influence life on our planet!

Scientists around the world are monitoring this event and learning more about how space weather works. It's like having a real-time science experiment happening right above our heads!

Keep looking up at the sky - you might see some beautiful effects if you're in the right location. Every space weather event teaches us something new about our amazing universe!`,
      educationalFacts: this.getDefaultEducationalFacts(config.eventType),
      isPreGenerated: true,
      troubleMessage
    };
  }

  private generateFallbackStory(config: StoryConfig): { story: string; title: string; educationalFacts: string[] } {
    const fallbackStories = {
      solar_flare: {
        title: "The Journey of a Solar Flare",
        story: `Hi there! I'm a solar flare, and I just burst from the Sun's surface in a spectacular explosion of light and energy! 

I started deep in the Sun's core, where it's incredibly hot - about 15 million degrees! The magnetic field lines on the Sun's surface got all twisted up like a rubber band, and when they snapped back - WHOOSH! - I was born in a brilliant flash of light.

Now I'm racing through space at incredible speeds, carrying charged particles with me. I'm moving so fast that I'll reach Earth in just 8 minutes! As I travel, I'm like a cosmic messenger, bringing news from our nearest star.

When I arrive at Earth, I'll interact with our planet's magnetic field, creating beautiful aurora lights in the sky - nature's own light show! People in places like Alaska, Canada, and northern Europe might see gorgeous green, purple, and blue curtains dancing across the night sky.

But I also need to warn you - I can sometimes cause problems for technology. Satellites might have trouble, and radio communications could be disrupted. That's why scientists at space weather centers monitor flares like me to keep everyone safe.

Even though I can cause some trouble, I'm also a reminder of how amazing and powerful our Sun is! Without the Sun's energy, there would be no life on Earth. So next time you see an aurora or hear about space weather, remember that it's all part of the incredible cosmic dance happening all around us!`,
        educationalFacts: [
          "Solar flares are explosions on the Sun's surface that release enormous amounts of energy",
          "The light from a solar flare reaches Earth in about 8 minutes",
          "Solar flares can cause beautiful aurora displays in polar regions",
          "Space weather can affect satellites, GPS, and radio communications",
          "Scientists monitor solar activity to predict space weather events"
        ]
      },
      cme: {
        title: "The Great Cosmic Wind",
        story: `Hello! I'm a Coronal Mass Ejection, but you can call me a CME. I'm like a giant bubble of solar wind and magnetic fields released from the Sun's corona - the Sun's outer atmosphere.

I formed when the Sun's magnetic field lines got so tangled that they finally snapped, launching billions of tons of charged particles into space. Imagine the biggest balloon you've ever seen, then make it a billion times bigger - that's me!

I'm now traveling through space at speeds of up to 2,000 kilometers per second. That's incredibly fast - I could travel from New York to Los Angeles in just 2 seconds! But space is so vast that it will still take me 1-3 days to reach Earth.

As I travel, I'm carrying the Sun's magnetic field with me. When I arrive at Earth, I'll collide with our planet's magnetosphere - the invisible magnetic shield that protects us. This collision can cause geomagnetic storms and create some of the most spectacular aurora displays ever seen!

People living near the North and South poles might see aurora lights dancing across the sky in colors they've never seen before. But I can also cause problems for astronauts in space and affect power grids on Earth.

Scientists track my journey using special spacecraft positioned between the Sun and Earth, giving people advance warning of my arrival. This helps protect satellites and keeps astronauts safe.

Remember, I'm part of the Sun's natural behavior. Our Sun is a dynamic, ever-changing star, and events like me help scientists understand how stars work throughout the universe!`,
        educationalFacts: [
          "CMEs are massive clouds of charged particles ejected from the Sun's corona",
          "A single CME can contain billions of tons of material",
          "CMEs travel at speeds of 400-2000 km/second through space",
          "They can cause intense geomagnetic storms when they hit Earth",
          "CMEs are one of the main causes of spectacular aurora displays"
        ]
      }
    };

    const fallback = fallbackStories[config.eventType as keyof typeof fallbackStories] || fallbackStories.solar_flare;
    return fallback;
  }

  private getDefaultEducationalFacts(eventType: string): string[] {
    const facts = {
      solar_flare: [
        "Solar flares are explosions on the Sun's surface",
        "They travel at the speed of light and reach Earth in 8 minutes",
        "Solar flares can disrupt radio communications",
        "They are classified as A, B, C, M, or X based on intensity",
        "Solar flares often occur near sunspots"
      ],
      cme: [
        "CMEs are massive clouds of charged particles from the Sun",
        "They can take 1-3 days to reach Earth",
        "CMEs can cause beautiful aurora displays",
        "They can affect satellite operations and power grids",
        "CMEs are tracked by special spacecraft"
      ],
      geomagnetic_storm: [
        "Geomagnetic storms are disturbances in Earth's magnetic field",
        "They are caused by solar wind and CMEs",
        "These storms can create widespread aurora displays",
        "They can affect GPS navigation and power systems",
        "Geomagnetic storms are classified from G1 to G5"
      ]
    };

    return facts[eventType as keyof typeof facts] || facts.solar_flare;
  }

  // Method to set API key dynamically
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openrouter_api_key', apiKey);
    }
  }

  // Check if AI generation is available
  isAvailable(): boolean {
    return this.apiKey !== null;
  }
}

// Export singleton instance
export const clientAIStoryGenerator = new ClientAIStoryGenerator();
