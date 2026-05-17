import type { MoodResult } from "./types"

/** Fallback dish keywords when Claude fails or returns empty results */
export const MOOD_KEYWORD_FALLBACKS: Record<string, string[]> = {
  comfort: ["khichdi", "dal rice", "soup"],
  stress: ["maggi", "burger", "vada pav"],
  celebrate: ["biryani", "butter chicken", "pizza"],
  tired: ["khichdi", "idli", "dosa"],
  lazy: ["dosa", "paratha", "chole bhature"],
  focused: ["salad bowl", "sandwich", "thali"],
  default: ["biryani", "pizza", "khichdi"],
}

export function getFallbackKeywords(moodLabel?: string): string[] {
  if (!moodLabel) return MOOD_KEYWORD_FALLBACKS.default
  const lower = moodLabel.toLowerCase()
  for (const [key, keywords] of Object.entries(MOOD_KEYWORD_FALLBACKS)) {
    if (key !== "default" && lower.includes(key)) return keywords
  }
  return MOOD_KEYWORD_FALLBACKS.default
}

export const FALLBACK_MOOD: MoodResult = {
  moodLabel: "Genuinely undecided",
  moodDescription: "You contain multitudes. Here's something reliable.",
  dishKeywords: ["biryani", "pizza"],
  vegFilter: 0,
  emoji: "🤷",
}
