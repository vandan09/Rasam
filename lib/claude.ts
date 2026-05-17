import Anthropic from "@anthropic-ai/sdk"
import { FALLBACK_MOOD } from "./mood-map"
import type { MoodResult, QuizAnswer } from "./types"

const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514"

const SYSTEM_PROMPT = `You are a mood reader for a food ordering app called Rasam.

The user has answered 4 questions. Your job:
1. Read their emotional state from the answers
2. Give it a short, accurate, slightly poetic mood label (2–4 words max)
3. Write a 1-sentence witty description of that mood (under 15 words)
4. Choose 2-3 specific Indian food dish keywords that genuinely match this mood
5. Decide if they likely want vegetarian food based on context (default 0 = mixed)
6. Pick one emoji that fits the mood perfectly

Rules:
- Never be generic. "Tired" is bad. "Quietly unravelling" is good.
- "Stressed" is bad. "Running on fumes" is good.
- Dish keywords must be real Indian food terms: biryani, khichdi, dosa, paratha, vada pav, chole bhature, butter chicken, masala chai, pizza, burger, maggi, soup, thali, idli, pav bhaji
- Output ONLY valid JSON. No prose, no markdown, no explanation.

Output format (strict):
{
  "moodLabel": "string",
  "moodDescription": "string",
  "dishKeywords": ["string", "string"],
  "vegFilter": 0,
  "emoji": "string"
}`

function buildUserMessage(answers: QuizAnswer[], recentOrders?: string[]): string {
  const base = answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n")
  if (!recentOrders?.length) return base
  return `${base}\n\nThis user's recent orders: ${recentOrders.join(", ")}. Factor this into dish keyword choices where relevant.`
}

function parseMoodJson(text: string): MoodResult {
  const clean = text.replace(/```json|```/g, "").trim()
  const parsed = JSON.parse(clean) as MoodResult
  if (!parsed.moodLabel || !parsed.dishKeywords?.length) {
    throw new Error("Invalid mood JSON shape")
  }
  return {
    moodLabel: parsed.moodLabel,
    moodDescription: parsed.moodDescription ?? "",
    dishKeywords: parsed.dishKeywords,
    vegFilter: parsed.vegFilter === 1 ? 1 : 0,
    emoji: parsed.emoji ?? "🍲",
  }
}

export async function interpretMood(
  answers: QuizAnswer[],
  recentOrders?: string[]
): Promise<MoodResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === "your_anthropic_key_here") {
    return getDemoMoodFromAnswers(answers)
  }

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserMessage(answers, recentOrders),
        },
      ],
    })

    const block = response.content[0]
    const text = block.type === "text" ? block.text : ""
    return parseMoodJson(text)
  } catch {
    return getDemoMoodFromAnswers(answers) ?? FALLBACK_MOOD
  }
}

/** Deterministic mood when no API key — still demo-able */
function getDemoMoodFromAnswers(answers: QuizAnswer[]): MoodResult {
  const comfort = answers.find((a) => a.questionId === "q4")?.answer ?? ""
  const day = answers.find((a) => a.questionId === "q2")?.answer ?? ""

  if (
    comfort.includes("warm hug") ||
    comfort.includes("side of guilt") ||
    day.includes("dumpster fire")
  ) {
    return {
      moodLabel: "Quietly unravelling",
      moodDescription: "You need something warm that asks nothing of you.",
      dishKeywords: ["khichdi", "dal rice", "soup"],
      vegFilter: 1,
      emoji: "🌧️",
    }
  }
  if (day.includes("Main character") || day.includes("Weirdly okay")) {
    return {
      moodLabel: "Main character energy",
      moodDescription: "You earned something that slaps.",
      dishKeywords: ["biryani", "butter chicken", "pizza"],
      vegFilter: 0,
      emoji: "✨",
    }
  }
  return FALLBACK_MOOD
}

export { FALLBACK_MOOD }
