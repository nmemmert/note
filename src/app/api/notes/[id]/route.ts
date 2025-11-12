import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH update a note
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    console.log('PATCH /api/notes/[id] - Request:', { id, body })

    // Verify the note belongs to the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    // Transform tags array to string if present
    // Only include fields that exist in the Prisma schema
    const allowedFields = ['title', 'content', 'notebookId', 'tags', 'pinned', 'archived', 'favorite', 'dueDate', 'completed']
    const updateData: any = {}
    
    for (const key of allowedFields) {
      if (key in body) {
        if (key === 'tags' && Array.isArray(body[key])) {
          updateData[key] = body[key].join(',')
        } else {
          updateData[key] = body[key]
        }
      }
    }

    console.log('PATCH /api/notes/[id] - Update data:', updateData)

    const note = await prisma.note.update({
      where: { id },
      data: updateData
    })

    // Transform tags from string to array for response
    const transformedNote = {
      ...note,
      tags: note.tags ? note.tags.split(',').filter(Boolean) : [],
      dueDate: note.dueDate || undefined,
    }

    return NextResponse.json({ note: transformedNote })
  } catch (error) {
    console.error("Update note error:", error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify the note belongs to the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }

    await prisma.note.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete note error:", error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}