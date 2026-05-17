import type { Coupon, SwiggyAddress, SwiggyDish } from "./types"

export const MOCK_ADDRESS_ID = "mock-address-001"

export const MOCK_ADDRESSES: SwiggyAddress[] = [
  { id: MOCK_ADDRESS_ID, label: "Home (demo)" },
]

export const MOCK_DISHES: SwiggyDish[] = [
  {
    itemId: "mock-1",
    name: "Dal Khichdi",
    price: 18000,
    restaurantId: "mock-rest-1",
    restaurantName: "Behrouz Biryani",
    distanceKm: 2.4,
    rating: 4.5,
    isVeg: true,
  },
  {
    itemId: "mock-2",
    name: "Chicken Biryani",
    price: 32000,
    restaurantId: "mock-rest-2",
    restaurantName: "Meghana Foods",
    distanceKm: 3.1,
    rating: 4.7,
    isVeg: false,
  },
  {
    itemId: "mock-3",
    name: "Masala Dosa",
    price: 12000,
    restaurantId: "mock-rest-3",
    restaurantName: "MTR",
    distanceKm: 1.8,
    rating: 4.4,
    isVeg: true,
  },
  {
    itemId: "mock-4",
    name: "Margherita Pizza",
    price: 29900,
    restaurantId: "mock-rest-4",
    restaurantName: "Oven Story",
    distanceKm: 4.2,
    rating: 4.2,
    isVeg: true,
  },
  {
    itemId: "mock-5",
    name: "Vada Pav",
    price: 4500,
    restaurantId: "mock-rest-5",
    restaurantName: "Goli Vada Pav",
    distanceKm: 0.9,
    rating: 4.3,
    isVeg: true,
  },
  {
    itemId: "mock-6",
    name: "Butter Chicken",
    price: 38000,
    restaurantId: "mock-rest-2",
    restaurantName: "Meghana Foods",
    distanceKm: 3.1,
    rating: 4.6,
    isVeg: false,
  },
]

export const MOCK_COUPON: Coupon = {
  code: "RASAM60",
  description: "₹60 off on your order",
  discountAmount: 6000,
}

export function getMockDishesForKeywords(keywords: string[]): SwiggyDish[] {
  const lower = keywords.map((k) => k.toLowerCase())
  const matched = MOCK_DISHES.filter((dish) =>
    lower.some(
      (kw) =>
        dish.name.toLowerCase().includes(kw) ||
        kw.includes(dish.name.toLowerCase().split(" ")[0])
    )
  )
  return (matched.length > 0 ? matched : MOCK_DISHES).slice(0, 6)
}
