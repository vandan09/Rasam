/** Server-side runtime flags (use in API routes and Server Components). */

export function isSwiggyMockMode(): boolean {
  if (process.env.USE_SWIGGY_MOCK === "true") return true
  if (process.env.USE_SWIGGY_MOCK === "false") return false
  const key = process.env.SWIGGY_MCP_API_KEY
  return !key || key === "your_swiggy_mcp_key_here"
}

export function isAnthropicConfigured(): boolean {
  const key = process.env.ANTHROPIC_API_KEY
  return Boolean(key && key !== "your_anthropic_key_here")
}

export function isRealOrdersEnabled(): boolean {
  return process.env.ENABLE_REAL_ORDERS === "true" && !isSwiggyMockMode()
}

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true" || isSwiggyMockMode()
}

export function getPublicStatus() {
  return {
    demoMode: isDemoMode(),
    mockSwiggy: isSwiggyMockMode(),
    anthropicConfigured: isAnthropicConfigured(),
    realOrdersEnabled: isRealOrdersEnabled(),
  }
}
