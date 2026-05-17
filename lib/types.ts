export interface QuizAnswer {
  questionId: string
  question: string
  answer: string
}

export interface MoodResult {
  moodLabel: string
  moodDescription: string
  dishKeywords: string[]
  vegFilter: 0 | 1
  emoji: string
}

export interface SwiggyDish {
  itemId: string
  name: string
  price: number
  restaurantId: string
  restaurantName: string
  distanceKm: number
  rating: number
  imageUrl?: string
  isVeg: boolean
  addons?: SwiggyAddon[]
}

export interface SwiggyAddon {
  addonId: string
  name: string
  price: number
}

export interface Coupon {
  code: string
  description: string
  discountAmount: number
}

export interface CartItem {
  itemId: string
  restaurantId: string
  quantity: number
  variantId?: string
}

export interface QuizState {
  answers: QuizAnswer[]
  currentStep: number
  mood: MoodResult | null
  dishes: SwiggyDish[]
  selectedDish: SwiggyDish | null
  appliedCoupon: Coupon | null
  addressId: string | null
  recentDishes: string[]
  orderPlaced: boolean
  orderId: string | null
}

export interface SwiggyAddress {
  id: string
  label?: string
}
