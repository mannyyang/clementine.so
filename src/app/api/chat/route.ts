/// <reference path="../../../../worker-configuration.d.ts" />
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { runWithTools } from "@cloudflare/ai-utils";
import type { RoleScopedChatInput } from "@cloudflare/workers-types";
import { assistantInstructions } from "@/mastra/agents/assistant";

export const runtime = "nodejs";

// Helper to extract email and name from message text
function extractContactInfo(text: string): { email: string; name?: string } | null {
  // Email regex pattern
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (!emailMatch) return null;

  const email = emailMatch[0].toLowerCase();

  // Try to extract name - look for common patterns
  let name: string | undefined;

  // Pattern: "my name is X" or "I'm X" or "I am X"
  const nameMatch = text.match(/(?:my name is|i'm|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch) {
    name = nameMatch[1];
  } else {
    // Pattern: "X here" or just capitalized words before email mention
    const beforeEmail = text.substring(0, text.indexOf(email));
    const capitalizedWords = beforeEmail.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g);
    if (capitalizedWords && capitalizedWords.length > 0) {
      // Take the last match as it's likely the name
      name = capitalizedWords[capitalizedWords.length - 1];
    }
  }

  return { email, name };
}

export async function POST(request: Request) {
  // eslint-disable-next-line no-undef
  const { env } = (await getCloudflareContext()) as unknown as { env: Env };
  const { messages } = (await request.json()) as {
    messages: UIMessage[];
    threadId: string;
    resourceId: string;
  };

  // Convert UI messages to Workers AI format
  const workersMessages: RoleScopedChatInput[] = [
    { role: "system", content: assistantInstructions },
    ...messages.map((msg) => {
      // AI SDK v6 uses 'parts' array with { type: "text", text: "..." } format
      const content = (msg.parts || [])
        .filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .filter(Boolean)
        .join("\n");

      return {
        role: msg.role as "user" | "assistant",
        content: content || "(empty message)",
      };
    }),
  ];

  // Check if the last user message contains contact info and save it
  const lastUserMessage = messages.filter(m => m.role === "user").pop();
  if (lastUserMessage) {
    const lastUserContent = lastUserMessage.parts
      ?.filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .join(" ") || "";

    const contactInfo = extractContactInfo(lastUserContent);
    if (contactInfo) {
      try {
        await env.DB
          .prepare("INSERT INTO contacts (email, name) VALUES (?, ?)")
          .bind(contactInfo.email, contactInfo.name || null)
          .run();
        console.log("Contact saved:", contactInfo);
      } catch {
        // Might fail on duplicate email, that's ok
        console.log("Contact save skipped (may already exist):", contactInfo.email);
      }
    }
  }

  // Define tools for runWithTools
  const tools = [
    {
      name: "saveContact",
      description:
        "Save a visitor's contact information (email required, name optional) to the database. Use this when a user provides their contact details.",
      parameters: {
        type: "object" as const,
        properties: {
          email: {
            type: "string",
            description: "The user's email address",
          },
          name: {
            type: "string",
            description: "The user's name (optional)",
          },
        },
        required: ["email"],
      },
      function: async ({ email, name }: { email: string; name?: string }) => {
        try {
          await env.DB
            .prepare("INSERT INTO contacts (email, name) VALUES (?, ?)")
            .bind(email, name || null)
            .run();

          return name
            ? `Thanks ${name}! Your contact information has been saved.`
            : "Thanks! Your contact information has been saved.";
        } catch (error) {
          console.error("Failed to save contact:", error);
          return "Sorry, there was an issue saving your contact information. Please try again.";
        }
      },
    },
  ];

  // Use runWithTools with streaming
  const response = await runWithTools(
    // @ts-expect-error - Type mismatch between workers-types versions
    env.AI,
    "@cf/qwen/qwen3-30b-a3b-fp8",
    {
      messages: workersMessages,
      tools,
    },
    {
      streamFinalResponse: true,
      maxRecursiveToolRuns: 2,
      verbose: true,
    }
  );

  // Generate a unique ID for the text part
  const textId = `text-${Date.now()}`;

  // Handle streaming response
  if (response instanceof ReadableStream) {
    const uiMessageStream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const reader = response.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Start text
        writer.write({ type: "text-start", id: textId });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete lines from buffer
          const lines = buffer.split("\n");
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]" || !data) continue;
              try {
                const parsed = JSON.parse(data);
                // Handle both Workers AI format and OpenAI format
                const text = parsed.response || parsed.choices?.[0]?.delta?.content;
                if (text) {
                  writer.write({ type: "text-delta", id: textId, delta: text });
                }
              } catch {
                // Skip invalid JSON - don't write raw data
              }
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.startsWith("data: ")) {
          const data = buffer.slice(6).trim();
          if (data && data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              const text = parsed.response || parsed.choices?.[0]?.delta?.content;
              if (text) {
                writer.write({ type: "text-delta", id: textId, delta: text });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }

        // End text
        writer.write({ type: "text-end", id: textId });
      },
      onError: (error) => {
        console.error("Stream error:", error);
        return error instanceof Error ? error.message : "Unknown error";
      },
    });

    return createUIMessageStreamResponse({ stream: uiMessageStream });
  }

  // Handle non-streaming response (fallback)
  const textResponse = typeof response === "string"
    ? response
    : (response as { response?: string }).response || JSON.stringify(response);

  const uiMessageStream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: textResponse });
      writer.write({ type: "text-end", id: textId });
    },
    onError: (error) => {
      console.error("Stream error:", error);
      return error instanceof Error ? error.message : "Unknown error";
    },
  });

  return createUIMessageStreamResponse({ stream: uiMessageStream });
}
