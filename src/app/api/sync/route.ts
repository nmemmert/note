import { NextRequest, NextResponse } from 'next/server';
import { noteStorage } from '../../../lib/noteStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { localNotes, lastSync } = body;

    const result = noteStorage.syncNotes(localNotes, lastSync ? new Date(lastSync) : undefined);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync notes' }, { status: 500 });
  }
}