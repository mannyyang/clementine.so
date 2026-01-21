/**
 * Structured project data for UI components (cards, carousels, etc.)
 */
export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  screenshots: string[];
  techStack: string[];
  role: string;
  category: "product" | "client";
}

export const projects: Project[] = [
  {
    id: "checkify",
    name: "Checkify.so",
    tagline: "Notion todo aggregator",
    description:
      "Centralizes scattered Notion tasks into one unified database with automated discovery, bidirectional sync, and progress tracking.",
    url: "https://checkify.so",
    screenshots: ["/projects/placeholder.svg"],
    techStack: ["Nuxt", "Supabase", "Stripe", "Tailwind"],
    role: "Sole Developer/Founder",
    category: "product",
  },
  {
    id: "datatorag",
    name: "DatatoRAG.com",
    tagline: "Privacy-first RAG for HR",
    description:
      "Transforms scattered HR documentation into a queryable knowledge base with self-hosted AI models, Slack integration, and enterprise compliance.",
    url: "https://datatorag.com",
    screenshots: ["/projects/placeholder.svg"],
    techStack: ["PipesHub.ai", "AWS", "RAG Pipeline"],
    role: "Sole Developer/Founder",
    category: "product",
  },
  {
    id: "datagum",
    name: "Datagum.ai",
    tagline: "AI visibility monitoring",
    description:
      "Tracks how AI search engines cite your content and brands with citation monitoring, custom prompt testing, and visibility scoring.",
    url: "https://datagum.ai",
    screenshots: ["/projects/placeholder.svg"],
    techStack: ["OpenNext", "Cloudflare Workers", "D1"],
    role: "Sole Developer/Founder",
    category: "product",
  },
  {
    id: "mansoor",
    name: "MansoorLawFirm.com",
    tagline: "Estate & business planning law firm",
    description:
      "Professional website for a Los Angeles law firm specializing in estate planning and business law.",
    url: "https://mansoorlawfirm.com",
    screenshots: ["/projects/placeholder.svg"],
    techStack: ["Tailwind CSS", "Poppins", "Fira Code"],
    role: "Sole Developer",
    category: "client",
  },
  {
    id: "tammy",
    name: "TammyBordeosCoaching.com",
    tagline: "Executive coaching practice",
    description:
      "Website for an executive coaching and leadership development practice.",
    url: "https://tammybordeoscoaching.com",
    screenshots: ["/projects/placeholder.svg"],
    techStack: ["Web Development"],
    role: "Sole Developer",
    category: "client",
  },
];

/**
 * Project portfolio context for the AI assistant
 * This context is injected into the assistant's system prompt
 */
export const projectsContext = `
# Clementine.so - Project Portfolio

Clementine.so is the LLC that builds and maintains the following products and client projects.

---

## Active Products

### Checkify.so
**Status:** Active | **Role:** Sole Developer/Founder

Notion todo aggregator that centralizes scattered tasks into one unified database.

**Features:**
- Automated todo discovery across Notion workspace
- Bidirectional sync with source pages
- Hourly auto-sync + manual refresh
- Task filtering and progress tracking
- Free and paid tiers (Pro, Max)

**Tech Stack:**
- Frontend: Nuxt (Vue.js)
- Backend/Auth: Supabase
- Payments: Stripe
- Styling: Tailwind CSS

---

### DatatoRAG.com
**Status:** Active | **Role:** Sole Developer/Founder

Privacy-first RAG platform for HR departments. Transforms scattered HR documentation into a queryable knowledge base with guaranteed consistent answers and zero hallucinations.

**Features:**
- Self-hosted AI models (data never leaves company infrastructure)
- Slack-native interface
- HRIS integrations (Workday, Rippling, BambooHR, ADP)
- Document integrations (Google Drive, SharePoint, Box)
- Source citations and policy version control
- HIPAA, SOC2, data residency compliant
- 80% reduction in HR ticket volume

**Tech Stack:**
- Platform: PipesHub.ai - Open source workplace AI platform (alternative to Glean)
- Hosting: AWS
- Capabilities: Enterprise search, RAG pipeline, knowledge graphs, no-code AI agents

---

### Datagum.ai
**Status:** Active | **Role:** Sole Developer/Founder

AI visibility monitoring platform that tracks how AI search engines (especially ChatGPT) cite your content and brands.

**Features:**
- Citation monitoring for ChatGPT mentions
- Custom prompt testing with branded/generic queries
- Projects & monitors organization
- Auto Brand Book extraction
- Citation analytics with visibility scoring
- Free tools: Citation Analyzer, JSON-LD Schema Generator

**Pricing:** Free tier (1 site, 2 monitors, 50 prompts) | Pro $29/mo

**Tech Stack:**
- Framework: OpenNext
- Infrastructure: Cloudflare (Workers, D1, etc.)

---

## Completed Client Projects

### MansoorLawFirm.com
**Status:** Completed | **Role:** Sole Developer

Professional website for a Los Angeles estate & business planning law firm.

**Tech Stack:**
- Styling: Tailwind CSS v3.4.13
- Fonts: Poppins, Fira Code, Nothing You Could Do

---

### TammyBordeosCoaching.com
**Status:** Completed | **Role:** Sole Developer

Website for executive coaching and leadership development practice.

---

## Current Development (clementine.so)

This site serves as the main LLC portfolio and shared infrastructure. Currently includes:
- Mastra v1 with Cloudflare D1 storage
- AI chat interface with Cloudflare Workers AI
`;
