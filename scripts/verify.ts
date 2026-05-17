import { QUESTIONS } from "../lib/questions"
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
    {
      questionId: "q1",
      question: QUESTIONS[0].text,
      answer: QUESTIONS[0].options[0],
    },
    {
      questionId: "q2",
      question: QUESTIONS[1].text,
      answer: QUESTIONS[1].options[1],
    },
    {
      questionId: "q3",
      question: QUESTIONS[2].text,
      answer: QUESTIONS[2].options[0],
    },
    {
      questionId: "q4",
      question: QUESTIONS[3].text,
      answer: QUESTIONS[3].options[0],
    },
  ])
  console.log("Mood result:", JSON.stringify(mood, null, 2))

  console.log("\n✓ All checks passed. Phase 1 complete.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
