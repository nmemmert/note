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

    // Ensure default notebooks exist for every user
    const defaultNotebooks = [
      { id: 'general', name: 'General', description: 'General notes and ideas', color: '#3b82f6', icon: '📝' },
      { id: 'personal', name: 'Personal', description: 'Personal notes and reminders', color: '#10b981', icon: '👤' },
      { id: 'work', name: 'Work', description: 'Work-related notes and tasks', color: '#f59e0b', icon: '💼' },
    ];

    // Create default notebooks if they don't exist using upsert
    for (const defaultNotebook of defaultNotebooks) {
      await prisma.notebook.upsert({
        where: {
          id_userId: {
            id: defaultNotebook.id,
            userId: session.user.id
          }
        },
        update: {},
        create: {
          id: defaultNotebook.id,
          name: defaultNotebook.name,
          description: defaultNotebook.description,
          color: defaultNotebook.color,
          icon: defaultNotebook.icon,
          userId: session.user.id,
        }
      });
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
