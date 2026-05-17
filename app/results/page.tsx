"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DishCard from "@/components/ui/DishCard"
import OrderConfirm from "@/components/ui/OrderConfirm"
import type { SwiggyDish } from "@/lib/types"
import { useQuizStore } from "@/store/quiz-store"

export default function ResultsPage() {
  const router = useRouter()
  const {
    mood,
    dishes,
    selectedDish,
    appliedCoupon,
    addressId,
    recentDishes,
    selectDish,
    setDishes,
    setOrderPlaced,
    orderPlaced,
    orderId,
  } = useQuizStore()

  const [showConfirm, setShowConfirm] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isDemoOrder, setIsDemoOrder] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [keywordIndex, setKeywordIndex] = useState(0)

  useEffect(() => {
    if (!mood) router.push("/quiz")
  }, [mood, router])

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((s) => setIsDemoMode(Boolean(s.demoMode || s.mockSwiggy)))
      .catch(() => {})
  }, [])

  const handleSelectDish = (dish: SwiggyDish) => {
    selectDish(dish)
    setShowConfirm(true)
  }

  const dishMatchesHistory = (dishName: string) =>
    recentDishes.some((d) => d.toLowerCase().includes(dishName.toLowerCase().split(" ")[0]))

  const handleShowMore = async () => {
    if (!mood || !addressId) return
    const keywords = mood.dishKeywords
    const nextIndex = (keywordIndex + 1) % Math.max(keywords.length, 1)
    setKeywordIndex(nextIndex)
    setIsRefreshing(true)

    try {
      const rotated = [...keywords.slice(nextIndex), ...keywords.slice(0, nextIndex)]
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: rotated,
          addressId,
          vegFilter: mood.vegFilter,
          moodLabel: mood.moodLabel,
        }),
      })
      const data = await res.json()
      if (data.dishes?.length) setDishes(data.dishes)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleConfirmOrder = async () => {
    if (!selectedDish || !addressId) return
    setIsOrdering(true)
    setOrderError(null)

    try {
      const cartRes = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          dish: selectedDish,
          couponCode: appliedCoupon?.code ?? null,
        }),
      })
      const cartData = await cartRes.json()
      if (!cartRes.ok || !cartData.success) throw new Error("Cart failed")

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error("Order failed")

      setIsDemoOrder(Boolean(data.demo))
      setOrderPlaced(data.orderId)
      setShowConfirm(false)
    } catch {
      setOrderError("Couldn't place the order. Please try again.")
    } finally {
      setIsOrdering(false)
    }
  }

  if (orderPlaced) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">Order placed!</h1>
        {isDemoOrder && (
          <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Demo mode — enable ENABLE_REAL_ORDERS when Swiggy access is ready.
          </p>
        )}
        <p className="text-gray-500">
          {isDemoOrder
            ? "This was a simulated order for your demo."
            : "Your food is on its way. Track it in the Swiggy app."}
        </p>
        {orderId && <p className="font-mono text-xs text-gray-400">Order ID: {orderId}</p>}
        <button
          type="button"
          onClick={() => {
            useQuizStore.getState().reset()
            useQuizStore.persist.clearStorage()
            router.push("/")
          }}
          className="mt-4 rounded-2xl bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Start over
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col px-4 py-8">
      {mood && (
        <div className="mb-6 text-center">
          <p className="mb-1 text-sm text-gray-400">You are</p>
          <h2 className="font-display text-xl font-bold text-gray-900">
            {mood.emoji} {mood.moodLabel}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Here&apos;s what that mood wants</p>
        </div>
      )}

      {dishes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center text-gray-400">
          <p>Couldn&apos;t find dishes right now. Try again or open Swiggy directly.</p>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          {dishes.slice(0, 3).map((dish) => (
            <div key={dish.itemId}>
              {dishMatchesHistory(dish.name) && (
                <p className="mb-1 text-xs font-medium text-orange-600">
                  You always go for this when you&apos;re like this
                </p>
              )}
              <DishCard
                dish={dish}
                onSelect={handleSelectDish}
                hasCoupon={!!appliedCoupon}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleShowMore}
            disabled={isRefreshing}
            className="py-3 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 disabled:opacity-50"
          >
            {isRefreshing ? "Finding more..." : "Show me something else"}
          </button>
        </div>
      )}

      {showConfirm && selectedDish && (
        <OrderConfirm
          dish={selectedDish}
          coupon={appliedCoupon}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowConfirm(false)}
          isLoading={isOrdering}
          isDemo={isDemoMode}
        />
      )}

      {orderError && <p className="mt-3 text-center text-sm text-red-500">{orderError}</p>}
    </main>
  )
}
