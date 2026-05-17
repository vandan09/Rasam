import { NextRequest, NextResponse } from "next/server"
export { dynamic } from "@/lib/api-route"
import { isRealOrdersEnabled, isSwiggyMockMode, placeFoodOrder } from "@/lib/swiggy"

export async function POST(req: NextRequest) {
  try {
    const { addressId } = await req.json()
    if (!addressId) {
      return NextResponse.json({ error: "Missing addressId" }, { status: 400 })
    }
    const result = await placeFoodOrder(addressId)
    const demo = isSwiggyMockMode() || !isRealOrdersEnabled()

    return NextResponse.json({
      orderId: result?.orderId ?? null,
      success: true,
      demo,
    })
  } catch (err) {
    console.error("[/api/order]", err)
    return NextResponse.json({ error: "Order failed" }, { status: 500 })
  }
}
