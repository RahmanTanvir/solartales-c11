import OpenAI from 'openai';

// Character types for story generation
export type Character = 
  | 'solar_flare' 
  | 'astronaut' 
  | 'pilot' 
  | 'aurora_hunter' 
  | 'power_grid_operator'
  | 'farmer'
  | 'radio_operator';

// Space weather event types
export type SpaceWeatherEvent = {
  type: 'solar_flare' | 'cme' | 'geomagnetic_storm' | 'radio_blackout';
  intensity: 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';
  timestamp: Date;
  location?: string;
  duration?: number;
  description: string;
  impacts: string[];
};

// Story generation configuration
export type StoryConfig = {
  character: Character;
  ageGroup: '8-10' | '11-13' | '14-17';
  length: 'short' | 'medium' | 'long';
  educationalLevel: 'beginner' | 'intermediate' | 'advanced';
  includeScientificFacts: boolean;
};

// OpenRouter configuration for free models
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL || process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
});

// Free OpenAI models available on OpenRouter
const FREE_MODELS = {
  'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
};

class AIStoryGenerator {
  private model: string;

  constructor(model: string = 'gpt-4o-mini') {
    this.model = FREE_MODELS[model as keyof typeof FREE_MODELS] || FREE_MODELS['gpt-4o-mini'];
  }

  // Generate character-specific prompt
  private getCharacterPrompt(character: Character): string {
    const characterPrompts = {
      solar_flare: "You are a Solar Flare - a burst of electromagnetic energy from the Sun's surface. Tell your story as you journey from the Sun to Earth, describing what you see and feel along the way.",
      astronaut: "You are Sumaiya Subha, an astronaut aboard the International Space Station. You're a mission specialist who has experienced multiple space weather events during your time in orbit. Describe your experience during a space weather event, focusing on how it affects the space station, the safety protocols you must follow, the amazing views of Earth's aurora from space, and how you protect yourself and your crewmates from radiation. Explain space weather in simple terms and share the wonder of seeing these cosmic phenomena from the unique perspective of space.",
      pilot: "You are Captain Tanvir Rahman, an experienced airline pilot with 20 years of flying experience. You're piloting a flight during a space weather event and must explain to your passengers what's happening. Describe how space weather affects your aircraft's navigation systems, radio communications, and GPS equipment. Share how you and your crew adapt your flight plan to ensure passenger safety, the backup procedures you use when technology fails, and how space weather can create both challenges and beautiful sights like aurora during polar flights.",
      aurora_hunter: "You are Saad Wasit, a member of the general public - a photography enthusiast and aurora chaser from northern Canada. You've been tracking space weather forecasts all week hoping to capture the perfect aurora photograph. Share your excitement as you witness the beautiful Northern Lights caused by space weather. Explain in simple terms what creates these magical lights and how space weather affects everyday people like you. Describe the community of aurora watchers and how space weather brings people together to witness nature's most spectacular light show.",
      power_grid_operator: "You are Ibrahim Ilham, a power grid operator working at the regional electrical control center. You're monitoring electrical systems during a geomagnetic storm that threatens to overload transformers and cause blackouts. Describe the challenges you face as space weather creates electrical surges and fluctuations in the power grid. Explain how you and your team work together to implement protective measures, reroute power, and keep the lights on for millions of people. Share how space weather affects the electricity that powers our homes, schools, and hospitals.",
      farmer: "You are Wasif Ahmad, a modern farmer who relies on GPS-guided tractors and precision agriculture technology. During a space weather event, your GPS systems start giving inaccurate readings, affecting your planting and harvesting operations. Tell your story of how space weather impacts farming in the 21st century, from GPS-guided equipment to weather monitoring systems. Explain how you adapt when technology fails and describe the connection between space weather and agriculture. Share how farmers have always watched the sky, but now must also understand invisible forces from space.",
      radio_operator: "You are Arman Khan, a ham radio operator and emergency communications volunteer. You represent both radio enthusiasts and everyday citizens who rely on communications during emergencies. During a solar event, describe how space weather disrupts radio communications, affects cell phone networks, and impacts emergency services. Share your experience maintaining critical communications when other systems fail, and explain how space weather affects the technology that connects our modern world - from radio waves to internet satellites."
    };

    return characterPrompts[character];
  }

  // Generate age-appropriate language guidelines
  private getAgePrompt(ageGroup: string): string {
    const agePrompts = {
      '8-10': "Use simple words, short sentences, and exciting descriptions that a 3rd grader can understand. Include fun sound effects and emotions.",
      '11-13': "Use engaging vocabulary appropriate for middle school students. Include some scientific terms but explain them clearly.",
      '14-17': "Use more sophisticated language and detailed scientific explanations appropriate for high school students."
    };

    return agePrompts[ageGroup as keyof typeof agePrompts] || agePrompts['8-10'];
  }

  // Generate story length guidelines
  private getLengthPrompt(length: string): string {
    const lengthPrompts = {
      short: "Write a concise story of 200-300 words.",
      medium: "Write a detailed story of 400-600 words.",
      long: "Write an elaborate story of 700-1000 words with multiple scenes."
    };

    return lengthPrompts[length as keyof typeof lengthPrompts] || lengthPrompts['medium'];
  }

  // Generate educational content integration
  private getEducationalPrompt(level: string, includeScientificFacts: boolean): string {
    if (!includeScientificFacts) {
      return "Focus on storytelling and emotion without heavy scientific detail.";
    }

    const educationalPrompts = {
      beginner: "Include 2-3 simple scientific facts woven naturally into the story. Explain concepts using everyday analogies.",
      intermediate: "Include 4-5 scientific concepts with clear explanations. Use analogies and examples to make complex ideas understandable.",
      advanced: "Include detailed scientific explanations, specific data, and technical terms with proper context."
    };

    return educationalPrompts[level as keyof typeof educationalPrompts] || educationalPrompts['beginner'];
  }

  // Generate a complete story
  async generateStory(
    event: SpaceWeatherEvent, 
    config: StoryConfig
  ): Promise<{ story: string; title: string; educationalFacts: string[] }> {
    try {
      const systemPrompt = `You are an expert storyteller and science educator creating engaging space weather stories for children. 
      
      ${this.getCharacterPrompt(config.character)}
      
      Guidelines:
      - ${this.getAgePrompt(config.ageGroup)}
      - ${this.getLengthPrompt(config.length)}
      - ${this.getEducationalPrompt(config.educationalLevel, config.includeScientificFacts)}
      - Make the story exciting and engaging while being scientifically accurate
      - Include sensory details (what you see, hear, feel)
      - Create emotional connection and wonder about space
      - End with a positive message about science and discovery
      
      Return your response as a JSON object with:
      {
        "title": "An exciting title for the story",
        "story": "The complete narrative",
        "educationalFacts": ["fact1", "fact2", "fact3"]
      }`;

      const userPrompt = `Create a story based on this space weather event:
      
      Event Type: ${event.type}
      Intensity: ${event.intensity}
      Time: ${event.timestamp.toISOString()}
      Description: ${event.description}
      Impacts: ${event.impacts.join(', ')}
      ${event.location ? `Location: ${event.location}` : ''}
      ${event.duration ? `Duration: ${event.duration} hours` : ''}
      
      Character Perspective: ${config.character}
      Target Age: ${config.ageGroup}
      Story Length: ${config.length}`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
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
        return {
          title: `${config.character.replace('_', ' ').toUpperCase()}'s Space Weather Adventure`,
          story: response,
          educationalFacts: [
            `Space weather can affect technology on Earth`,
            `The Sun is the source of space weather events`,
            `Aurora lights are caused by solar particles interacting with Earth's atmosphere`
          ]
        };
      }

      return {
        title: parsedResponse.title || 'Space Weather Adventure',
        story: parsedResponse.story || response,
        educationalFacts: parsedResponse.educationalFacts || []
      };

    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  // Generate multiple character perspectives for the same event
  async generateMultiplePerscpectives(
    event: SpaceWeatherEvent,
    characters: Character[],
    baseConfig: Omit<StoryConfig, 'character'>
  ): Promise<Array<{ character: Character; title: string; story: string; educationalFacts: string[] }>> {
    const stories = await Promise.all(
      characters.map(async (character) => {
        const config = { ...baseConfig, character };
        const result = await this.generateStory(event, config);
        return { character, ...result };
      })
    );

    return stories;
  }

  // Generate historical character prompts
  private getHistoricalCharacterPrompt(character: string, era: string): string {
    const historicalCharacterPrompts: Record<string, Record<string, string>> = {
      telegraph_operator: {
        'Victorian Era': "You are Samuel Morrison, a telegraph operator in 1859. You've been working the telegraph lines for years, but nothing has prepared you for this strange day when your equipment starts behaving impossibly.",
        'Modern Era': "You are a radio operator dealing with communication disruptions during a major space weather event in the late 20th century.",
        'Internet Age': "You are a communications technician managing critical infrastructure during a space weather emergency in the early 2000s."
      },
      victorian_scientist: {
        'Victorian Era': "You are Dr. Margaret Whitfield, a pioneering natural philosopher studying the mysterious connection between solar observations and earthly phenomena in 1859.",
        'Modern Era': "You are a scientist studying the early connections between space weather and technological impacts.",
        'Internet Age': "You are a space weather researcher analyzing the effects on modern technology."
      },
      ship_navigator: {
        'Victorian Era': "You are Captain William Hayes, an experienced sea captain whose compass and navigation become unreliable during the great magnetic storm of 1859.",
        'Modern Era': "You are a ship's navigation officer dealing with compass problems during a geomagnetic storm.",
        'Internet Age': "You are a maritime navigator whose GPS systems are failing during a space weather event."
      },
      power_grid_operator: {
        'Victorian Era': "You are an engineer working with early electrical systems when strange currents begin flowing through telegraph wires.",
        'Modern Era': "You are Marie Tremblay, a power grid operator at Hydro-Quebec, watching helplessly as the entire Quebec grid collapses in 1989.",
        'Internet Age': "You are a power system engineer dealing with grid instabilities during major space weather events."
      },
      emergency_responder: {
        'Victorian Era': "You are a public safety official dealing with the panic and confusion as strange lights fill the sky and telegraph systems fail.",
        'Modern Era': "You are Lieutenant David Chen, an emergency coordinator managing the crisis as Quebec goes dark in 1989.",
        'Internet Age': "You are an emergency management specialist coordinating response to widespread technology failures."
      },
      radio_operator: {
        'Victorian Era': "You are a telegraph operator experiencing the strange phenomena of messages being sent without power during the great storm.",
        'Modern Era': "You are Sarah Rodriguez, a ham radio operator providing critical emergency communications during the Quebec blackout.",
        'Internet Age': "You are a radio communications specialist maintaining emergency services during satellite and cellular failures."
      },
      astronaut: {
        'Victorian Era': "You are a pioneering balloonist or early aviator observing strange atmospheric phenomena from high altitude.",
        'Modern Era': "You are an early astronaut dealing with radiation exposure during space weather events.",
        'Internet Age': "You are Commander Elena Petrov aboard the International Space Station during the Halloween solar storms of 2003."
      },
      gps_technician: {
        'Victorian Era': "You are a surveyor whose compass readings become completely unreliable during the magnetic storm.",
        'Modern Era': "You are an early GPS engineer testing the new satellite navigation technology.",
        'Internet Age': "You are Dr. James Park, a GPS systems engineer watching global navigation systems fail during the Halloween storms."
      },
      satellite_operator: {
        'Victorian Era': "You are an astronomer observing unusual solar activity through your telescope during the great event.",
        'Modern Era': "You are an early satellite communications engineer dealing with the first major space weather impacts on satellites.",
        'Internet Age': "You are Lisa Anderson, a satellite operations manager racing to protect billions of dollars of space infrastructure during the 2003 storms."
      }
    };

    const eraPrompts = historicalCharacterPrompts[character];
    return eraPrompts?.[era] || `You are a ${character.replace('_', ' ')} experiencing a major space weather event during the ${era}.`;
  }

  // Generate historical event story
  async generateHistoricalStory(
    historicalEvent: {
      name: string;
      date: Date;
      era: string;
      description: string;
      impacts: string[];
      historicalContext: string;
      severity: string;
    },
    config: StoryConfig
  ): Promise<{ story: string; title: string; educationalFacts: string[] }> {
    try {
      const systemPrompt = `You are an expert historical storyteller and science educator creating immersive time-travel stories about space weather events. 

      ${this.getHistoricalCharacterPrompt(config.character, historicalEvent.era)}
      
      Historical Context Guidelines:
      - Accurately portray the technology and society of ${historicalEvent.era}
      - Show how space weather affected the available technology of that time
      - Include period-appropriate language and concerns
      - Demonstrate the progression of human understanding of space weather
      - Create authentic emotional responses based on the knowledge of that era
      
      Story Guidelines:
      - ${this.getAgePrompt(config.ageGroup)}
      - ${this.getLengthPrompt(config.length)}
      - Make the historical setting vivid and immersive
      - Show the character's genuine fear, wonder, or confusion about the unknown phenomenon
      - Include accurate historical details about how people reacted to these events
      - Demonstrate how this event contributed to scientific understanding
      
      Return your response as a JSON object with:
      {
        "title": "An exciting historical title",
        "story": "The complete historical narrative in first person",
        "educationalFacts": ["historical_fact1", "scientific_fact2", "impact_fact3"]
      }`;

      const userPrompt = `Create a historical space weather story based on:
      
      Event: ${historicalEvent.name}
      Date: ${historicalEvent.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      Era: ${historicalEvent.era}
      Severity: ${historicalEvent.severity}
      Description: ${historicalEvent.description}
      Historical Context: ${historicalEvent.historicalContext}
      Key Impacts: ${historicalEvent.impacts.join(', ')}
      
      Character Perspective: ${config.character.replace('_', ' ')}
      Target Age: ${config.ageGroup}
      Story Length: ${config.length}
      
      Create a compelling first-person narrative that transports the reader back in time to experience this event through the character's eyes. Show both the immediate drama and the historical significance of this moment in space weather history.`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1800,
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
        return {
          title: `${historicalEvent.name}: A ${config.character.replace('_', ' ')}'s Account`,
          story: response,
          educationalFacts: [
            `The ${historicalEvent.name} was a significant space weather event in history`,
            `This event demonstrated the vulnerability of ${historicalEvent.era} technology`,
            `The impact helped advance our understanding of space weather`
          ]
        };
      }

      return {
        title: parsedResponse.title || `${historicalEvent.name}: A Historical Account`,
        story: parsedResponse.story || response,
        educationalFacts: parsedResponse.educationalFacts || []
      };

    } catch (error) {
      console.error('Error generating historical story:', error);
      throw new Error('Failed to generate historical story. Please try again.');
    }
  }

  // Generate era-specific educational content
  async generateHistoricalComparison(
    modernEvent: SpaceWeatherEvent,
    historicalEvent: {
      name: string;
      date: Date;
      era: string;
      description: string;
      impacts: string[];
    }
  ): Promise<{ comparison: string; thenVsNow: string[]; whatWeLearned: string[] }> {
    try {
      const systemPrompt = `You are a space weather historian creating educational content that compares historical and modern space weather events.`;

      const userPrompt = `Compare these two space weather events:
      
      Historical Event: ${historicalEvent.name} (${historicalEvent.date.getFullYear()})
      Modern Event: ${modernEvent.description} (${modernEvent.timestamp.getFullYear()})
      
      Create a comparison showing:
      1. How technology was affected differently in each era
      2. How human understanding evolved
      3. What we learned from each event
      
      Format as JSON with comparison, thenVsNow array, and whatWeLearned array.`;

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI model');
      }

      const parsedResponse = JSON.parse(response);
      
      return {
        comparison: parsedResponse.comparison || 'Space weather has affected human technology throughout history.',
        thenVsNow: parsedResponse.thenVsNow || [],
        whatWeLearned: parsedResponse.whatWeLearned || []
      };

    } catch (error) {
      console.error('Error generating historical comparison:', error);
      return {
        comparison: 'Space weather events have impacted human civilization throughout history, with effects changing as our technology evolved.',
        thenVsNow: [
          'Then: Telegraph systems failed; Now: Satellites and GPS are affected',
          'Then: Limited understanding; Now: Advanced prediction capabilities'
        ],
        whatWeLearned: [
          'Space weather can have significant impacts on technology',
          'Our understanding and preparedness have greatly improved over time'
        ]
      };
    }
  }
}

// Export the generator instance
export const aiStoryGenerator = new AIStoryGenerator();

// Export types and class
export { AIStoryGenerator };
export default aiStoryGenerator;
