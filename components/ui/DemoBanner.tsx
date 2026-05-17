export default function DemoBanner() {
  const show =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE !== "false"

  if (!show) return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
      Demo mode — add API keys in .env.local for live Swiggy &amp; Claude
    </div>
  )
}
