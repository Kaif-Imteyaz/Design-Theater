# Design Theater 

A benchmark platform for evaluating thinking authenticity in UI-generating AI agents.


## Tasks

Tasks are organized into three tiers:

- **Tier 1**: Structural Claims Verification
- **Tier 2**: Styling Claims Verification
- **Tier 3**: Functional/Interactive Claims Verification

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
