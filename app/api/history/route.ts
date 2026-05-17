import { NextResponse } from "next/server"
import { getAddresses, getFoodOrders } from "@/lib/swiggy"

export async function GET() {
  try {
    const addresses = await getAddresses()
    const list = Array.isArray(addresses) ? addresses : []
    const addressId = list[0]?.id
    if (!addressId) return NextResponse.json({ recentDishes: [], addressId: null })

    const orders = await getFoodOrders({ addressId, orderCount: 10 })
    const recentDishes: string[] =
      orders?.orders
        ?.flatMap((o: { items?: { name?: string }[] }) =>
          o.items?.map((i) => i.name).filter(Boolean) as string[]
        )
        .slice(0, 10) ?? []

    return NextResponse.json({ recentDishes, addressId })
  } catch {
    return NextResponse.json({ recentDishes: [], addressId: null })
  }
}
