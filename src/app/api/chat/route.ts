/// <reference path="../../../../worker-configuration.d.ts" />
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createWorkersAI } from "workers-ai-provider";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { toAISdkStream } from "@mastra/ai-sdk";
import { createAssistantAgent } from "@/mastra/agents/assistant";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // eslint-disable-next-line no-undef
  const { env } = (await getCloudflareContext()) as unknown as { env: Env };
  const { messages } = (await request.json()) as {
    messages: UIMessage[];
  };

  const workersai = createWorkersAI({ binding: env.AI });
  const model = workersai("@cf/meta/llama-3.1-8b-instruct-fp8");

  const agent = createAssistantAgent(model, env.DB);

  const stream = await agent.stream(messages as Parameters<typeof agent.stream>[0], {
    maxSteps: 3,
  });

  const uiMessageStream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const aiStream = toAISdkStream(stream, { from: "agent" });
      const reader = aiStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);
        }
      } finally {
        reader.releaseLock();
      }
    },
  });

  return createUIMessageStreamResponse({
    stream: uiMessageStream,
  });
}
