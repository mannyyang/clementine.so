import { defineCloudflareConfig } from "@opennextjs/cloudflare"

export default defineCloudflareConfig({
  // Simple configuration for a static portfolio site
  enableCacheInterception: false,
  buildCommand: "next build",
})