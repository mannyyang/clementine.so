/**
 * Custom provider for OpenAI's gpt-oss models on Cloudflare Workers AI
 * These models use the Responses API format (instructions + input) instead of messages
 * Compatible with AI SDK v6 (LanguageModelV2)
 */
import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2CallWarning,
  LanguageModelV2Content,
  LanguageModelV2FinishReason,
  LanguageModelV2StreamPart,
  LanguageModelV2Usage,
} from "@ai-sdk/provider";

type GptOssModelId = "@cf/openai/gpt-oss-120b" | "@cf/openai/gpt-oss-20b";

interface GptOssProviderSettings {
  binding: Ai;
  gateway?: GatewayOptions;
}

// Response format can vary - handle multiple structures
interface GptOssResponse {
  // Standard Workers AI format
  response?: string;
  // OpenAI Responses API format
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  // Alternative nested format
  message?: {
    content?: string;
  };
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

function extractText(response: GptOssResponse): string {
  // Try standard Workers AI format first
  if (response.response) {
    return response.response;
  }
  // Try OpenAI Responses API format - skip reasoning outputs, find message outputs
  if (response.output && Array.isArray(response.output)) {
    // First pass: look for "message" type items with "output_text" content
    for (const item of response.output) {
      // Skip reasoning type outputs
      if (item.type === "reasoning") continue;

      if (item.content && Array.isArray(item.content)) {
        for (const contentItem of item.content) {
          // Skip reasoning_text, only get output_text
          if (contentItem.type === "output_text" && contentItem.text) {
            return contentItem.text;
          }
        }
      }
    }
    // Fallback: if no output_text found, try any text (but still skip reasoning)
    for (const item of response.output) {
      if (item.type === "reasoning") continue;
      if (item.content && Array.isArray(item.content)) {
        for (const contentItem of item.content) {
          if (contentItem.type !== "reasoning_text" && contentItem.text) {
            return contentItem.text;
          }
        }
      }
    }
  }
  // Try nested message format
  if (response.message?.content) {
    return response.message.content;
  }
  return "";
}

export function createGptOssModel(
  modelId: GptOssModelId,
  settings: GptOssProviderSettings
): LanguageModelV2 {
  return {
    specificationVersion: "v2",
    provider: "cloudflare-gpt-oss",
    modelId,
    supportedUrls: {},

    async doGenerate(options: LanguageModelV2CallOptions): Promise<{
      content: Array<LanguageModelV2Content>;
      finishReason: LanguageModelV2FinishReason;
      usage: LanguageModelV2Usage;
      warnings: Array<LanguageModelV2CallWarning>;
    }> {
      const { prompt } = options;

      // Convert AI SDK prompt to gpt-oss format
      let systemInstruction = "";
      let userInput = "";

      for (const message of prompt) {
        if (message.role === "system") {
          systemInstruction += message.content + "\n";
        } else if (message.role === "user") {
          for (const part of message.content) {
            if (part.type === "text") {
              userInput += part.text + "\n";
            }
          }
        } else if (message.role === "assistant") {
          for (const part of message.content) {
            if (part.type === "text") {
              userInput += `Assistant: ${part.text}\n`;
            }
          }
        }
      }

      console.log("[gpt-oss doGenerate] Input:", { systemInstruction: systemInstruction.slice(0, 100), userInput });

      const response = (await settings.binding.run(
        modelId,
        {
          instructions: systemInstruction.trim(),
          input: userInput.trim(),
          reasoning: { effort: "low" }, // Minimize reasoning tokens in output
        },
        settings.gateway ? { gateway: settings.gateway } : undefined
      )) as GptOssResponse;

      console.log("[gpt-oss doGenerate] Response:", JSON.stringify(response));

      const text = extractText(response);

      const inputTokens = response?.usage?.input_tokens ?? response?.usage?.prompt_tokens ?? 0;
      const outputTokens = response?.usage?.output_tokens ?? response?.usage?.completion_tokens ?? 0;

      return {
        content: [{ type: "text", text }],
        finishReason: "stop",
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
        warnings: [],
      };
    },

    async doStream(options: LanguageModelV2CallOptions): Promise<{
      stream: ReadableStream<LanguageModelV2StreamPart>;
    }> {
      const { prompt } = options;

      // Convert AI SDK prompt to gpt-oss format
      let systemInstruction = "";
      let userInput = "";

      for (const message of prompt) {
        if (message.role === "system") {
          systemInstruction += message.content + "\n";
        } else if (message.role === "user") {
          for (const part of message.content) {
            if (part.type === "text") {
              userInput += part.text + "\n";
            }
          }
        } else if (message.role === "assistant") {
          for (const part of message.content) {
            if (part.type === "text") {
              userInput += `Assistant: ${part.text}\n`;
            }
          }
        }
      }

      console.log("[gpt-oss doStream] Input:", { systemInstruction: systemInstruction.slice(0, 100), userInput });

      // gpt-oss doesn't support streaming natively, so we simulate it
      const response = (await settings.binding.run(
        modelId,
        {
          instructions: systemInstruction.trim(),
          input: userInput.trim(),
          reasoning: { effort: "low" }, // Minimize reasoning tokens in output
        },
        settings.gateway ? { gateway: settings.gateway } : undefined
      )) as GptOssResponse;

      console.log("[gpt-oss doStream] Response:", JSON.stringify(response));

      const text = extractText(response);
      const textId = crypto.randomUUID().slice(0, 16);

      // Simulate streaming by emitting the full text in chunks with delays
      const inputTokens = response?.usage?.input_tokens ?? response?.usage?.prompt_tokens ?? 0;
      const outputTokens = response?.usage?.output_tokens ?? response?.usage?.completion_tokens ?? 0;

      const stream = new ReadableStream<LanguageModelV2StreamPart>({
        async start(controller) {
          // Stream start
          controller.enqueue({
            type: "stream-start",
            warnings: [],
          });

          // Text start
          controller.enqueue({
            type: "text-start",
            id: textId,
          });

          // Emit text in chunks with small delays to simulate streaming
          const chunkSize = 15; // Smaller chunks for smoother appearance
          const delayMs = 10; // Small delay between chunks

          for (let i = 0; i < text.length; i += chunkSize) {
            controller.enqueue({
              type: "text-delta",
              id: textId,
              delta: text.slice(i, i + chunkSize),
            });
            // Add small delay between chunks for visual streaming effect
            if (i + chunkSize < text.length) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
          }

          // Text end
          controller.enqueue({
            type: "text-end",
            id: textId,
          });

          // Finish
          controller.enqueue({
            type: "finish",
            finishReason: "stop",
            usage: {
              inputTokens,
              outputTokens,
              totalTokens: inputTokens + outputTokens,
            },
          });

          controller.close();
        },
      });

      return { stream };
    },
  };
}
