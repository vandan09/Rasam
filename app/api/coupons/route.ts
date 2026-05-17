import { NextRequest, NextResponse } from "next/server"
import { fetchFoodCoupons, resolveAddressId } from "@/lib/swiggy"

export async function POST(req: NextRequest) {
  try {
    const { addressId: provided } = await req.json()
    const addressId = await resolveAddressId(provided)
    const data = await fetchFoodCoupons(addressId)
    const coupon = data?.coupons?.[0] ?? null
    return NextResponse.json({ coupon })
  } catch (err) {
    console.error("[/api/coupons]", err)
    return NextResponse.json({ coupon: null })
  }
}
