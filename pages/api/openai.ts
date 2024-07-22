import OpenAIStream from '@/lib/openai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { ingredient } = await req.json();

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Generate a recipe with that uses ${ingredient}.`,
      },
    ],
    temperature: 1,
    max_tokens: 500,
    stream: true,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
