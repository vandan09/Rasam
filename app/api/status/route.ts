import { NextResponse } from "next/server"
export { dynamic } from "@/lib/api-route"
import { getPublicStatus } from "@/lib/runtime"

export async function GET() {
  return NextResponse.json(getPublicStatus())
}
