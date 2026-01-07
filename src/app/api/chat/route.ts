/// <reference path="../../../../worker-configuration.d.ts" />
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createWorkersAI } from "workers-ai-provider";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { assistantInstructions } from "@/mastra/agents/assistant";
import { createSaveContactTool } from "@/mastra/tools/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // eslint-disable-next-line no-undef
  const { env } = (await getCloudflareContext()) as unknown as { env: Env };
  const { messages: uiMessages } = (await request.json()) as {
    messages: UIMessage[];
  };

  // Convert UI messages to model messages format
  const messages = await convertToModelMessages(uiMessages);

  const workersai = createWorkersAI({ binding: env.AI });
  const model = workersai("@cf/meta/llama-3.1-8b-instruct-fp8");

  const result = streamText({
    model,
    system: assistantInstructions,
    messages,
    tools: {
      saveContact: createSaveContactTool(env.DB),
    },
    maxSteps: 3,
  });

  return result.toUIMessageStreamResponse();
}
