import OpenAI from 'openai'

// This file is now only used for generating step explanations,
// as the AI Tutor chat has been moved to a secure backend API.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const generateStepExplanation = async (topic, stepIndex, operation, arrayState) => {
  try {
    const arrayValues = arrayState.map(item => item ? item.value : 'empty').join(', ');
    const prompt = `Explain step ${stepIndex + 1} of ${topic} algorithm. 
    
Current operation: ${operation}
Array state: [${arrayValues}]

Provide a clear, concise explanation of what's happening in this step and why it's important.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a DSA tutor explaining algorithm steps. Be concise and clear."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error generating step explanation:', error)
    return operation
  }
} 