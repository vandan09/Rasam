"use client"

import { useEffect, useState } from "react"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    useQuizStore.setState({ orderPlaced: false, orderId: null, selectedDish: null })
  }, [])

  useEffect(() => {
    if (currentStep >= QUESTIONS.length) {
      useQuizStore.setState({ currentStep: 0 })
    }
  }, [currentStep])

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then(({ recentDishes: dishes, addressId }) => {
        if (dishes?.length) setRecentDishes(dishes)
        if (addressId) setAddressId(addressId)
      })
      .catch(() => {})
  }, [setRecentDishes, setAddressId])

  const step = Math.min(currentStep, QUESTIONS.length - 1)
  const question = QUESTIONS[step]
  const currentAnswer = answers.find((a) => a.questionId === question?.id)?.answer

  const handleSelect = async (answer: string) => {
    if (isSubmitting || isLoading || !question) return

    setAnswer({
      questionId: question.id,
      question: question.text,
      answer,
    })

    if (step < QUESTIONS.length - 1) {
      setIsSubmitting(true)
      setTimeout(() => {
        nextStep()
        setIsSubmitting(false)
      }, 200)
      return
    }

    setIsLoading(true)
    setIsSubmitting(true)
    setError(null)

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
      if (!res.ok && !data.mood) throw new Error("Mood request failed")
      if (!data.mood) throw new Error("No mood returned")

      setMood(data.mood)
      router.push("/reveal")
    } catch {
      setError("Something went wrong reading your vibe. Try again.")
      setIsLoading(false)
      setIsSubmitting(false)
    }
  }

  if (!question) {
    router.replace("/")
    return null
  }

  if (isLoading) return <LoadingVibe />

  return (
    <main className="flex min-h-screen flex-col py-12">
      <div className="mb-10 px-4">
        <ProgressDots total={QUESTIONS.length} current={step} />
      </div>

      <div className="flex flex-1 items-center">
        <QuestionCard
          key={step}
          question={question.text}
          options={[...question.options]}
          onSelect={handleSelect}
          selectedAnswer={currentAnswer}
          disabled={isSubmitting}
        />
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="py-4 text-center text-sm text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
        >
          ← Back
        </button>
      )}

      {error && <p className="px-4 pb-4 text-center text-sm text-red-500">{error}</p>}
    </main>
  )
}
