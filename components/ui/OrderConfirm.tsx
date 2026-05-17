"use client"

import type { Coupon, SwiggyDish } from "@/lib/types"

interface Props {
  dish: SwiggyDish
  coupon: Coupon | null
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
  isDemo?: boolean
}

export default function OrderConfirm({
  dish,
  coupon,
  onConfirm,
  onCancel,
  isLoading,
  isDemo,
}: Props) {
  const price = Math.round(dish.price / 100)
  const discount = coupon ? Math.round(coupon.discountAmount / 100) : 0
  const finalPrice = Math.max(0, price - discount)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <h3 className="mb-1 text-lg font-bold text-gray-900">Confirm order</h3>
        <p className="mb-5 text-sm text-gray-400">
          {isDemo
            ? "Demo mode — no real order will be placed."
            : "This will place a real Swiggy order."}
        </p>

        <div className="mb-4 flex flex-col gap-2 rounded-xl bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{dish.name}</span>
            <span className="font-medium">₹{price}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Coupon ({coupon?.code})</span>
              <span>−₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        <p className="mb-5 text-center text-xs text-gray-400">
          From {dish.restaurantName} · {dish.distanceKm.toFixed(1)} km
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? "Placing..." : isDemo ? "Place demo order" : "Place order"}
          </button>
        </div>
      </div>
    </div>
  )
}
