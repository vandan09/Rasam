import { APP_URL } from "./config"
import type { MoodResult } from "./types"

export function buildMoodShareText(mood: MoodResult): string {
  return `I'm "${mood.moodLabel}" right now.\n${mood.moodDescription}\n\nFind out yours → ${APP_URL}`
}

export async function shareMood(mood: MoodResult): Promise<"shared" | "copied"> {
  const text = buildMoodShareText(mood)

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ text, title: "My Rasam mood" })
    return "shared"
  }

  await navigator.clipboard.writeText(text)
  return "copied"
}
