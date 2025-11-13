import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory version storage (in production, use database)
const noteVersions = new Map<string, Array<{
  id: string;
  noteId: string;
  title: string;
  content: string;
  tags: string[];
  notebookId?: string;
  timestamp: Date;
  createdBy?: string;
}>>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const versions = noteVersions.get(params.id) || [];
    
    return NextResponse.json({
      versions: versions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, tags, notebookId } = await request.json();
    
    const versions = noteVersions.get(params.id) || [];
    
    const newVersion = {
      id: `version-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      noteId: params.id,
      title,
      content,
      tags: tags || [],
      notebookId,
      timestamp: new Date(),
      createdBy: session.user.email,
    };
    
    versions.push(newVersion);
    noteVersions.set(params.id, versions);
    
    // Keep only last 50 versions per note
    if (versions.length > 50) {
      noteVersions.set(params.id, versions.slice(-50));
    }
    
    return NextResponse.json({
      success: true,
      version: newVersion,
    });
  } catch (error) {
    console.error('Error creating version:', error);
    return NextResponse.json({ error: 'Failed to create version' }, { status: 500 });
  }
}

// Export for access from other routes
export { noteVersions };
