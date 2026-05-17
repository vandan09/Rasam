import { interpretMood } from "../lib/claude"
import { getAddresses, isSwiggyMockMode, searchMenu } from "../lib/swiggy"

async function main() {
  console.log(`── Swiggy mode: ${isSwiggyMockMode() ? "MOCK" : "LIVE"} ──`)

  console.log("\n── Testing Swiggy: get_addresses ──")
  const addresses = await getAddresses()
  console.log("Addresses:", JSON.stringify(addresses, null, 2))

  const addressId = Array.isArray(addresses) ? addresses[0]?.id : null
  if (!addressId) throw new Error("No addressId found")

  console.log("\n── Testing Swiggy: search_menu ──")
  const results = await searchMenu({ addressId, query: "biryani" })
  const first = results?.items?.[0]
  console.log("First result:", JSON.stringify(first, null, 2))

  console.log("\n── Testing Claude: mood interpretation ──")
  const mood = await interpretMood([
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
  ])
  console.log("Mood result:", JSON.stringify(mood, null, 2))

  console.log("\n✓ All checks passed. Phase 1 complete.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
