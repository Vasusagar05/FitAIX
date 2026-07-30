import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

/**
 * Perform a chat completion request to Groq LLM API.
 * Uses native https module for maximum compatibility and zero dependencies.
 */
export async function getGroqChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('YOUR_')) {
    console.warn('Groq API Key not set. Using fallback simulation.');
    return '';
  }

  const postData = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    max_tokens: 1024
  });

  const options = {
    hostname: 'api.groq.com',
    port: 443,
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 8000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.message?.content;
            if (content) {
              resolve(content.trim());
            } else {
              reject(new Error('Invalid response structure from Groq API'));
            }
          } else {
            reject(new Error(`Groq API responded with status code ${res.statusCode}: ${data}`));
          }
        } catch (e: any) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to Groq API timed out'));
    });

    req.write(postData);
    req.end();
  });
}
