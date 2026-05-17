import {
  getMockDishesForKeywords,
  MOCK_ADDRESSES,
  MOCK_ADDRESS_ID,
  MOCK_COUPON,
  MOCK_DISHES,
} from "./mock-data"
import { isRealOrdersEnabled, isSwiggyMockMode } from "./runtime"

export { isSwiggyMockMode, isRealOrdersEnabled }

const BASE_URL = process.env.SWIGGY_MCP_BASE_URL ?? "https://mcp.swiggy.com/food"
const API_KEY = process.env.SWIGGY_MCP_API_KEY

async function swiggyCall(tool: string, args: Record<string, unknown>) {
  if (isSwiggyMockMode()) {
    return mockSwiggyCall(tool, args)
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ tool, arguments: args }),
  })

  if (!res.ok) {
    throw new Error(`Swiggy HTTP ${res.status} on tool: ${tool}`)
  }

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error?.message ?? `Swiggy API error on tool: ${tool}`)
  }

  return data.data
}

function mockSwiggyCall(tool: string, args: Record<string, unknown>) {
  switch (tool) {
    case "get_addresses":
      return MOCK_ADDRESSES
    case "search_menu": {
      const query = String(args.query ?? "")
      const vegOnly = args.vegFilter === 1
      let items = getMockDishesForKeywords([query]).map((d) => ({
        ...d,
        availabilityStatus: "OPEN",
      }))
      if (vegOnly) items = items.filter((d) => d.isVeg)
      return { items }
    }
    case "search_restaurants":
      return { restaurants: [] }
    case "get_restaurant_menu":
      return { items: MOCK_DISHES }
    case "get_food_cart":
      return { items: [] }
    case "update_food_cart":
      return { success: true }
    case "flush_food_cart":
      return { success: true }
    case "fetch_food_coupons":
      return { coupons: [MOCK_COUPON] }
    case "apply_food_coupon":
      return { success: true }
    case "place_food_order":
      return { orderId: `MOCK-ORDER-${Date.now()}` }
    case "get_food_orders":
      return {
        orders: [
          {
            items: [{ name: "biryani" }, { name: "pizza" }],
          },
        ],
      }
    case "track_food_order":
      return { status: "PREPARING" }
    default:
      throw new Error(`Unknown mock tool: ${tool}`)
  }
}

export async function getAddresses() {
  return swiggyCall("get_addresses", {})
}

export async function resolveAddressId(provided?: string | null): Promise<string> {
  if (provided && provided !== "__AUTO__") return provided
  const addresses = await getAddresses()
  const list = Array.isArray(addresses) ? addresses : []
  const id = list[0]?.id
  if (!id) throw new Error("No delivery address found")
  return id
}

export async function searchMenu(args: {
  addressId: string
  query: string
  vegFilter?: 0 | 1
  offset?: number
}) {
  return swiggyCall("search_menu", args)
}

export async function searchRestaurants(args: {
  addressId: string
  query: string
  offset?: number
}) {
  return swiggyCall("search_restaurants", args)
}

export async function getRestaurantMenu(args: {
  addressId: string
  restaurantId: string
  offset?: number
}) {
  return swiggyCall("get_restaurant_menu", args)
}

export async function getFoodCart(addressId: string) {
  return swiggyCall("get_food_cart", { addressId })
}

export async function updateFoodCart(args: {
  addressId: string
  itemId: string
  restaurantId: string
  quantity: number
  variantId?: string
}) {
  return swiggyCall("update_food_cart", args)
}

export async function flushFoodCart(addressId: string) {
  return swiggyCall("flush_food_cart", { addressId })
}

export async function fetchFoodCoupons(addressId: string) {
  return swiggyCall("fetch_food_coupons", { addressId })
}

export async function applyFoodCoupon(args: {
  addressId: string
  couponCode: string
}) {
  return swiggyCall("apply_food_coupon", args)
}

export async function placeFoodOrder(addressId: string) {
  if (!isRealOrdersEnabled()) {
    return { orderId: `DEMO-${Date.now()}`, demo: true }
  }
  const result = await swiggyCall("place_food_order", { addressId })
  return { ...result, demo: false }
}

export async function getFoodOrders(args: {
  addressId: string
  orderCount?: number
}) {
  return swiggyCall("get_food_orders", args)
}

export async function trackFoodOrder(args: {
  addressId: string
  orderId: string
}) {
  return swiggyCall("track_food_order", args)
}

export { MOCK_ADDRESS_ID }
