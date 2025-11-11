import { NextRequest, NextResponse } from 'next/server';
import { noteStorage } from '../../../lib/noteStorage';

export async function GET() {
  try {
    const notes = noteStorage.getAllNotes();
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags, category } = body;

    const newNote = noteStorage.createNote({
      title: title || 'New Note',
      content: content || '',
      tags: tags || [],
      category: category || 'General',
    });

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}