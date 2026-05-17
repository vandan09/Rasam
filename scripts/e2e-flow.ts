/**
 * End-to-end API flow test (no browser). Run: npm run test:e2e
 * Requires dev server: npm run dev (in another terminal)
 */

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000"

const ANSWERS = [
  { questionId: "q1", question: "Pick one without thinking:", answer: "Rain sounds" },
  { questionId: "q2", question: "Rate your day honestly.", answer: "Meh, it existed" },
  {
    questionId: "q3",
    question: "You have 20 free minutes. What are you doing?",
    answer: "Lying down doing nothing",
  },
  {
    questionId: "q4",
    question: "Is this meal for comfort or fuel?",
    answer: "Pure comfort",
  },
]

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return { res, data }
}

async function main() {
  console.log(`E2E against ${BASE}\n`)

  const health = await fetch(`${BASE}/api/health`)
  if (!health.ok) throw new Error("Health check failed — is dev server running?")
  console.log("✓ /api/health")

  const status = await (await fetch(`${BASE}/api/status`)).json()
  console.log("✓ /api/status", status)

  const history = await (await fetch(`${BASE}/api/history`)).json()
  if (!history.addressId) throw new Error("No addressId from history")
  console.log("✓ /api/history", history.addressId)

  const { res: moodRes, data: moodData } = await post("/api/mood", {
    answers: ANSWERS,
    recentDishes: history.recentDishes,
  })
  if (!moodData.mood) throw new Error("Mood failed")
  console.log("✓ /api/mood", moodData.mood.moodLabel)

  const { res: searchRes, data: searchData } = await post("/api/search", {
    keywords: moodData.mood.dishKeywords,
    addressId: history.addressId,
    vegFilter: moodData.mood.vegFilter,
  })
  if (!searchRes.ok || !searchData.dishes?.length) throw new Error("Search returned no dishes")
  console.log("✓ /api/search", searchData.dishes.length, "dishes")

  const dish = searchData.dishes[0]
  const { res: couponRes, data: couponData } = await post("/api/coupons", {
    addressId: history.addressId,
  })
  if (!couponRes.ok) throw new Error("Coupons failed")
  console.log("✓ /api/coupons", couponData.coupon?.code ?? "none")

  const { res: cartRes, data: cartData } = await post("/api/cart", {
    addressId: history.addressId,
    dish,
    couponCode: couponData.coupon?.code ?? null,
  })
  if (!cartRes.ok || !cartData.success) throw new Error("Cart failed")
  console.log("✓ /api/cart")

  const { res: orderRes, data: orderData } = await post("/api/order", {
    addressId: history.addressId,
  })
  if (!orderRes.ok || !orderData.success) throw new Error("Order failed")
  console.log("✓ /api/order", orderData.orderId, orderData.demo ? "(demo)" : "(live)")

  console.log("\n✓ Full E2E flow passed.")
}

main().catch((e) => {
  console.error("\n✗ E2E failed:", e.message)
  process.exit(1)
})
