import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export default async function OpenAIStream(payload: any) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const { data } = event;
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const { content } = parsed.choices[0].delta;
            if (content) {
              const queue = encoder.encode(content);
              controller.enqueue(queue);
            }
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);

      // eslint-disable-next-line no-restricted-syntax
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
