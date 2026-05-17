"use client"

import { useEffect } from "react"
import { useQuizStore } from "@/store/quiz-store"

/** Rehydrate persisted Zustand state on the client to avoid SSR mismatches. */
export default function StoreHydrator() {
  useEffect(() => {
    void useQuizStore.persist.rehydrate()
  }, [])
  return null
}
