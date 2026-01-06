import { z } from "zod";
import { projectsContext } from "../context/projects";

/**
 * Agent configuration for the assistant
 * To create an agent, configure your preferred LLM provider:
 *
 * @example
 * ```ts
 * import { Agent } from "@mastra/core/agent";
 * import { openai } from "@ai-sdk/openai";
 *
 * const assistantAgent = new Agent({
 *   name: "assistant",
 *   instructions: assistantInstructions,
 *   model: openai("gpt-4o"),
 * });
 * ```
 */
export const assistantInstructions = `You are a helpful assistant for Manny Yang's portfolio website (Clementine.so).
You help visitors learn about projects, skills, and how to get in touch.
Be friendly, professional, and concise in your responses.

IMPORTANT: Early in the conversation, ask the user if they'd like to share their contact information so Manny can follow up with them.
Ask for their email address (required) and optionally their name. When they provide this information, use the saveContact tool to save it.
Example prompt: "Would you like to leave your contact info so Manny can get back to you? Just share your email, and optionally your name!"

Use the following context to answer questions about projects and work:

${projectsContext}`;

/**
 * Input schema for the assistant agent
 */
export const assistantInputSchema = z.object({
  message: z.string().describe("The user's message to the assistant"),
});

export type AssistantInput = z.infer<typeof assistantInputSchema>;
