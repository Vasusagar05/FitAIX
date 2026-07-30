// services/openaiService.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Generate a plan or response using OpenAI.
 * If the API key is missing, returns a static placeholder string.
 */
export async function generatePlan(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return 'OpenAI API key not configured. This is a placeholder response.';
  }
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });
    return completion.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (error) {
    console.error('OpenAI error:', error);
    return 'Error contacting OpenAI service.';
  }
}
