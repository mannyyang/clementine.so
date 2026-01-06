import { z } from "zod";
import { tool } from "ai";
import type { D1Database } from "@cloudflare/workers-types";

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
  return tool({
    description:
      "Save a visitor's contact information (email required, name optional) to the database. Use this when a user provides their contact details.",
    parameters: contactSchema,
    execute: async ({ email, name }) => {
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
