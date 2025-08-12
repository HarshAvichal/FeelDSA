import OpenAI from 'openai';

// This function is an Express route handler
const tutorHandler = async (req, res) => {
  try {
    const { userQuestion, context } = req.body;

    // IMPORTANT: Use process.env for server-side environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4';
    const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 1500;
    const temperature = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7;

    if (!apiKey) {
      console.error('OpenAI API key is not configured.');
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured.',
        message: 'Please configure your OpenAI API key in the .env file.'
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Format context for better AI understanding
    const formattedArrayState = context.arrayState && context.arrayState.length > 0 
      ? context.arrayState.map(item => (item ? item.value : 'empty')).join(', ')
      : 'No array data available';

    const formattedHighlightedValue = context.highlightedIndex >= 0 && context.arrayState && context.arrayState[context.highlightedIndex]
      ? `Index ${context.highlightedIndex} (Value: ${context.arrayState[context.highlightedIndex].value})`
      : 'None';

    const currentStep = context.stepIndex !== undefined ? context.stepIndex + 1 : 'Unknown';
    const currentTopic = context.currentTopic || 'General DSA';
    const operationDescription = context.operationDescription || 'No specific operation';

    const systemPrompt = `You are an expert Data Structures and Algorithms tutor with deep knowledge of computer science concepts. You are helping a student learn DSA concepts through visual learning and interactive demonstrations.

Current Learning Context:
- Topic: ${currentTopic}
- Current Step: ${currentStep}
- Data Structure State: [${formattedArrayState}]
- Highlighted Element: ${formattedHighlightedValue}
- Current Operation: ${operationDescription}

Your Role:
1. Provide clear, step-by-step explanations that build understanding
2. Use the current context to give relevant, personalized answers
3. Explain concepts in simple terms first, then add complexity
4. Give practical examples and real-world applications when relevant
5. Encourage critical thinking and problem-solving skills
6. Keep responses concise but comprehensive (aim for 2-4 paragraphs)
7. If the student is stuck on a specific step, help them understand why that step is necessary

Teaching Style:
- Be encouraging and patient
- Use analogies when helpful
- Break down complex concepts into digestible parts
- Ask follow-up questions to check understanding
- Provide hints rather than direct answers when possible

Remember: You're not just giving answers, you're teaching the student to think like a computer scientist.`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userQuestion
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = response.choices[0].message.content;
    
    // Log successful API calls for monitoring
    console.log(`AI Tutor Response - Topic: ${currentTopic}, Step: ${currentStep}, Tokens Used: ${response.usage?.total_tokens || 'Unknown'}`);
    
    res.status(200).json({ 
      response: aiResponse,
      usage: {
        total_tokens: response.usage?.total_tokens,
        prompt_tokens: response.usage?.prompt_tokens,
        completion_tokens: response.usage?.completion_tokens
      }
    });

  } catch (error) {
    console.error('Error in tutor API endpoint:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An error occurred while processing your request.';
    let statusCode = 500;
    
    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your account limits.';
      statusCode = 429;
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
      statusCode = 401;
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      statusCode = 429;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
      statusCode = 408;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default tutorHandler; 