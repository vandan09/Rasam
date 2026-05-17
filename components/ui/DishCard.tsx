"use client"

import type { SwiggyDish } from "@/lib/types"

interface Props {
  dish: SwiggyDish
  onSelect: (dish: SwiggyDish) => void
  hasCoupon?: boolean
}

export default function DishCard({ dish, onSelect, hasCoupon }: Props) {
  const priceInRupees = Math.round(dish.price / 100)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(dish)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(dish)}
      className="flex cursor-pointer scale-[0.98] animate-fadeIn flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-orange-300 hover:shadow-sm active:scale-95"
    >
      {dish.imageUrl && (
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="h-36 w-full rounded-xl bg-gray-100 object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-sm border-2 ${
                dish.isVeg ? "border-green-600" : "border-red-500"
              }`}
            >
              <div
                className={`m-0.5 h-1.5 w-1.5 rounded-full ${
                  dish.isVeg ? "bg-green-600" : "bg-red-500"
                }`}
              />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{dish.name}</h3>
          </div>
          <p className="text-sm text-gray-400">{dish.restaurantName}</p>
          <p className="mt-0.5 text-xs text-gray-400">{dish.distanceKm.toFixed(1)} km away</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-bold text-gray-900">₹{priceInRupees}</p>
          {dish.rating > 0 && (
            <p className="mt-0.5 text-xs font-medium text-orange-500">
              ★ {dish.rating.toFixed(1)}
            </p>
          )}
        </div>
      </div>
      {hasCoupon && (
        <div className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
          Coupon available — applied at checkout
        </div>
      )}
    </div>
  )
}
