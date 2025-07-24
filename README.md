# clementine.so

A modern portfolio site built with Next.js 15, TypeScript, Tailwind CSS 4, and deployed to Cloudflare Workers using OpenNext.

## Tech Stack

- **Framework**: Next.js 15.3.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM 9.10.0

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building

```bash
# Standard Next.js build
pnpm build

# OpenNext build for Cloudflare
pnpm run opennext:build
```

### Deployment

```bash
# Deploy to Cloudflare Workers
pnpm run cf:deploy
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── hero.tsx     # Hero section
│   ├── about.tsx    # About section
│   ├── projects.tsx # Projects showcase
│   └── contact.tsx  # Contact section
└── lib/             # Utilities
```

## Features

- ✨ Single-page portfolio with smooth scrolling
- 🎨 Modern design with Tailwind CSS 4
- 🌙 Dark mode support (ready for implementation)
- 📱 Fully responsive
- ⚡ Deployed on Cloudflare's edge network
- 🎭 Smooth animations with Framer Motion

## Customization

1. Update personal information in the components
2. Replace placeholder project data in `src/components/projects.tsx`
3. Update social links in `src/components/contact.tsx`
4. Modify color scheme in `src/app/globals.css`