# 🍲 Rasam

> *Tell us nothing about food. We'll figure out the rest.*

Rasam is a mood-to-food ordering engine built on [Swiggy's MCP platform](https://mcp.swiggy.com/builders/developers/). Instead of opening Swiggy and scrolling endlessly, you answer 4 witty non-food questions. Claude reads your emotional state, names your mood, and surfaces matching dishes from Swiggy live — best coupon auto-applied. One tap to order.

**Built for Swiggy Builders Club.**

---

## Demo

| | |
|---|---|
| **Live** | Deploy on Vercel — see [Deploy](#deploy-on-vercel) |
| **GitHub** | [github.com/vandan09/Rasam](https://github.com/vandan09/Rasam) |
| **Status** | All 4 phases implemented — add API keys for live Swiggy |

---

## How It Works

```
4 witty questions (nothing about food)
        ↓
Claude Sonnet reads your emotional state
        ↓
Your mood is named — "Quietly unravelling"
        ↓
Swiggy dishes fetched that match the mood
        ↓
Best coupon auto-applied
        ↓
One tap to order
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| AI / Mood engine | Anthropic Claude Sonnet |
| Food APIs | Swiggy Food MCP server |
| State | Zustand |
| Deployment | Vercel |

---

## Run Locally

### Prerequisites

- Node.js 18+
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)
- Swiggy MCP API key → [mcp.swiggy.com/builders/access](https://mcp.swiggy.com/builders/access)

### Setup

```bash
git clone https://github.com/vandan09/Rasam.git
cd Rasam
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verify APIs (Phase 1)

```bash
npm run verify
```

### Full flow test (requires dev server)

```bash
npm run dev          # terminal 1
npm run test:e2e     # terminal 2 — tests all API routes end-to-end
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_key_here
SWIGGY_MCP_API_KEY=your_swiggy_mcp_key_here
SWIGGY_MCP_BASE_URL=https://mcp.swiggy.com/food

# Mock Swiggy when key is missing (default: auto)
USE_SWIGGY_MOCK=true

# Real Swiggy orders — only when access is approved
ENABLE_REAL_ORDERS=false

NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Without keys:** the app runs in demo mode with mock dishes and deterministic mood labels. Safe for development and demo recording.

**With Swiggy access:** set `USE_SWIGGY_MOCK=false` and add your key. Set `ENABLE_REAL_ORDERS=true` only when you intend to place real orders.

---

## Project Structure

```
rasam/
├── app/
│   ├── page.tsx              # Landing
│   ├── quiz/page.tsx         # 4-question mood quiz
│   ├── reveal/page.tsx       # Mood reveal + share
│   ├── results/page.tsx      # Dishes + order
│   └── api/                  # mood, search, coupons, cart, order, history
├── components/ui/            # QuestionCard, MoodReveal, DishCard, etc.
├── lib/
│   ├── swiggy.ts             # Swiggy MCP client (+ mock mode)
│   ├── claude.ts             # Mood interpretation
│   ├── questions.ts          # Fixed quiz questions
│   └── types.ts
└── store/quiz-store.ts       # Zustand state
```

---

## Deploy on Vercel

1. Import [github.com/vandan09/Rasam](https://github.com/vandan09/Rasam) in Vercel
2. Add environment variables from `.env.example`
3. Deploy — `vercel --prod` or push to `main`

---

## Roadmap

- [x] Phase 1 — Project setup + API verification
- [x] Phase 2 — Core quiz → mood → food → order flow
- [x] Phase 3 — Order history personalisation + share + polish
- [x] Phase 4 — Demo prep + deployment config

---

## Built By

**Vandan** — Solo developer
