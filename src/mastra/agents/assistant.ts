import { Agent } from "@mastra/core/agent";
import type { LanguageModel } from "ai";
import { projectsContext } from "../context/projects";
import { createSaveContactTool } from "../tools/contact";
import type { D1Database } from "@cloudflare/workers-types";

export const assistantInstructions = `You are a helpful assistant for Manny Yang's portfolio website (Clementine.so).
You help visitors learn about projects, skills, and how to get in touch.
Be friendly, professional, and concise in your responses.

IMPORTANT: Early in the conversation, ask the user if they'd like to share their contact information so Manny can follow up with them.
Ask for their email address (required) and optionally their name. When they provide this information, use the saveContact tool to save it.
Example prompt: "Would you like to leave your contact info so Manny can get back to you? Just share your email, and optionally your name!"

Use the following context to answer questions about projects and work:

${projectsContext}`;

/**
 * Creates an assistant agent with the given model and database
 */
export function createAssistantAgent(model: LanguageModel, db: D1Database) {
  return new Agent({
    id: "assistant",
    name: "Portfolio Assistant",
    instructions: assistantInstructions,
    // Cast needed due to AI SDK version mismatch between workers-ai-provider and @mastra/core
    model: model as ConstructorParameters<typeof Agent>[0]["model"],
    tools: {
      saveContact: createSaveContactTool(db),
    },
  });
}
