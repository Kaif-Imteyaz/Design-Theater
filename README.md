# Design Theater

A benchmark platform for evaluating thinking authenticity in UI-generating AI agents.

## Overview

Design Theater tests how different AI models approach UI design tasks by analyzing their thought processes and outputs. The platform presents 24 design tasks across 3 complexity tiers to various AI tools.

## Tasks

Tasks are organized into three tiers:

- **Tier 1** (8 tasks): Information Architecture - from simple business sites to complex multi-audience platforms
- **Tier 2** (8 tasks): Visual Design & Branding - from basic brand expression to complex multi-brand architecture
- **Tier 3** (8 tasks): Interaction Design - from simple booking flows to enterprise-scale platforms

## AI Models Evaluated

- ChatGPT (GPT-5 Thinking)
- Claude (Sonnet 4 Thinking)
- Firebase (Gemini 2.5 Pro)
- Bolt (v1 agent)
- v0 (Claude Haiku)

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Constraints

All AI-generated outputs follow these constraints:
- HTML, CSS, and JavaScript only (no frameworks or libraries)
- No web search or external tools
