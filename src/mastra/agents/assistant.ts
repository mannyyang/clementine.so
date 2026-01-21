import { Agent } from "@mastra/core/agent";
import type { LanguageModel } from "ai";
import type { Memory } from "@mastra/memory";
import { projectsContext } from "../context/projects";
import { createSaveContactTool } from "../tools/contact";
import type { D1Database } from "@cloudflare/workers-types";

export const assistantInstructions = `You are a helpful assistant for Manuel Yang's portfolio website (Clementine.so).
You help visitors learn about projects, skills, and how to get in touch.
Be friendly, professional, and concise in your responses.

RESPONDING TO "Tell me more about [Project]":
When a user asks to learn more about a specific project, provide a detailed response that includes:
1. A 2-3 sentence expanded description of what the project does and the problem it solves
2. Key features or capabilities
3. The tech stack used
4. Your role in the project
5. End with an invitation to visit the site or ask follow-up questions

Keep the tone conversational and enthusiastic about the work.

CONTACT COLLECTION:
After providing project details or answering substantive questions, naturally ask if they'd like to share their contact information so Manuel can follow up.
Ask for their email address (required) and optionally their name. When they provide this information, use the saveContact tool to save it.
Example: "Interested in working together? Share your email and I'll make sure Manuel reaches out!"

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
