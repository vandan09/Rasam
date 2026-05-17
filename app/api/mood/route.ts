import { NextRequest, NextResponse } from "next/server"
import { interpretMood } from "@/lib/claude"
import type { QuizAnswer } from "@/lib/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers, recentDishes }: { answers: QuizAnswer[]; recentDishes?: string[] } =
      body

    if (!answers || answers.length !== 4) {
      return NextResponse.json({ error: "Need exactly 4 answers" }, { status: 400 })
    }

    const mood = await interpretMood(answers, recentDishes)
    return NextResponse.json({ mood })
  } catch (err) {
    console.error("[/api/mood]", err)
    return NextResponse.json({ error: "Mood interpretation failed" }, { status: 500 })
  }
}
