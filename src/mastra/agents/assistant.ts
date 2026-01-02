import { z } from "zod";

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
export const assistantInstructions = `You are a helpful assistant for Clementine's portfolio website.
You help visitors learn about projects, skills, and how to get in touch.
Be friendly, professional, and concise in your responses.`;

/**
 * Input schema for the assistant agent
 */
export const assistantInputSchema = z.object({
  message: z.string().describe("The user's message to the assistant"),
});

export type AssistantInput = z.infer<typeof assistantInputSchema>;
