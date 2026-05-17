"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Coupon, MoodResult, QuizAnswer, QuizState, SwiggyDish } from "@/lib/types"

interface QuizStore extends QuizState {
  setAnswer: (answer: QuizAnswer) => void
  nextStep: () => void
  prevStep: () => void
  setMood: (mood: MoodResult) => void
  setDishes: (dishes: SwiggyDish[]) => void
  selectDish: (dish: SwiggyDish) => void
  setAppliedCoupon: (coupon: Coupon | null) => void
  setAddressId: (id: string) => void
  setRecentDishes: (dishes: string[]) => void
  setOrderPlaced: (orderId: string) => void
  reset: () => void
}

const initialState: QuizState = {
  answers: [],
  currentStep: 0,
  mood: null,
  dishes: [],
  selectedDish: null,
  appliedCoupon: null,
  addressId: null,
  recentDishes: [],
  orderPlaced: false,
  orderId: null,
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAnswer: (answer) =>
        set((s) => ({
          answers: [...s.answers.filter((a) => a.questionId !== answer.questionId), answer],
        })),

      nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      setMood: (mood) => set({ mood }),
      setDishes: (dishes) => set({ dishes }),
      selectDish: (dish) => set({ selectedDish: dish }),
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
      setAddressId: (id) => set({ addressId: id }),
      setRecentDishes: (dishes) => set({ recentDishes: dishes }),
      setOrderPlaced: (orderId) =>
        set({
          orderPlaced: Boolean(orderId),
          orderId: orderId ?? null,
        }),
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: "rasam-quiz",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        addressId: s.addressId,
        recentDishes: s.recentDishes,
      }),
    }
  )
)
