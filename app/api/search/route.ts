import { NextRequest, NextResponse } from "next/server"
export { dynamic } from "@/lib/api-route"
import { getFallbackKeywords } from "@/lib/mood-map"
import { dedupeAndRankDishes, filterByVeg, normalizeMenuItems } from "@/lib/search-utils"
import { resolveAddressId, searchMenu } from "@/lib/swiggy"

export async function POST(req: NextRequest) {
  try {
    const { keywords, addressId: provided, vegFilter, moodLabel } = await req.json()

    const addressId = await resolveAddressId(provided)
    const searchKeywords: string[] =
      Array.isArray(keywords) && keywords.length > 0
        ? keywords
        : getFallbackKeywords(moodLabel)

    const results = await Promise.all(
      searchKeywords.map((keyword: string) =>
        searchMenu({ addressId, query: keyword, vegFilter: vegFilter ?? 0 })
      )
    )

    const allDishes = results.flatMap((r) => normalizeMenuItems(r))
    const filtered = filterByVeg(allDishes, vegFilter ?? 0)
    const dishes = dedupeAndRankDishes(filtered, 6)

    return NextResponse.json({ dishes, addressId })
  } catch (err) {
    console.error("[/api/search]", err)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
