import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Import noteVersions from versions route
    const versionsModule = await import('../route');
    const noteVersions = versionsModule.noteVersions;
    
    const versions = noteVersions.get(params.id) || [];
    const version = versions.find(v => v.id === params.versionId);
    
    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }
    
    // Return the version data to restore
    return NextResponse.json({
      success: true,
      version: {
        title: version.title,
        content: version.content,
        tags: version.tags,
        notebookId: version.notebookId,
      },
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 });
  }
}
