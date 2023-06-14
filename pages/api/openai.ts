import type { NextApiRequest, NextApiResponse } from 'next';
import openai from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return;

  const { ingredient } = req.query;

  if (typeof ingredient !== 'string') return;

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Content-Encoding': 'none',
  });

  try {
    console.log('generating');
    const openaiRes = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Generate a recipe that uses ${ingredient}.`,
        },
      ],
      max_tokens: 50,
      temperature: 1,
      stream: true,
    }, { responseType: 'stream' });

    // @ts-ignore
    openaiRes.data.on('data', (data) => {
      const lines = data.toString().split('\n').filter((line: string) => line.trim() !== '');
      // eslint-disable-next-line no-restricted-syntax
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          res.end('data: [DONE]\n\n');
          return; // Stream finished
        }
        try {
          const parsed = JSON.parse(message);
          const { content } = parsed.choices[0].delta;
          if (content) res.write(`data: ${content.replaceAll('\n', '<br />')}\n\n`);
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }
    });
  } catch (error: any) {
    if (error.response?.status) {
      console.error(error.response.status, error.message);
      error.response.data.on('data', (data: any) => {
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          console.error('An error occurred during OpenAI request: ', parsed);
        } catch (parseError) {
          console.error('An error occurred during OpenAI request: ', message);
        }
      });
    } else {
      console.error('An error occurred during OpenAI request', error);
    }
  }
}
