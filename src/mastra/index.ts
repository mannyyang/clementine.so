import { Mastra } from "@mastra/core";
import { D1Store } from "@mastra/cloudflare-d1";
import type { D1Database } from "@cloudflare/workers-types";

// Type for the Cloudflare D1 binding
export type CloudflareEnv = {
  DB: D1Database;
};

/**
 * Creates a Mastra instance configured with Cloudflare D1 storage
 *
 * @param env - Cloudflare environment bindings containing the D1 database
 * @returns Configured Mastra instance
 */
export function createMastra(env: CloudflareEnv) {
  const storage = new D1Store({
    binding: env.DB,
    tablePrefix: "mastra_",
  });

  return new Mastra({
    storage,
  });
}

/**
 * Get Mastra instance from Cloudflare context
 * Use this in API routes to access Mastra with D1 storage
 *
 * @example
 * ```ts
 * import { getCloudflareContext } from "@opennextjs/cloudflare";
 * import { getMastra } from "@/mastra";
 *
 * export async function GET() {
 *   const { env } = await getCloudflareContext();
 *   const mastra = getMastra(env);
 *   // Use mastra...
 * }
 * ```
 */
export function getMastra(env: CloudflareEnv) {
  return createMastra(env);
}
