import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all notebooks for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const notebooks = await prisma.notebook.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ notebooks })
  } catch (error) {
    console.error("Get notebooks error:", error)
    return NextResponse.json({ error: 'Failed to fetch notebooks' }, { status: 500 });
  }
}
