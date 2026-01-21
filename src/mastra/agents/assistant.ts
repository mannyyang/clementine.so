import { Agent } from "@mastra/core/agent";
import type { LanguageModel } from "ai";
import type { Memory } from "@mastra/memory";
import { projectsContext } from "../context/projects";
import { createSaveContactTool } from "../tools/contact";
import type { D1Database } from "@cloudflare/workers-types";

export const assistantInstructions = `You are a helpful assistant for Manuel Yang's portfolio website (Clementine.so).
You help visitors learn about projects, skills, and how to get in touch.
Be friendly, professional, and concise in your responses.

IMPORTANT - SAVING CONTACT INFORMATION:
When a user provides their email address (and optionally their name), you MUST use the saveContact tool to save their information.
Do NOT just say you saved it - actually call the saveContact tool with the email and name.
Example: If user says "my email is john@example.com", call saveContact with {"email": "john@example.com"}.
Example: If user says "I'm Jane Smith, jane@test.com", call saveContact with {"email": "jane@test.com", "name": "Jane Smith"}.

RESPONDING TO "Tell me more about [Project]":
When a user asks to learn more about a specific project, provide a detailed response that includes:
1. A 2-3 sentence expanded description of what the project does and the problem it solves
2. Key features or capabilities
3. The tech stack used
4. Your role in the project
5. End with an invitation to visit the site or ask follow-up questions

Keep the tone conversational and enthusiastic about the work.

Use the following context to answer questions about projects and work:

${projectsContext}`;

/**
 * Creates an assistant agent with the given model, database, and memory
 */
export function createAssistantAgent(model: LanguageModel, db: D1Database, memory?: Memory) {
  return new Agent({
    id: "assistant",
    name: "Portfolio Assistant",
    instructions: assistantInstructions,
    // Cast needed due to AI SDK version mismatch between workers-ai-provider and @mastra/core
    model: model as ConstructorParameters<typeof Agent>[0]["model"],
    tools: {
      saveContact: createSaveContactTool(db),
    },
    memory,
  });
}
