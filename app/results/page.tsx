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
    selectDish,
    setOrderPlaced,
    orderPlaced,
    orderId,
  } = useQuizStore()

  const [showConfirm, setShowConfirm] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isDemoOrder, setIsDemoOrder] = useState(true)

  useEffect(() => {
    if (!mood) router.push("/quiz")
  }, [mood, router])

  const handleSelectDish = (dish: SwiggyDish) => {
    selectDish(dish)
    setShowConfirm(true)
  }

  const handleConfirmOrder = async () => {
    if (!selectedDish || !addressId) return
    setIsOrdering(true)
    setOrderError(null)

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          dish: selectedDish,
          couponCode: appliedCoupon?.code ?? null,
        }),
      })

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      })
      const data = await res.json()
      if (!data.success) throw new Error("Order failed")

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
          onClick={() => router.push("/")}
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
            <DishCard
              key={dish.itemId}
              dish={dish}
              onSelect={handleSelectDish}
              hasCoupon={!!appliedCoupon}
            />
          ))}
        </div>
      )}

      {showConfirm && selectedDish && (
        <OrderConfirm
          dish={selectedDish}
          coupon={appliedCoupon}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowConfirm(false)}
          isLoading={isOrdering}
          isDemo
        />
      )}

      {orderError && <p className="mt-3 text-center text-sm text-red-500">{orderError}</p>}
    </main>
  )
}
