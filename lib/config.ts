export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.USE_SWIGGY_MOCK === "true" ||
    !process.env.SWIGGY_MCP_API_KEY ||
    process.env.SWIGGY_MCP_API_KEY === "your_swiggy_mcp_key_here"
  )
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://rasam.vercel.app"
