import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/link"
import { getAuthUser } from "@/lib/get-auth-user"

export async function GET(req: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const linkId = searchParams.get("linkId")

  if (!linkId) {
    return NextResponse.json({ message: "Missing linkId" }, { status: 400 })
  }

  await connectDB()

  const link = await Link.findOne({ _id: linkId, userId: user.userId })
  if (!link || !link.requestId) {
    return NextResponse.json({ status: "no-agent" })
  }

  // Call agent-service
  try {
    const res = await fetch(
      `${process.env.AGENT_API_URL}/api/v1/agent/result/${link.requestId}`,
      {
        headers: {
          "X-API-KEY": process.env.INTERNAL_API_KEY!,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ status: "pending" })
    }

    const agentResult = await res.json()

    if (agentResult.status !== "completed") {
      return NextResponse.json({ status: agentResult.status })
    }

    // Update link with AI result
    link.aiStatus = "completed"
    link.aiResult = agentResult.result
    link.tags = agentResult.result.tags
    link.riskScore = agentResult.result.risk_score

    // Optionally auto-apply alias
    if (!link.customAlias && agentResult.result.suggested_alias) {
      link.shortCode = agentResult.result.suggested_alias
    }

    await link.save()

    return NextResponse.json({
      status: "completed",
      result: agentResult.result,
    })
  } catch {
    // Agent down
    return NextResponse.json({ status: "pending" })
  }
}
