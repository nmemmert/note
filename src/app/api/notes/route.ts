import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all notes for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { pinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    // Transform tags from string to array
    const transformedNotes = notes.map((note: any) => ({
      ...note,
      tags: note.tags ? note.tags.split(',').filter(Boolean) : [],
      dueDate: note.dueDate || undefined,
    }))

    return NextResponse.json({ notes: transformedNotes })
  } catch (error) {
    console.error("Get notes error:", error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST create a new note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json();
    const { title, content, notebookId, tags, pinned, archived, favorite, dueDate, completed } = body;

    // Ensure default notebooks exist for the user
    const defaultNotebooks = [
      { id: 'general', name: 'General', icon: '📝' },
      { id: 'personal', name: 'Personal', icon: '👤' },
      { id: 'work', name: 'Work', icon: '💼' },
    ];

    // Create default notebooks if they don't exist
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
          icon: defaultNotebook.icon,
          userId: session.user.id,
        }
      });
    }

    // Get the target notebook
    const targetNotebookId = notebookId || 'general';
    const notebook = await prisma.notebook.findUnique({
      where: {
        id_userId: {
          id: targetNotebookId,
          userId: session.user.id
        }
      }
    });

    if (!notebook) {
      return NextResponse.json(
        { error: "Notebook not found" },
        { status: 404 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title: title || 'Untitled',
        content: content || '',
        notebookId: targetNotebookId,
        tags: Array.isArray(tags) ? tags.join(',') : '',
        pinned: pinned || false,
        archived: archived || false,
        favorite: favorite || false,
        dueDate: dueDate || null,
        completed: completed || false,
        userId: session.user.id,
      }
    })

    // Transform tags from string to array for response
    const transformedNote = {
      ...note,
      tags: note.tags ? note.tags.split(',').filter(Boolean) : [],
      dueDate: note.dueDate || undefined,
    }

    return NextResponse.json({ note: transformedNote }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
