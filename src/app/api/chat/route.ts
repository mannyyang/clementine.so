/// <reference path="../../../../worker-configuration.d.ts" />
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createWorkersAI } from "workers-ai-provider";
import type { UIMessage } from "ai";
import { createAssistantAgent } from "@/mastra/agents/assistant";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { env } = (await getCloudflareContext()) as unknown as { env: Env };
  const { messages } = (await request.json()) as {
    messages: UIMessage[];
  };

  const workersai = createWorkersAI({ binding: env.AI });
  const model = workersai("@cf/meta/llama-3.1-8b-instruct-fp8");

  const agent = createAssistantAgent(model, env.DB);

  const result = await agent.stream(messages, {
    maxSteps: 3,
  });

  return result.toUIMessageStreamResponse();
}
