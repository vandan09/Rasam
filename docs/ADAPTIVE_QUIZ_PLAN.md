# Rasam — Adaptive Quiz & Scale Plan

> **Goal:** Personal, logical mood routing for every user — without hardcoding one path, without LLM cost on every tap, and without quiz fatigue.  
> **Context:** Swiggy Builders Club · Solo build · Production path credible at high DAUs.

---

## Executive summary

| Today | Planned |
|-------|---------|
| 4 hardcoded questions, same for everyone | **3 questions** (fewer taps, less fatigue) |
| 1 Claude call at the end | **0 LLM calls in quiz**; optional **1 cheap call** for mood polish only |
| Mood from AI only | **Tags + branching pools** → rules map to mood + dish keywords |
| Swiggy for search/order only | Swiggy **order history + time** inform tags and results |

**Principle:** The quiz should feel like a friend who asks *one sharp follow-up*, not a survey. Food personalization leans on **Swiggy’s data**, not more questions.

---

## Why fewer questions?

Users drop when quizzes feel long. Research and product intuition align:

| Length | Risk |
|--------|------|
| 5+ questions | High abandon, feels like a form |
| 4 questions | OK for demo; borderline for daily use |
| **3 questions** | **Sweet spot** — enough signal, under ~30 seconds |
| 2 questions | Fast but shallow; use only with strong Swiggy history |

### Recommended: **3-question flow**

| Step | Type | Purpose |
|------|------|---------|
| **Q1** | Fixed opener (brand) | Anchor tone; everyone starts same — “Tell us nothing about food” |
| **Q2** | **Dynamic** (tree) | Probe primary vibe: energy / day / chaos |
| **Q3** | **Dynamic** (tree) | Probe meal intent: comfort / treat / fuel — then done |

**Optional Q4** only when Swiggy history is empty *and* tags are ambiguous (edge case, &lt;10% of sessions).

**Target:** Mood reveal in **under 25 seconds** from first tap.

---

## Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER SESSION                            │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────┐     tags[]      ┌──────────────────┐
│  Q1 (fixed)   │ ───────────────►  │  Quiz engine     │
└───────────────┘                   │  (rules only)    │
        │                           │  • pick Q2 pool  │
        ▼                           │  • pick Q3 pool  │
┌───────────────┐     tags[]       │  • no API $      │
│  Q2 (dynamic) │ ◄──────────────►  └────────┬─────────┘
└───────────────┘                            │
        │                                      ▼
        ▼                           ┌──────────────────┐
┌───────────────┐     tags[]       │  Mood resolver   │
│  Q3 (dynamic) │ ───────────────►  │  rules (default) │
└───────────────┘                   │  OR 1× Haiku     │
                                    │  (optional)      │
                                    └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
            ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
            │ Mood reveal  │        │ Swiggy search│        │ Coupons/order│
            │ (shareable)  │        │ (MCP)        │        │ (MCP)        │
            └──────────────┘        └──────────────┘        └──────────────┘
```

---

## Layer 1 — Branching tree (quiz, $0 marginal cost)

### How it works

1. Each **answer** adds **tags** (strings), e.g. `calm`, `bad_day`, `chaotic`, `comfort`.
2. **Question pools** are JSON arrays grouped by `dimension` and `requiredTags`.
3. Engine picks the next question that:
   - Matches accumulated tags
   - Covers a **dimension not yet asked**
   - Has not been shown this session

### Dimensions (only 3 for 3-question flow)

| Dimension | Covered by | Example tags |
|-----------|------------|--------------|
| `anchor` | Q1 only | `calm`, `chaotic`, `low_energy`, `wired` |
| `day_story` | Q2 | `rough_day`, `meh`, `good_day`, `win` |
| `meal_intent` | Q3 | `comfort`, `treat`, `fuel`, `numb` |

Q1 answer narrows Q2 pool. Q1+Q2 narrow Q3 pool. **No LLM.**

### Content size (maintainable)

| Asset | Count | Notes |
|-------|-------|-------|
| Q1 | 1 | Fixed, marketing-quality |
| Q2 variants | 8–12 | 2–3 per anchor tag group |
| Q3 variants | 8–12 | 2–3 per Q1+Q2 combo clusters |
| **Total copy** | ~25 questions | Authored once; editable in JSON |

### File layout (planned)

```
lib/
  quiz-engine.ts       # pickNextQuestion(tags, askedIds)
  quiz-tags.ts         # answer → tags mapping
  mood-resolver.ts     # tags → MoodResult (rules)
data/
  questions/
    q1.json            # fixed opener
    pool-q2.json       # dynamic pool
    pool-q3.json       # dynamic pool
  mood-matrix.json     # tag combos → mood + keywords
```

---

## Layer 2 — Mood resolution (rules first)

### Default: rule matrix (production)

```json
{
  "tags": ["chaotic", "rough_day", "comfort"],
  "moodLabel": "Quietly unravelling",
  "moodDescription": "You need something warm that asks nothing of you.",
  "dishKeywords": ["khichdi", "dal rice", "soup"],
  "vegFilter": 0,
  "emoji": "🌧️"
}
```

- **50–80 rows** cover most tag combinations.
- Fallback row: `default` (already have `FALLBACK_MOOD`).
- **Zero inference cost** at any scale.

### Optional: one small LLM call (experiments / premium)

| Model | Role | When |
|-------|------|------|
| **None** | Rules only | Default prod, 99% traffic |
| **Claude Haiku / Gemini Flash** | Polish `moodLabel` + `moodDescription` only | A/B test, demo “wow” |
| **Claude Sonnet** | Same, 1 call | Current demo only |

**Keywords always from rules** — Swiggy search must stay predictable and safe.

---

## Layer 3 — Swiggy signals (personalization without more questions)

Use data you already have from MCP — **no extra quiz steps**.

| Signal | API | Use |
|--------|-----|-----|
| Recent orders | `get_food_orders` | Tag `frequent_biryani`, boost matching dishes |
| Time of day | Server clock | Evening → comfort pools; lunch → fuel pools |
| Address / city | `get_addresses` | Future: regional pool variants |
| Veg pattern | Parse orders | Set `vegFilter`, skip redundant logic |

**“You always go for this when you’re like this”** — history on results, not Q4.

---

## Cost model (why this scales)

| Approach | Cost per 1M sessions | Notes |
|----------|----------------------|-------|
| Claude × 5 calls | $$$$ | Not viable |
| Claude × 1 (mood only) | $$ | OK for demo |
| **Rules quiz + rules mood** | **~$0** | **Target for scale** |
| Rules quiz + 1× Haiku mood | $ | Optional polish |
| Cache `hash(tags+time)` → mood | ↓ further | High cache hit rate |

Swiggy at billion-scale would run this logic on **their infra**; Rasam proves the **graph + UX + MCP integration**.

---

## User experience targets

| Metric | Target |
|--------|--------|
| Questions per session | **3** (max 4 if ambiguous) |
| Time to mood reveal | &lt; 25 s |
| Tap per question | 1 (no multi-select) |
| Back button | Supported |
| Failure | Fallback to static 3 questions (current copy) |

### Frustration reducers

- Progress dots: **3**, not 4
- Subtitle under each Q: sets expectation (“2 more taps”)
- No question repeats same dimension
- Loading copy: witty, &lt; 3 s to mood

---

## API changes (planned)

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `POST /api/quiz/next` | **New** | `{ answers, tags }` → next question or `{ done: true }` |
| `POST /api/mood` | **Update** | Accept `tags[]` + optional `answers[]`; rules first |
| `GET /api/history` | Exists | Seed tags before quiz |
| `POST /api/search` | Exists | Unchanged |

### `POST /api/quiz/next` response shape

```typescript
{
  done: boolean
  question?: { id, text, subtitle, options: string[] }
  tags: string[]           // accumulated for client debug
  step: number             // 1..3
}
```

---

## Client changes (planned)

| File | Change |
|------|--------|
| `app/quiz/page.tsx` | Call `/api/quiz/next` after each answer; 3 steps |
| `store/quiz-store.ts` | Store `tags: string[]`, `askedQuestionIds` |
| `lib/questions.ts` | Keep as **fallback** only |
| `components/ui/QuestionCard.tsx` | Show “Question 2 of 3” |

---

## Implementation phases

### Phase A — Plan & content (this doc + copy)
- [x] Write this plan
- [ ] Finalize 3-question copy (Q1 fixed + pool outlines)
- [ ] Define tag vocabulary (~20 tags)
- [ ] Draft mood-matrix.json (50 rows)

### Phase B — Quiz engine (no UI break)
- [ ] `lib/quiz-engine.ts` + `lib/quiz-tags.ts`
- [ ] `data/questions/*.json`
- [ ] `POST /api/quiz/next`
- [ ] Unit tests: tag paths → expected Q2/Q3

### Phase C — Wire UI (3 questions)
- [ ] Update quiz page to dynamic flow
- [ ] Progress dots = 3
- [ ] Fallback to current hardcoded if engine fails

### Phase D — Rules mood
- [ ] `lib/mood-resolver.ts` from tags
- [ ] Update `/api/mood` to prefer rules; Claude optional flag
- [ ] Env: `MOOD_ENGINE=rules|haiku|sonnet`

### Phase E — Swiggy context
- [ ] Inject time-of-day into tag bootstrap
- [ ] Order-history tags into mood-matrix boosts
- [ ] Document for Swiggy pitch

### Phase F — Polish & demo
- [ ] README section: “Production architecture”
- [ ] Update demo script for 3 questions
- [ ] Record 90s video

---

## What we keep from current build

| Feature | Keep? |
|---------|-------|
| Swiggy MCP mock + live | Yes |
| Reveal + results + order flow | Yes |
| Session mood persistence | Yes |
| Witty tone in pools | Yes (authored) |
| 4 hardcoded questions | **Fallback only** |
| Claude on every session | **Optional, off by default** |

---

## Swiggy pitch (one paragraph)

Rasam routes users through a **3-step mood graph** — each path driven by answers, not a fixed survey. **Swiggy order history and time-of-day** refine the outcome; **dish discovery and checkout** stay on MCP. The mood line people share can be **rule-generated at zero marginal cost**, with optional AI polish for campaigns. That’s how you ship personality to **millions of DAUs** without inference budget exploding.

---

## Open decisions

| Decision | Recommendation |
|----------|----------------|
| 3 vs 2 questions | **3** — better mood accuracy |
| LLM in prod | **Off by default**; env flag |
| Hindi pools | Phase 2 (separate JSON) |
| A/B: 3 vs 4 questions | Measure completion rate |

---

## Success metrics

| Metric | How to measure |
|--------|----------------|
| Quiz completion rate | % reaching `/reveal` |
| Time to reveal | Client analytics |
| “Felt accurate” | 5-user qualitative test |
| Cost per 1k sessions | API logs: 0–1 LLM calls |
| Order placed (demo) | End-to-end test |

---

*Last updated: plan v1 · 3-question adaptive tree · rules-first mood · Swiggy-scale path*
