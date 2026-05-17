"use client"

import { useEffect, useState } from "react"

interface Status {
  demoMode: boolean
  mockSwiggy: boolean
}

export default function DemoBanner() {
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [])

  if (!status?.demoMode && !status?.mockSwiggy) return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
      {status.mockSwiggy
        ? "Demo mode — Swiggy mock data. Add SWIGGY_MCP_API_KEY for live menus."
        : "Demo mode — set ENABLE_REAL_ORDERS=true for live checkout."}
    </div>
  )
}
