import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const startTime = Date.now()
  
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    app: process.env.NEXT_PUBLIC_APP_NAME || "CR AudioViz AI App",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "production",
    latency_ms: Date.now() - startTime
  }
  
  return NextResponse.json(health, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  })
}
