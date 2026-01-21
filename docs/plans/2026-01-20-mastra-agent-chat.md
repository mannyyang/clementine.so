# Mastra Agent Chat Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace direct AI SDK `streamText` usage with Mastra's `Agent` class for the chat functionality.

**Architecture:** Create a Mastra Agent with the assistant instructions and tools, then use `agent.stream()` in the chat route. The agent wraps the Workers AI model and provides a structured way to manage tools, instructions, and future features like memory.

**Tech Stack:** @mastra/core v1.0.4, workers-ai-provider, @ai-sdk/react (frontend unchanged)

---

### Task 1: Convert Contact Tool to Mastra Format

**Files:**
- Modify: `src/mastra/tools/contact.ts`

**Step 1: Update imports**

Replace the AI SDK tool import with Mastra's createTool:

```typescript
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { D1Database } from "@cloudflare/workers-types";
```

**Step 2: Convert tool to Mastra format**

Replace `createSaveContactTool` function with:

```typescript
/**
 * Schema for contact information
 */
export const contactSchema = z.object({
  email: z.string().email().describe("The user's email address"),
  name: z.string().optional().describe("The user's name (optional)"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Creates a tool for saving contact information to D1 database
 */
export function createSaveContactTool(db: D1Database) {
  return createTool({
    id: "save-contact",
    description:
      "Save a visitor's contact information (email required, name optional) to the database. Use this when a user provides their contact details.",
    inputSchema: contactSchema,
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
    execute: async ({ context }) => {
      const { email, name } = context;
      try {
        await db
          .prepare("INSERT INTO contacts (email, name) VALUES (?, ?)")
          .bind(email, name || null)
          .run();

        return {
          success: true,
          message: name
            ? `Thanks ${name}! Your contact information has been saved.`
            : "Thanks! Your contact information has been saved.",
        };
      } catch (error) {
        console.error("Failed to save contact:", error);
        return {
          success: false,
          message:
            "Sorry, there was an issue saving your contact information. Please try again.",
        };
      }
    },
  });
}
```

**Step 3: Commit**

```bash
git add src/mastra/tools/contact.ts
git commit -m "refactor: convert contact tool to Mastra createTool format"
```

---

### Task 2: Create Mastra Agent

**Files:**
- Modify: `src/mastra/agents/assistant.ts`

**Step 1: Update imports and create agent factory**

Replace the entire file with:

```typescript
import { Agent } from "@mastra/core/agent";
import type { LanguageModelV1 } from "ai";
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
export function createAssistantAgent(model: LanguageModelV1, db: D1Database) {
  return new Agent({
    id: "assistant",
    name: "Portfolio Assistant",
    instructions: assistantInstructions,
    model,
    tools: {
      saveContact: createSaveContactTool(db),
    },
  });
}
```

**Step 2: Commit**

```bash
git add src/mastra/agents/assistant.ts
git commit -m "feat: create Mastra Agent factory for assistant"
```

---

### Task 3: Update Chat Route to Use Mastra Agent

**Files:**
- Modify: `src/app/api/chat/route.ts`

**Step 1: Update the chat route**

Replace the entire file with:

```typescript
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
```

**Step 2: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: use Mastra Agent for chat streaming"
```

---

### Task 4: Verify Build and Test Locally

**Step 1: Run TypeScript check**

```bash
pnpm run build
```

Expected: Build succeeds without type errors.

**Step 2: Start dev server and test chat**

```bash
pnpm dev
```

Open http://localhost:3100 and test the chat:
1. Send a greeting message
2. Ask about projects
3. Provide contact info to test the tool

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any issues from testing"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Convert tool to Mastra format | `src/mastra/tools/contact.ts` |
| 2 | Create Agent factory | `src/mastra/agents/assistant.ts` |
| 3 | Update chat route | `src/app/api/chat/route.ts` |
| 4 | Build and test | - |
