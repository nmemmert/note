export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  notebookId?: string;
  pinned?: boolean;
  archived?: boolean;
  favorite?: boolean;
  versions?: NoteVersion[];
  dueDate?: string;
  completed?: boolean;
}

export interface NoteVersion {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Notebook {
  id: string;
  name: string;
  icon: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
