import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/link"
import { getAuthUser } from "@/lib/get-auth-user"

/**
 * DELETE /api/links/:id
 * Delete a link (only if it belongs to the user)
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.info("[LINKS] DELETE /api/links/:id", { id: params.id })

  try {
    // Authenticate
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find and delete link (only if it belongs to user)
    const link = await Link.findOneAndDelete({
      _id: params.id,
      userId: user.userId,
    })

    if (!link) {
      return NextResponse.json(
        { message: "Link not found or unauthorized" },
        { status: 404 }
      )
    }

    console.info("[LINKS] Link deleted", {
      id: params.id,
      shortCode: link.shortCode,
    })

    return NextResponse.json({
      success: true,
      message: "Link deleted",
    })
  } catch (error) {
    console.error("[LINKS] Delete failed", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/links/:id
 * Get a single link's details
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.info("[LINKS] GET /api/links/:id", { id: params.id })

  try {
    // Authenticate
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find link (only if it belongs to user)
    const link = await Link.findOne({
      _id: params.id,
      userId: user.userId,
    })

    if (!link) {
      return NextResponse.json(
        { message: "Link not found or unauthorized" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      link: {
        _id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        clicks: link.clicks,
        createdAt: link.createdAt,
        aiStatus: link.aiStatus,
        tags: link.tags,
        riskScore: link.riskScore,
      },
    })
  } catch (error) {
    console.error("[LINKS] Get failed", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}