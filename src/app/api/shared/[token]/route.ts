import { NextRequest, NextResponse } from 'next/server';

// Import shareLinks from share route (in production, use database)
let shareLinks: Map<string, { noteId: string; createdAt: Date; expiresAt?: Date }>;

// Mock notes storage (in production, fetch from database)
const mockNotes = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // In production, fetch from database
    // For now, we'll need to dynamically import to avoid circular dependency
    const shareModule = await import('@/app/api/notes/[id]/share/route');
    shareLinks = shareModule.shareLinks;
    
    const shareData = shareLinks.get(params.token);
    
    if (!shareData) {
      return NextResponse.json({ error: 'Share link not found or expired' }, { status: 404 });
    }
    
    // Check if link has expired
    if (shareData.expiresAt && shareData.expiresAt < new Date()) {
      shareLinks.delete(params.token);
      return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
    }
    
    // Fetch the note (in production, from database)
    // For now, we'll fetch from the notes API
    const noteResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notes/${shareData.noteId}`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });
    
    if (!noteResponse.ok) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    const noteData = await noteResponse.json();
    
    // Return note without sensitive data
    return NextResponse.json({
      note: {
        id: noteData.id,
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
        createdAt: noteData.createdAt,
        updatedAt: noteData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching shared note:', error);
    return NextResponse.json({ error: 'Failed to fetch shared note' }, { status: 500 });
  }
}
