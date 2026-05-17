import { NextRequest, NextResponse } from "next/server"
import { applyFoodCoupon, flushFoodCart, isSwiggyMockMode, updateFoodCart } from "@/lib/swiggy"

export async function POST(req: NextRequest) {
  try {
    const { addressId, dish, couponCode } = await req.json()

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
