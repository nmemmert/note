import Database from 'better-sqlite3';
import path from 'path';

// Create database connection
const dbPath = path.join(process.cwd(), 'notes.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT, -- JSON string of tags array
    category TEXT DEFAULT 'General',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepare statements
const insertNote = db.prepare(`
  INSERT INTO notes (id, title, content, tags, category, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const updateNote = db.prepare(`
  UPDATE notes
  SET title = ?, content = ?, tags = ?, category = ?, updated_at = ?
  WHERE id = ?
`);

const deleteNote = db.prepare('DELETE FROM notes WHERE id = ?');

const getNoteById = db.prepare('SELECT * FROM notes WHERE id = ?');

const getAllNotes = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC');

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

class NoteStorage {
  getAllNotes(): Note[] {
    const rows = getAllNotes.all() as Array<{
      id: string;
      title: string;
      content: string;
      tags: string;
      category: string;
      created_at: string;
      updated_at: string;
    }>;

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      tags: JSON.parse(row.tags || '[]'), // This should always be an array
      category: row.category || 'General',
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  getNoteById(id: string): Note | undefined {
    const row = getNoteById.get(id) as {
      id: string;
      title: string;
      content: string;
      tags: string;
      category: string;
      created_at: string;
      updated_at: string;
    } | undefined;
    if (!row) return undefined;

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      tags: JSON.parse(row.tags || '[]'), // This should always be an array
      category: row.category || 'General',
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const id = Date.now().toString();
    const now = new Date();

    insertNote.run(
      id,
      noteData.title,
      noteData.content,
      JSON.stringify(noteData.tags),
      noteData.category,
      now.toISOString(),
      now.toISOString()
    );

    return {
      id,
      ...noteData,
      createdAt: now,
      updatedAt: now,
    };
  }

  updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
    const existingNote = this.getNoteById(id);
    if (!existingNote) return null;

    const now = new Date();
    const updatedNote = {
      ...existingNote,
      ...updates,
      updatedAt: now,
    };

    updateNote.run(
      updatedNote.title,
      updatedNote.content,
      JSON.stringify(updatedNote.tags),
      updatedNote.category,
      now.toISOString(),
      id
    );

    return updatedNote;
  }

  deleteNote(id: string): Note | null {
    const existingNote = this.getNoteById(id);
    if (!existingNote) return null;

    deleteNote.run(id);
    return existingNote;
  }

  syncNotes(localNotes: Note[], lastSync?: Date): { notes: Note[]; lastSync: Date } {
    // For now, just return all notes from database
    // In a real implementation, you'd implement proper sync logic
    const serverNotes = this.getAllNotes();
    const mergedNotes: Note[] = [...serverNotes];

    // Add any local notes that don't exist on server
    localNotes.forEach(localNote => {
      if (!serverNotes.find(n => n.id === localNote.id)) {
        this.createNote({
          title: localNote.title,
          content: localNote.content,
          tags: localNote.tags,
          category: localNote.category,
        });
        mergedNotes.push(localNote);
      }
    });

    return {
      notes: mergedNotes,
      lastSync: new Date(),
    };
  }
}

// Export a singleton instance
export const noteStorage = new NoteStorage();

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));