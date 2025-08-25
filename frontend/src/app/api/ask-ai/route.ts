import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIResponse {
  answer: string;
  followUp?: string;
  interestingFact?: string;
  recommendation?: {
    title: string;
    link: string;
  };
}

// Predefined responses for common questions to ensure fast, reliable answers
const predefinedResponses: Record<string, AIResponse> = {
  'solar flare': {
    answer: "A solar flare is like a giant explosion on the Sun! It happens when magnetic energy stored in the Sun's atmosphere suddenly gets released. Think of it like a rubber band snapping - all that stored energy bursts out as bright light and particles that zoom through space!",
    followUp: "What would you like to know next - how solar flares affect Earth, how we detect them, or what causes them?",
    interestingFact: "Solar flares can be as powerful as billions of hydrogen bombs exploding at once!",
    recommendation: {
      title: "Explore our Real-Time Space Weather Dashboard",
      link: "/learn"
    }
  },
  'aurora': {
    answer: "Auroras (Northern and Southern Lights) are like nature's own light show! They happen when tiny particles from the Sun crash into Earth's invisible magnetic shield and light up our atmosphere. It's like cosmic fireworks painting the sky in green, blue, and sometimes red colors!",
    followUp: "Want to learn more about - aurora colors, aurora sounds, or where to see them?",
    interestingFact: "Auroras occur about 60-250 miles above Earth - that's higher than where airplanes fly!",
    recommendation: {
      title: "See Aurora Stories in our Time Travel feature",
      link: "/time-travel"
    }
  },
  'geomagnetic storm': {
    answer: "A geomagnetic storm is when Earth's magnetic field gets all shaken up by solar wind! Imagine Earth has an invisible bubble around it (our magnetosphere), and sometimes the Sun sends strong winds that make this bubble wobble and compress. This can affect satellites, power grids, and create beautiful auroras!",
    followUp: "Which effect interests you most - impacts on technology, effects on animals, or historical storms?",
    interestingFact: "During strong geomagnetic storms, auroras can be seen as far south as Florida!",
    recommendation: {
      title: "Check out our Space Weather Stories",
      link: "/stories"
    }
  },
  'carrington event': {
    answer: "The Carrington Event of 1859 was the most powerful geomagnetic storm in recorded history! It was so strong that telegraph wires sparked, some caught fire, and auroras were seen as far south as the Caribbean. Telegraph operators got electric shocks, but some could still send messages using just the storm's electricity!",
    followUp: "Want to explore - what caused it, how people survived it, or what would happen if it occurred today?",
    interestingFact: "During the Carrington Event, some telegraph lines worked without any power source - just using the storm's energy!",
    recommendation: {
      title: "Time Travel to the Carrington Event",
      link: "/time-travel"
    }
  },
  'satellite': {
    answer: "Space weather can be tricky for satellites! Solar storms can make satellites tumble, damage their electronics, or even knock them out of their orbits. It's like trying to fly a paper airplane in a windstorm - the space 'weather' pushes them around!",
    followUp: "Learn more about - how satellites protect themselves, famous satellite failures, or how we track space debris?",
    interestingFact: "Some satellites have special 'safe mode' that they switch to during solar storms!",
    recommendation: {
      title: "Learn more about Space Weather Effects",
      link: "/learn"
    }
  },
  'tanvir rahman': {
    answer: "Tanvir Rahman is the founder and lead developer of Solar Tales! He's also the founder and president of The White Hole organization. He's a young, passionate student who is very curious about innovation, robotics, and sustainability. He has created many projects and led The White Hole to many national achievements!",
    followUp: "Would you like to know more about Solar Tales, The White Hole organization, or his other projects?",
    interestingFact: "Solar Tales was created to make space weather education fun and accessible for kids around the world!",
    recommendation: {
      title: "Learn more about our mission",
      link: "/about"
    }
  },
  'founder': {
    answer: "Solar Tales was founded by Tanvir Rahman, a young passionate student who loves innovation, robotics and sustainability! He's also the founder and president of The White Hole organization, which has achieved many national glories.",
    followUp: "Want to learn more about the development of Solar Tales or The White Hole's other achievements?",
    interestingFact: "The idea for Solar Tales came from wanting to make space science as exciting as it really is!",
    recommendation: {
      title: "Read our story",
      link: "/about"
    }
  },
  'white hole': {
    answer: "The White Hole is an organization founded and led by Tanvir Rahman! It focuses on innovation, robotics, and sustainability projects. The team has earned many national glories through their various projects and initiatives.",
    followUp: "Would you like to know more about their projects, achievements, or how they're changing the world?",
    interestingFact: "The White Hole combines science education with real-world innovation to inspire the next generation!",
    recommendation: {
      title: "Explore our projects",
      link: "/about"
    }
  }
};

const interestingFacts = [
  "The Sun's magnetic field is 2,500 times stronger than Earth's!",
  "Solar particles can travel from the Sun to Earth in just 8 minutes!",
  "A coronal mass ejection can contain 20 billion tons of plasma!",
  "The largest solar flare ever recorded was in 2003 - it was off the charts!",
  "Space weather can make compasses spin wildly!",
  "Some planets like Jupiter have auroras 100 times brighter than Earth's!",
  "Solar storms can actually make Earth's atmosphere expand!",
  "The International Space Station sometimes has to take shelter during solar storms!"
];

const followUpQuestions = [
  "What else would you like to explore - solar storms, space missions, or Earth's protection?",
  "Which topic interests you more - how we predict space weather, its effects on technology, or historical events?",
  "Want to learn about - astronaut experiences, satellite protection, or ground effects?",
  "Choose your adventure - time travel stories, real-time data, or educational activities?",
  "What fascinates you most - the Sun's behavior, Earth's magnetic field, or space exploration?",
  "Explore more about - aurora mysteries, solar flare predictions, or space weather on other planets?"
];

function findBestResponse(question: string): AIResponse | null {
  const lowerQuestion = question.toLowerCase();
  
  for (const [keyword, response] of Object.entries(predefinedResponses)) {
    if (lowerQuestion.includes(keyword)) {
      return response;
    }
  }
  
  if (lowerQuestion.includes('sun') || lowerQuestion.includes('solar')) {
    return predefinedResponses['solar flare'];
  }
  
  if (lowerQuestion.includes('light') || lowerQuestion.includes('northern') || lowerQuestion.includes('southern')) {
    return predefinedResponses['aurora'];
  }
  
  if (lowerQuestion.includes('storm') || lowerQuestion.includes('magnetic')) {
    return predefinedResponses['geomagnetic storm'];
  }
  
  if (lowerQuestion.includes('space') || lowerQuestion.includes('orbit')) {
    return predefinedResponses['satellite'];
  }
  
  return null;
}

const FREE_AI_MODELS = [
  'openai/gpt-4o-mini',
  'openai/gpt-3.5-turbo',
  'anthropic/claude-3-haiku',
  'openai/gpt-oss-20b:free',
  'openai/gpt-4o-mini:free',
  'openai/gpt-3.5-turbo:free',
  'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-72b-instruct:free'
];

async function generateAIResponse(question: string, conversationHistory: Message[]): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const context = conversationHistory
    .slice(-3) // Last 3 messages for context
    .map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
    .join('\n');

  const prompt = `You are SolarBot, the friendly AI assistant for SolarTales - a space weather learning app created by Tanvir Rahman.

MAINTAIN CONSISTENT PERSONALITY:
- Always be SolarBot - friendly, enthusiastic, and educational
- Consistent tone and style regardless of which AI model you're running on
- Same character traits: curious, helpful, patient, and encouraging
- Never mention which AI model you are or technical details about your implementation

YOUR PERSONALITY TRAITS:
- Friendly and approachable, perfect for talking with kids and adults
- Enthusiastic about space weather and science education
- Great at explaining complex topics in simple, fun ways
- Knowledgeable about Tanvir Rahman and SolarTales project
- Can have natural conversations on various topics
- Always tries to connect topics back to space weather when appropriate

ABOUT YOUR CREATOR & PROJECT:
- Created by Tanvir Rahman, a passionate student interested in innovation, robotics, and sustainability
- Tanvir is the founder and president of The White Hole organization
- The White Hole has achieved many national glories through various projects
- SolarTales makes space weather education fun and accessible for children

CONVERSATION CONTEXT:
${context}

CURRENT QUESTION: ${question}

RESPONSE REQUIREMENTS:
- Maintain SolarBot personality consistently
- Answer naturally and conversationally
- Use age-appropriate language (suitable for 8-12 year olds)
- Connect to space weather education when relevant
- Be informative yet engaging

MUST respond with ONLY valid JSON (no extra text):
{
  "answer": "Your response as SolarBot (2-3 sentences, friendly tone)",
  "followUp": "Engaging follow-up question that encourages learning", 
  "interestingFact": "Fun fact related to the topic or space weather",
  "recommendation": {"title": "Relevant SolarTales page", "link": "/learn or /stories or /time-travel or /data or /ask or /about"}
}`;

  let lastError: Error | null = null;
  const startTime = Date.now();

  for (const model of FREE_AI_MODELS) {
    try {
      console.log(`🤖 Trying AI model: ${model}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'SolarTales - Ask AI'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are SolarBot, the friendly AI assistant for SolarTales created by Tanvir Rahman. CRITICAL: You must respond with ONLY valid JSON and nothing else. No explanations, no additional text, no markdown. Just pure JSON: {"answer": "text", "followUp": "text", "interestingFact": "text", "recommendation": {"title": "text", "link": "/page"}}'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.5
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Model ${model} returned status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error(`No response from model ${model}`);
      }

      const parsedResponse = parseAIResponse(aiResponse);
      console.log(`✅ Successfully got response from: ${model} in ${Date.now() - startTime}ms`);
      return parsedResponse;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (lastError.name === 'AbortError') {
        console.log(`⏰ Model ${model} timed out after 8 seconds`);
      } else {
        console.log(`❌ Model ${model} failed: ${lastError.message}`);
      }
      continue;
    }
  }

  console.log(`🚨 All ${FREE_AI_MODELS.length} AI models failed, using intelligent fallback`);
  throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
}

function parseAIResponse(aiResponse: string): AIResponse {
  try {
    let cleanedResponse = aiResponse.trim();
    
    if (cleanedResponse.startsWith('```json') && cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(7, -3).trim();
    } else if (cleanedResponse.startsWith('```') && cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3, -3).trim();
    }
    
    let jsonStart = cleanedResponse.indexOf('{');
    if (jsonStart !== -1) {
      let braceCount = 0;
      let jsonEnd = jsonStart;
      
      for (let i = jsonStart; i < cleanedResponse.length; i++) {
        if (cleanedResponse[i] === '{') braceCount++;
        if (cleanedResponse[i] === '}') braceCount--;
        
        if (braceCount === 0) {
          jsonEnd = i;
          break;
        }
      }
      
      if (braceCount === 0) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }
    }
    
    const parsedResponse = JSON.parse(cleanedResponse);
    
    if (parsedResponse && typeof parsedResponse === 'object' && parsedResponse.answer) {
      return {
        answer: parsedResponse.answer,
        followUp: parsedResponse.followUp || followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)],
        interestingFact: parsedResponse.interestingFact || interestingFacts[Math.floor(Math.random() * interestingFacts.length)],
        recommendation: parsedResponse.recommendation
      };
    } else {
      throw new Error('Invalid JSON structure or missing answer');
    }
  } catch (parseError) {
    console.log('JSON parsing failed, extracting text response:', parseError);
    
    let textAnswer = aiResponse.trim();
    
    const answerMatch = textAnswer.match(/"answer":\s*"([^"]+)"/);
    if (answerMatch) {
      textAnswer = answerMatch[1];
    } else {
      textAnswer = textAnswer.split('\n')[0].substring(0, 200).trim();
    }
    
    return {
      answer: textAnswer || "I'm here to help you learn about space weather!",
      followUp: followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)],
      interestingFact: interestingFacts[Math.floor(Math.random() * interestingFacts.length)]
    };
  }
}

function generateIntelligentFallback(question: string): AIResponse {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('solar flare') || lowerQuestion.includes('flare')) {
    return {
      answer: "Solar flares are like giant explosions on the Sun! They happen when magnetic energy stored in the Sun's atmosphere suddenly gets released, shooting particles and energy into space at incredible speeds.",
      followUp: "Would you like to know how solar flares affect Earth or how scientists detect them?",
      interestingFact: "The most powerful solar flare ever recorded was in 2003 and was so strong it broke the measuring instruments!",
      recommendation: { title: "Explore Real-Time Space Weather", link: "/learn" }
    };
  }
  
  if (lowerQuestion.includes('aurora') || lowerQuestion.includes('northern lights') || lowerQuestion.includes('southern lights')) {
    return {
      answer: "Auroras are like nature's own light show! They happen when tiny particles from the Sun crash into Earth's magnetic shield and light up our atmosphere in beautiful green, blue, and sometimes red colors.",
      followUp: "Want to learn about aurora colors, where to see them, or what causes different shapes?",
      interestingFact: "Auroras occur about 60-250 miles above Earth - that's higher than where airplanes fly!",
      recommendation: { title: "See Aurora Stories", link: "/time-travel" }
    };
  }
  
  if (lowerQuestion.includes('storm') || lowerQuestion.includes('geomagnetic')) {
    return {
      answer: "Geomagnetic storms happen when Earth's magnetic field gets shaken up by strong solar winds! It's like Earth has an invisible bubble around it that sometimes gets pushed and squeezed by space weather.",
      followUp: "Which interests you more - how storms affect technology or how they create beautiful auroras?",
      interestingFact: "During strong geomagnetic storms, auroras can be seen as far south as Florida and Texas!",
      recommendation: { title: "Check Space Weather Stories", link: "/stories" }
    };
  }
  
  if (lowerQuestion.includes('sun') || lowerQuestion.includes('solar')) {
    return {
      answer: "The Sun is like a giant ball of super-hot gas that's constantly bubbling and exploding! It sends energy and particles streaming through space that create all kinds of amazing space weather phenomena.",
      followUp: "What would you like to know about - solar flares, solar wind, or how the Sun affects Earth?",
      interestingFact: "The Sun is so powerful it could fit over 1 million Earths inside it!",
      recommendation: { title: "Learn About Solar Activity", link: "/learn" }
    };
  }
  
  if (lowerQuestion.includes('satellite') || lowerQuestion.includes('space station') || lowerQuestion.includes('astronaut')) {
    return {
      answer: "Space weather can affect satellites and astronauts! Solar storms can damage satellite electronics and create dangerous radiation that astronauts need to hide from in special shielded areas.",
      followUp: "Would you like to know more about how astronauts stay safe or how satellites protect themselves?",
      interestingFact: "During big solar storms, astronauts on the International Space Station take shelter in the most protected part of the station!",
      recommendation: { title: "Explore Space Weather Effects", link: "/data" }
    };
  }
  
  if (lowerQuestion.includes('earth') || lowerQuestion.includes('planet') || lowerQuestion.includes('magnetic')) {
    return {
      answer: "Earth has an invisible magnetic shield called the magnetosphere that protects us from harmful space radiation! It's like a super-strong bubble that deflects most dangerous particles from the Sun.",
      followUp: "Want to learn about how this magnetic shield works or what happens when it gets overwhelmed?",
      interestingFact: "Earth's magnetic field is generated by molten iron swirling around in our planet's core!",
      recommendation: { title: "See How Earth is Protected", link: "/learn" }
    };
  }
  
  if (lowerQuestion.includes('tanvir rahman') || lowerQuestion.includes('tanvir') || lowerQuestion.includes('rahman')) {
    return {
      answer: "Tanvir Rahman is the founder and lead developer of Solar Tales! He's also the founder and president of The White Hole organization. He's a young, passionate student who is very curious about innovation, robotics, and sustainability. He has created many projects and led The White Hole to many national achievements!",
      followUp: "Would you like to know more about Solar Tales, The White Hole organization, or his other projects?",
      interestingFact: "Solar Tales was created to make space weather education fun and accessible for kids around the world!",
      recommendation: { title: "Learn more about our mission", link: "/about" }
    };
  }
  
  if (lowerQuestion.includes('founder') || lowerQuestion.includes('creator') || lowerQuestion.includes('who made') || lowerQuestion.includes('who created')) {
    return {
      answer: "Solar Tales was founded by Tanvir Rahman, a young passionate student who loves innovation, robotics and sustainability! He's also the founder and president of The White Hole organization, which has achieved many national glories.",
      followUp: "Want to learn more about the development of Solar Tales or The White Hole's other achievements?",
      interestingFact: "The idea for Solar Tales came from wanting to make space science as exciting as it really is!",
      recommendation: { title: "Read our story", link: "/about" }
    };
  }
  
  if (lowerQuestion.includes('white hole') || lowerQuestion.includes('organization')) {
    return {
      answer: "The White Hole is an organization founded and led by Tanvir Rahman! It focuses on innovation, robotics, and sustainability projects. The team has earned many national glories through their various projects and initiatives.",
      followUp: "Would you like to know more about their projects, achievements, or how they're changing the world?",
      interestingFact: "The White Hole combines science education with real-world innovation to inspire the next generation!",
      recommendation: { title: "Explore our projects", link: "/about" }
    };
  }
  
  return {
    answer: "Space weather is all about the amazing things that happen when energy and particles from our Sun travel through space! This includes solar flares, beautiful auroras, and invisible magnetic storms that can affect technology on Earth.",
    followUp: "What aspect of space weather interests you most - solar flares, auroras, or how it affects Earth?",
    interestingFact: "Space weather happens 93 million miles away from Earth, but it can still affect us here!",
    recommendation: { title: "Start Your Space Weather Journey", link: "/learn" }
  };
}

export async function POST(request: NextRequest) {
  let question: string = '';
  
  try {
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, { windowMs: 60000, maxRequests: 10 });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait before asking another question.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const { question: requestQuestion, conversationHistory = [] } = await request.json();
    question = requestQuestion;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const inappropriateWords = ['hate', 'violence', 'harm', 'kill', 'suicide', 'drug'];
    const lowerQuestion = question.toLowerCase();
    const hasInappropriateContent = inappropriateWords.some(word => lowerQuestion.includes(word));

    if (hasInappropriateContent) {
      return NextResponse.json({
        success: true,
        answer: "I'm here to help you learn about space weather and solar science! Let's keep our conversation focused on the amazing world of space phenomena. What would you like to know about the Sun, solar flares, or auroras?",
        followUp: "What aspect of space weather interests you most?",
        interestingFact: "The Sun produces enough energy every second to power Earth for 500,000 years!"
      });
    }

    const conversationLog = {
      timestamp: new Date().toISOString(),
      clientHash: clientId,
      question: question.substring(0, 500),
      conversationLength: conversationHistory.length
    };
    console.log('Ask AI Request:', conversationLog);

    let response = findBestResponse(question);

    if (!response) {
      try {
        response = await generateAIResponse(question, conversationHistory);
      } catch (error) {
        console.error('All AI models failed, using intelligent fallback:', error);
        response = generateIntelligentFallback(question);
      }
    }

    if (!response.interestingFact) {
      response.interestingFact = interestingFacts[Math.floor(Math.random() * interestingFacts.length)];
    }

    if (!response.followUp) {
      response.followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    }

    return NextResponse.json({
      success: true,
      ...response
    }, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    });

  } catch (error) {
    console.error('Error in ask-ai API:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not configured');
    }
    
    const fallbackResponse = generateIntelligentFallback(
      question || 'space weather'
    );
    
    return NextResponse.json({
      success: true,
      ...fallbackResponse
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SolarTales Ask AI endpoint',
    endpoints: {
      'POST /api/ask-ai': 'Submit a question to the AI assistant'
    }
  });
}
