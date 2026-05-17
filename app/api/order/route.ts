import { NextRequest, NextResponse } from "next/server"
import { isRealOrdersEnabled, isSwiggyMockMode, placeFoodOrder } from "@/lib/swiggy"

export async function POST(req: NextRequest) {
  try {
    const { addressId } = await req.json()
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
