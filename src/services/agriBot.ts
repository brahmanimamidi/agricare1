const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
console.log('GEMINI KEY:', import.meta.env.VITE_GEMINI_API_KEY)

export interface Message {
  role: 'user' | 'bot'
  content: string
}

export interface BotResponse {
  reply: string
}

export async function sendMessage(
  message: string,
  language: 'en' | 'hi' | 'te',
  chatHistory: Message[]
): Promise<BotResponse> {

  const langMap = {
    en: 'English',
    hi: 'Hindi',
    te: 'Telugu'
  }

  // Build contents array - NO system_instruction
  // Include system context as first user message instead
  const systemPrompt = `You are AgriBot, a friendly farming 
assistant for Indian farmers. Only answer questions about crops, 
soil, fertilizers, pesticides, diseases, weather, farming 
techniques, government schemes, and market prices.
If asked anything unrelated to farming, politely redirect.
Always respond in ${langMap[language]} language only.
Keep answers simple and farmer-friendly.`

  // Build conversation array
  const contents = []

  // Add system context as first exchange
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\nUnderstood?' }]
  })
  contents.push({
    role: 'model',
    parts: [{ text: 'Yes, I understand. I am AgriBot, ready to help Indian farmers!' }]
  })

  // Add chat history (last 8 messages only)
  const recentHistory = chatHistory.slice(-8)
  recentHistory.forEach(msg => {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })
  })

  // Add current message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  })

  console.log('Calling Gemini API...')
  console.log('API Key exists:', !!GEMINI_KEY)
  console.log('API Key prefix:', GEMINI_KEY?.substring(0, 8))

  let response
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            topP: 0.8,
            topK: 10
          }
        })
      }
    )

    if (response.status === 429) {
      throw new Error('AI service busy. Please wait and try again.')
    }
    if (response.status === 401) {
      throw new Error('API key invalid. Please check configuration.')
    }
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Could not parse JSON response from Gemini.');
    }

    // console.log('Status:', response.status)
    // console.log('Data:', JSON.stringify(data))

    if (data.error) {
      throw new Error(data.error?.message || 'API error ' + response.status)
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini')
    }

    return {
      reply: data.candidates[0].content.parts[0].text
    }

  } catch (error: any) {
    console.error('Fetch failed:', error.message)
    throw error;
  }
}
