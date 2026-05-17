"use client"

import { useRouter } from "next/navigation"
import { useQuizStore } from "@/store/quiz-store"

export default function Home() {
  const router = useRouter()
  const reset = useQuizStore((s) => s.reset)

  const handleStart = () => {
    reset()
    useQuizStore.persist.clearStorage()
    router.push("/quiz")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-5xl">🍲</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-gray-900">Rasam</h1>
        <p className="max-w-xs text-lg text-gray-500">
          Tell us nothing about food. We&apos;ll figure out the rest.
        </p>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="rounded-2xl bg-orange-500 px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-95"
      >
        Tell me what I want
      </button>

      <p className="text-xs text-gray-400">Powered by Swiggy</p>
    </main>
  )
}
