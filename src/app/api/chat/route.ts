/// <reference path="../../../../worker-configuration.d.ts" />
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createWorkersAI } from "workers-ai-provider";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { toAISdkStream } from "@mastra/ai-sdk";
import { D1Store } from "@mastra/cloudflare-d1";
import { Memory } from "@mastra/memory";
import { createAssistantAgent } from "@/mastra/agents/assistant";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // eslint-disable-next-line no-undef
  const { env } = (await getCloudflareContext()) as unknown as { env: Env };
  const { messages, threadId, resourceId } = (await request.json()) as {
    messages: UIMessage[];
    threadId: string;
    resourceId: string;
  };

  // Initialize D1 storage and memory
  const storage = new D1Store({ id: "d1-storage", binding: env.DB });
  await storage.init();

  const memory = new Memory({ storage });

  const workersai = createWorkersAI({ binding: env.AI });
  // Use Llama 3.1 70b for better reasoning and context following
  const model = workersai("@cf/meta/llama-3.1-70b-instruct");

  const agent = createAssistantAgent(model, env.DB, memory);

  const mastraStream = await agent.stream(
    messages as Parameters<typeof agent.stream>[0],
    {
      maxSteps: 3,
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    }
  );

  // Convert Mastra stream to AI SDK format using the writer pattern
  const uiMessageStream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      try {
        const stream = toAISdkStream(mastraStream, { from: "agent" });
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);
        }
      } catch (error) {
        console.error("Stream error:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("UI Message Stream error:", error);
      return error instanceof Error ? error.message : "Unknown error";
    },
  });

  return createUIMessageStreamResponse({ stream: uiMessageStream });
}
