import type { SwiggyDish } from "./types"

export function normalizeMenuItems(raw: unknown): SwiggyDish[] {
  const items = (raw as { items?: unknown[] })?.items ?? []
  const dishes: SwiggyDish[] = []

  for (const item of items) {
    const row = item as Record<string, unknown>
    const status = row.availabilityStatus as string | undefined
    if (status && status !== "OPEN") continue

    dishes.push({
      itemId: String(row.itemId ?? row.id ?? ""),
      name: String(row.name ?? ""),
      price: Number(row.price ?? 0),
      restaurantId: String(row.restaurantId ?? ""),
      restaurantName: String(row.restaurantName ?? ""),
      distanceKm: Number(row.distanceKm ?? 0),
      rating: Number(row.rating ?? 0),
      imageUrl: row.imageUrl ? String(row.imageUrl) : undefined,
      isVeg: Boolean(row.isVeg),
    })
  }

  return dishes.filter((d) => d.itemId && d.name)
}

export function dedupeAndRankDishes(dishes: SwiggyDish[], limit = 6): SwiggyDish[] {
  const seen = new Set<string>()
  const unique: SwiggyDish[] = []

  for (const dish of dishes) {
    if (seen.has(dish.itemId)) continue
    seen.add(dish.itemId)
    unique.push(dish)
  }

  return unique.sort((a, b) => b.rating - a.rating).slice(0, limit)
}
