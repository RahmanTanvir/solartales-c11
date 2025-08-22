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
  }
};

// Interesting facts pool
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

// Follow-up questions
const followUpQuestions = [
  "What else would you like to explore - solar storms, space missions, or Earth's protection?",
  "Which topic interests you more - how we predict space weather, its effects on technology, or historical events?",
  "Want to learn about - astronaut experiences, satellite protection, or ground effects?",
  "Choose your adventure - time travel stories, real-time data, or educational activities?",
  "What fascinates you most - the Sun's behavior, Earth's magnetic field, or space exploration?",
  "Explore more about - aurora mysteries, solar flare predictions, or space weather on other planets?"
];

// Simple keyword matching function
function findBestResponse(question: string): AIResponse | null {
  const lowerQuestion = question.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(predefinedResponses)) {
    if (lowerQuestion.includes(keyword)) {
      return response;
    }
  }
  
  // Check for related terms
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

// Generate a contextual response using OpenRouter AI
async function generateAIResponse(question: string, conversationHistory: Message[]): Promise<AIResponse> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Build conversation context
    const context = conversationHistory
      .slice(-3) // Last 3 messages for context
      .map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a friendly AI assistant for SolarTales, an educational app about space weather for children ages 8-12. 

Your role:
- Answer questions about space weather, solar flares, auroras, geomagnetic storms, and related topics
- Use simple, engaging language with analogies kids can understand
- Be enthusiastic and encouraging about space science
- Keep responses concise but informative (2-3 sentences max)
- Always include a follow-up question to encourage further learning

Context from conversation:
${context}

Current question: ${question}

Please respond with a JSON object containing:
- answer: Your main response (2-3 sentences, age-appropriate)
- followUp: A follow-up question to encourage more exploration
- interestingFact: A fun, kid-friendly space weather fact
- recommendation: Optional object with {title, link} to suggest a SolarTales page (/learn, /stories, /time-travel, /data)

Example format:
{
  "answer": "Solar flares are like giant explosions on the Sun!...",
  "followUp": "Would you like to know how solar flares affect Earth?",
  "interestingFact": "Solar flares can be as powerful as billions of bombs!",
  "recommendation": {"title": "Explore Real-Time Space Weather", "link": "/learn"}
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'SolarTales - Ask AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for SolarTales, specializing in making space weather science fun and accessible for kids.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Try to parse JSON response
    try {
      const parsedResponse = JSON.parse(aiResponse);
      return {
        answer: parsedResponse.answer || aiResponse,
        followUp: parsedResponse.followUp,
        interestingFact: parsedResponse.interestingFact,
        recommendation: parsedResponse.recommendation
      };
    } catch {
      // If not JSON, use the response as answer
      return {
        answer: aiResponse,
        followUp: followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)],
        interestingFact: interestingFacts[Math.floor(Math.random() * interestingFacts.length)]
      };
    }

  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, { windowMs: 60000, maxRequests: 10 }); // 10 requests per minute

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

    const { question, conversationHistory = [] } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Basic content filtering for inappropriate content
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

    // Log conversation for improvement (anonymized)
    const conversationLog = {
      timestamp: new Date().toISOString(),
      clientHash: clientId,
      question: question.substring(0, 500), // Limit length for privacy
      conversationLength: conversationHistory.length
    };
    console.log('Ask AI Request:', conversationLog);

    // First try predefined responses for common questions
    let response = findBestResponse(question);

    // If no predefined response, generate with AI
    if (!response) {
      response = await generateAIResponse(question, conversationHistory);
    }

    // Add random interesting fact if not provided
    if (!response.interestingFact) {
      response.interestingFact = interestingFacts[Math.floor(Math.random() * interestingFacts.length)];
    }

    // Add random follow-up if not provided
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
    
    // Fallback response
    return NextResponse.json({
      success: true,
      answer: "That's a great question about space weather! Space weather includes all the amazing things that happen when energy and particles from our Sun travel through space and interact with Earth. It includes solar flares, coronal mass ejections, and the beautiful auroras!",
      followUp: "What specific part of space weather interests you most?",
      interestingFact: interestingFacts[Math.floor(Math.random() * interestingFacts.length)],
      recommendation: {
        title: "Explore our Space Weather Dashboard",
        link: "/learn"
      }
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
