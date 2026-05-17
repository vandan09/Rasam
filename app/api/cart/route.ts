import { NextRequest, NextResponse } from "next/server"
export { dynamic } from "@/lib/api-route"
import { applyFoodCoupon, flushFoodCart, isSwiggyMockMode, updateFoodCart } from "@/lib/swiggy"

export async function POST(req: NextRequest) {
  try {
    const { addressId, dish, couponCode } = await req.json()

    if (!addressId || !dish?.itemId || !dish?.restaurantId) {
      return NextResponse.json({ error: "Missing address or dish" }, { status: 400 })
    }

    if (!isSwiggyMockMode()) {
      await flushFoodCart(addressId)
    }

    await updateFoodCart({
      addressId,
      itemId: dish.itemId,
      restaurantId: dish.restaurantId,
      quantity: 1,
    })

    if (couponCode) {
      await applyFoodCoupon({ addressId, couponCode })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[/api/cart]", err)
    return NextResponse.json({ error: "Cart update failed" }, { status: 500 })
  }
}
