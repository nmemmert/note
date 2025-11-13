import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

// In-memory storage for share links (in production, use database)
const shareLinks = new Map<string, { noteId: string; createdAt: Date; expiresAt?: Date }>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { expiresIn } = await request.json(); // expiresIn in days, optional
    
    // Generate unique share token
    const shareToken = crypto.randomBytes(32).toString('hex');
    
    const shareData: { noteId: string; createdAt: Date; expiresAt?: Date } = {
      noteId: id,
      createdAt: new Date(),
    };
    
    if (expiresIn) {
      shareData.expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
    }
    
    shareLinks.set(shareToken, shareData);
    
    const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shared/${shareToken}`;
    
    return NextResponse.json({
      success: true,
      shareUrl,
      shareToken,
      expiresAt: shareData.expiresAt,
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { shareToken } = await request.json();
    
    if (shareLinks.has(shareToken)) {
      shareLinks.delete(shareToken);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Share link not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting share link:', error);
    return NextResponse.json({ error: 'Failed to delete share link' }, { status: 500 });
  }
}

// Export shareLinks for access in shared page
export { shareLinks };
