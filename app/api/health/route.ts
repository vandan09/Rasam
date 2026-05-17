import { NextResponse } from "next/server"
export { dynamic } from "@/lib/api-route"

export async function GET() {
  return NextResponse.json({ ok: true, service: "rasam" })
}
