# 🍲 Rasam

> *Tell us nothing about food. We'll figure out the rest.*

Rasam is a mood-to-food ordering engine built on [Swiggy's MCP platform](https://mcp.swiggy.com/builders/developers/). Instead of opening Swiggy and scrolling endlessly, you answer 4 witty non-food questions. Claude reads your emotional state, names your mood, and surfaces matching dishes from Swiggy live — best coupon auto-applied. One tap to order.

**Built for Swiggy Builders Club.**

---

## The Problem

Every food app has a recommendation engine. None of them actually understand *why* you can't decide. Scroll paralysis isn't a menu problem — it's a mood problem. Rasam solves the feeling, not just the food.

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

The magic moment: the AI names your mood accurately before showing any food. That's what people screenshot.

---

## Status

🚧 **Active development** — demo and live link coming soon.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| AI / Mood engine | Anthropic Claude Sonnet (`claude-sonnet-4-6`) |
| Food APIs | Swiggy Food MCP server |
| State | Zustand |
| Deployment | Vercel |

---

## Swiggy MCP APIs Used

| Tool | Purpose |
|---|---|
| `get_addresses` | Fetch user delivery address |
| `search_menu` | Search dishes by mood-derived keywords |
| `search_restaurants` | Search restaurants by cuisine type |
| `get_food_orders` | Fetch order history for personalisation |
| `fetch_food_coupons` | Auto-fetch best available coupon |
| `apply_food_coupon` | Apply coupon silently before checkout |
| `update_food_cart` | Add selected dish to cart |
| `place_food_order` | Place the order |

---

## Run Locally

### Prerequisites

- Node.js 18+
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)
- Swiggy MCP API key → [mcp.swiggy.com/builders/access](https://mcp.swiggy.com/builders/access)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/rasam.git
cd rasam

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_key_here
SWIGGY_MCP_API_KEY=your_swiggy_mcp_key_here
SWIGGY_MCP_BASE_URL=https://mcp.swiggy.com/food
```

---

## Project Structure

```
rasam/
├── app/
│   ├── page.tsx              # Landing screen
│   ├── quiz/page.tsx         # 4-question mood quiz
│   ├── reveal/page.tsx       # Mood reveal screen
│   ├── results/page.tsx      # Food results + order
│   └── api/
│       ├── mood/route.ts     # Claude mood interpretation
│       ├── search/route.ts   # Swiggy dish search
│       ├── coupons/route.ts  # Coupon fetching
│       ├── cart/route.ts     # Cart management
│       ├── order/route.ts    # Order placement
│       └── history/route.ts  # Order history
├── components/
│   └── ui/                   # QuestionCard, MoodReveal, DishCard, etc.
├── lib/
│   ├── swiggy.ts             # Swiggy MCP API client
│   ├── claude.ts             # Anthropic SDK + mood prompt
│   ├── questions.ts          # The 4 mood questions
│   └── types.ts              # TypeScript interfaces
└── store/
    └── quiz-store.ts         # Zustand state
```

---

## The Mood Questions

Rasam never asks about food. It asks about everything else:

- *"Pick one without thinking: rain sounds or total silence?"*
- *"Rate your day honestly: dumpster fire / meh / actually decent / genuinely great"*
- *"You have 20 free minutes. What are you doing?"*
- *"Is this meal for comfort or fuel?"*

Four answers. One mood. One order.

---

## Roadmap

- [ ] Phase 1 — Project setup + API verification
- [ ] Phase 2 — Core quiz → mood → food → order flow
- [ ] Phase 3 — Order history personalisation + PWA + share card
- [ ] Phase 4 — Demo prep + Vercel deployment

---

## Built By

**Vandan** — Solo developer  
