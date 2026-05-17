"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingVibe from "@/components/ui/LoadingVibe"
import ProgressDots from "@/components/ui/ProgressDots"
import QuestionCard from "@/components/ui/QuestionCard"
import { QUESTIONS } from "@/lib/questions"
import { useQuizStore } from "@/store/quiz-store"

export default function QuizPage() {
  const router = useRouter()
  const {
    answers,
    currentStep,
    setAnswer,
    nextStep,
    prevStep,
    setMood,
    setAddressId,
    setRecentDishes,
    recentDishes,
  } = useQuizStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedAddress = sessionStorage.getItem("rasam-address-id")
    if (savedAddress) setAddressId(savedAddress)

    fetch("/api/history")
      .then((r) => r.json())
      .then(({ recentDishes: dishes, addressId }) => {
        if (dishes?.length) setRecentDishes(dishes)
        if (addressId) setAddressId(addressId)
      })
      .catch(() => {})
  }, [setAddressId, setRecentDishes])

  const step = Math.min(currentStep, QUESTIONS.length - 1)
  const question = QUESTIONS[step]

  const handleSelect = useCallback(
    async (answer: string) => {
      if (isLoading || !question) return

      setError(null)
      setAnswer({
        questionId: question.id,
        question: question.text,
        answer,
      })

      if (step < QUESTIONS.length - 1) {
        nextStep()
        return
      }

      setIsLoading(true)

      try {
        const allAnswers = [
          ...answers.filter((a) => a.questionId !== question.id),
          { questionId: question.id, question: question.text, answer },
        ]

        const res = await fetch("/api/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: allAnswers, recentDishes }),
        })

        const data = await res.json()
        if (!data.mood) throw new Error("No mood returned")

        setMood(data.mood)
        router.push("/reveal")
      } catch {
        setError("Something went wrong reading your vibe. Try again.")
        setIsLoading(false)
      }
    },
    [isLoading, question, step, answers, recentDishes, setAnswer, nextStep, setMood, router]
  )

  if (!question) return null

  if (isLoading) return <LoadingVibe />

  return (
    <main className="flex min-h-screen flex-col py-12">
      <div className="mb-10 px-4">
        <ProgressDots total={QUESTIONS.length} current={step} />
      </div>

      <div className="relative z-10 flex flex-1 items-center">
        <QuestionCard
          key={question.id}
          question={question.text}
          subtitle={question.subtitle}
          stepLabel={`Question ${step + 1} of ${QUESTIONS.length}`}
          options={[...question.options]}
          onSelect={handleSelect}
          selectedAnswer={answers.find((a) => a.questionId === question.id)?.answer}
        />
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={prevStep}
          className="relative z-10 py-4 text-center text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          ← Back
        </button>
      )}

      {error && (
        <p className="relative z-10 px-4 pb-4 text-center text-sm text-red-500">{error}</p>
      )}
    </main>
  )
}
