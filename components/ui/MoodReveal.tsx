"use client"

import { useEffect, useState } from "react"
import type { MoodResult } from "@/lib/types"

interface Props {
  mood: MoodResult
  onContinue: () => void
  onShare?: () => void
}

export default function MoodReveal({ mood, onContinue, onShare }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div
        className={`transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div
          className={`mb-6 text-6xl transition-transform duration-500 ${
            visible ? "scale-100" : "scale-0"
          }`}
        >
          {mood.emoji}
        </div>
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gray-400">
          You are
        </p>
        <h1 className="font-display mb-4 text-4xl font-bold leading-tight text-gray-900">
          {mood.moodLabel}
        </h1>
        <p className="mx-auto max-w-xs text-lg leading-relaxed text-gray-500">
          {mood.moodDescription}
        </p>
      </div>

      <div
        className={`flex flex-col gap-3 transition-all duration-200 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <button
          type="button"
          onClick={onContinue}
          className="rounded-2xl bg-orange-500 px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-95"
        >
          Show me what to eat
        </button>
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="text-sm font-medium text-gray-400 transition-colors hover:text-orange-500"
          >
            Share my mood
          </button>
        )}
      </div>
    </div>
  )
}
