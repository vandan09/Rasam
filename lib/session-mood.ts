import type { MoodResult } from "./types"

const MOOD_KEY = "rasam-mood"

export function saveMoodToSession(mood: MoodResult) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(MOOD_KEY, JSON.stringify(mood))
}

export function loadMoodFromSession(): MoodResult | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(MOOD_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MoodResult
  } catch {
    return null
  }
}

export function clearMoodFromSession() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(MOOD_KEY)
}
