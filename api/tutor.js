import OpenAI from 'openai';

// This function is an Express route handler
const tutorHandler = async (req, res) => {
  try {
    const { userQuestion, context } = req.body;

    // IMPORTANT: Use process.env for server-side environment variables
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    const model = process.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

    if (!apiKey) {
      console.error('OpenAI API key is not configured.');
      return res.status(500).json({ message: 'OpenAI API key is not configured.' });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const formattedArrayState = context.arrayState.map(item => (item ? item.value : 'empty')).join(', ');
    const formattedHighlightedValue = context.highlightedIndex >= 0 && context.arrayState[context.highlightedIndex]
      ? `Index ${context.highlightedIndex} (Value: ${context.arrayState[context.highlightedIndex].value})`
      : 'None';

    const systemPrompt = `You are an expert Data Structures and Algorithms tutor. You are helping a student learn DSA concepts through visual learning.

Current Context:
- Topic: ${context.currentTopic}
- Current Step: ${context.stepIndex + 1}
- Data Structure State: [${formattedArrayState}]
- Highlighted Element: ${formattedHighlightedValue}
- Current Operation: ${context.operationDescription}

Instructions:
1. Provide clear, step-by-step explanations.
2. Use the current context to give relevant answers.
3. Keep responses concise and to the point.
`;

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
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content;
    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Error in tutor API endpoint:', error.message);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
};

export default tutorHandler; 