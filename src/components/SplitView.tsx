'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notebookId?: string;
  dueDate?: string;
  completed?: boolean;
  pinned?: boolean;
}

interface Notebook {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface SplitViewProps {
  notes: Note[];
  notebooks: Notebook[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onClose: () => void;
}

export default function SplitView({ notes, notebooks, onUpdateNote, onClose }: SplitViewProps) {
  const [leftNote, setLeftNote] = useState<Note | null>(notes[0] || null);
  const [rightNote, setRightNote] = useState<Note | null>(notes[1] || null);
  const [splitRatio, setSplitRatio] = useState(50); // Percentage for left pane
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const container = e.currentTarget.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
        setSplitRatio(Math.min(Math.max(newRatio, 20), 80)); // Limit between 20% and 80%
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">📑 Split View</h2>
            <div className="text-sm text-gray-600">
              Side-by-side editing
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            ✕ Exit Split View
          </button>
        </div>
      </div>

      {/* Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane */}
        <div
          className="flex flex-col border-r border-gray-200 overflow-hidden"
          style={{ width: `${splitRatio}%` }}
        >
          {/* Left Note Selector */}
          <div className="bg-white border-b border-gray-200 p-3">
            <select
              value={leftNote?.id || ''}
              onChange={(e) => {
                const note = notes.find(n => n.id === e.target.value);
                setLeftNote(note || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select a note...</option>
              {notes.map(note => (
                <option key={note.id} value={note.id}>
                  {note.title || 'Untitled'} {note.pinned ? '📌' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Left Editor */}
          <div className="flex-1 overflow-y-auto bg-white">
            {leftNote ? (
              <div className="p-6">
                <input
                  type="text"
                  value={leftNote.title}
                  onChange={(e) => onUpdateNote(leftNote.id, { title: e.target.value })}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full mb-4"
                  placeholder="Note title..."
                />
                <RichTextEditor
                  content={leftNote.content}
                  onChange={(content) => onUpdateNote(leftNote.id, { content })}
                  placeholder="Start writing..."
                  notebookId={leftNote.notebookId}
                  notebooks={notebooks}
                  onNotebookChange={(notebookId) => onUpdateNote(leftNote.id, { notebookId })}
                  tags={leftNote.tags}
                  onTagsChange={(tags) => onUpdateNote(leftNote.id, { tags })}
                  dueDate={leftNote.dueDate}
                  onDueDateChange={(dueDate) => onUpdateNote(leftNote.id, { dueDate })}
                  completed={leftNote.completed}
                  onCompletedChange={(completed) => onUpdateNote(leftNote.id, { completed })}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div>Select a note to edit</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizer */}
        <div
          className={`w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors ${
            isDragging ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        />

        {/* Right Pane */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: `${100 - splitRatio}%` }}
        >
          {/* Right Note Selector */}
          <div className="bg-white border-b border-gray-200 p-3">
            <select
              value={rightNote?.id || ''}
              onChange={(e) => {
                const note = notes.find(n => n.id === e.target.value);
                setRightNote(note || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select a note...</option>
              {notes.map(note => (
                <option key={note.id} value={note.id}>
                  {note.title || 'Untitled'} {note.pinned ? '📌' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Right Editor */}
          <div className="flex-1 overflow-y-auto bg-white">
            {rightNote ? (
              <div className="p-6">
                <input
                  type="text"
                  value={rightNote.title}
                  onChange={(e) => onUpdateNote(rightNote.id, { title: e.target.value })}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full mb-4"
                  placeholder="Note title..."
                />
                <RichTextEditor
                  content={rightNote.content}
                  onChange={(content) => onUpdateNote(rightNote.id, { content })}
                  placeholder="Start writing..."
                  notebookId={rightNote.notebookId}
                  notebooks={notebooks}
                  onNotebookChange={(notebookId) => onUpdateNote(rightNote.id, { notebookId })}
                  tags={rightNote.tags}
                  onTagsChange={(tags) => onUpdateNote(rightNote.id, { tags })}
                  dueDate={rightNote.dueDate}
                  onDueDateChange={(dueDate) => onUpdateNote(rightNote.id, { dueDate })}
                  completed={rightNote.completed}
                  onCompletedChange={(completed) => onUpdateNote(rightNote.id, { completed })}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div>Select a note to edit</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Tips */}
      <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
        <div className="flex items-center gap-6">
          <span>💡 Drag the center divider to resize panes</span>
          <span>📝 Edit two notes simultaneously</span>
          <span>🔄 Perfect for comparing or referencing notes</span>
        </div>
      </div>
    </div>
  );
}
