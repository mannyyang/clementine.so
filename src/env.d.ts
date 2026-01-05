/* eslint-disable no-undef, no-unused-vars */
/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare environment bindings
 * Run `npx wrangler types` to regenerate this file
 */
interface CloudflareEnv {
  /** Cloudflare D1 database for Mastra storage */
  DB: D1Database;
  /** Static assets binding */
  ASSETS: Fetcher;
  /** Cloudflare Workers AI binding */
  AI: Ai;
}

declare global {
  interface Env extends CloudflareEnv {}
}

export {};
