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
    const orderId = result?.orderId ?? null
    const demo =
      result?.demo === true || isSwiggyMockMode() || !isRealOrdersEnabled()

    if (!orderId) {
      return NextResponse.json({ error: "No order ID returned" }, { status: 502 })
    }

    return NextResponse.json({
      orderId,
      success: true,
      demo,
    })
  } catch (err) {
    console.error("[/api/order]", err)
    return NextResponse.json({ error: "Order failed" }, { status: 500 })
  }
}
