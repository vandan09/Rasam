"use client"

import { useEffect, useState } from "react"

const LOADING_LINES = [
  "Reading your vibe...",
  "Consulting the food gods...",
  "Decoding your chaos...",
  "Almost got it...",
]

export default function LoadingVibe() {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % LOADING_LINES.length)
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      <p className="text-lg font-medium text-gray-500 transition-all duration-300">
        {LOADING_LINES[lineIndex]}
      </p>
    </div>
  )
}
