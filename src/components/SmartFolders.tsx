'use client';

import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: string;
  completed?: boolean;
}

interface SmartFolder {
  id: string;
  name: string;
  icon: string;
  description: string;
  filter: (note: Note) => boolean;
  color: string;
}

interface SmartFoldersProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onClose: () => void;
}

export default function SmartFolders({ notes, onSelectNote, onClose }: SmartFoldersProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const smartFolders: SmartFolder[] = [
    {
      id: 'recent',
      name: 'Recent Notes',
      icon: '⏱️',
      description: 'Notes updated in the last 7 days',
      color: 'bg-blue-500',
      filter: (note) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return note.updatedAt >= weekAgo;
      }
    },
    {
      id: 'today',
      name: 'Created Today',
      icon: '📅',
      description: 'Notes created today',
      color: 'bg-green-500',
      filter: (note) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const noteDate = new Date(note.createdAt);
        noteDate.setHours(0, 0, 0, 0);
        return noteDate.getTime() === today.getTime();
      }
    },
    {
      id: 'long-notes',
      name: 'Long Notes',
      icon: '📄',
      description: 'Notes with more than 500 words',
      color: 'bg-purple-500',
      filter: (note) => {
        const text = note.content.replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/).filter(w => w.length > 0);
        return words.length > 500;
      }
    },
    {
      id: 'short-notes',
      name: 'Quick Notes',
      icon: '✏️',
      description: 'Notes with less than 100 words',
      color: 'bg-yellow-500',
      filter: (note) => {
        const text = note.content.replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/).filter(w => w.length > 0);
        return words.length < 100 && words.length > 0;
      }
    },
    {
      id: 'untagged',
      name: 'Untagged Notes',
      icon: '🏷️',
      description: 'Notes without any tags',
      color: 'bg-gray-500',
      filter: (note) => note.tags.length === 0
    },
    {
      id: 'with-tasks',
      name: 'Notes with Tasks',
      icon: '✅',
      description: 'Notes containing checkboxes',
      color: 'bg-indigo-500',
      filter: (note) => note.content.includes('[ ]') || note.content.includes('[x]') || note.content.includes('[X]')
    },
    {
      id: 'due-soon',
      name: 'Due Soon',
      icon: '⏰',
      description: 'Notes with due dates in the next 7 days',
      color: 'bg-red-500',
      filter: (note) => {
        if (!note.dueDate) return false;
        const dueDate = new Date(note.dueDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return dueDate <= weekFromNow && !note.completed;
      }
    },
    {
      id: 'overdue',
      name: 'Overdue',
      icon: '⚠️',
      description: 'Notes past their due date',
      color: 'bg-red-600',
      filter: (note) => {
        if (!note.dueDate) return false;
        const dueDate = new Date(note.dueDate);
        const now = new Date();
        return dueDate < now && !note.completed;
      }
    },
    {
      id: 'untitled',
      name: 'Untitled Notes',
      icon: '📝',
      description: 'Notes without a title',
      color: 'bg-orange-500',
      filter: (note) => !note.title || note.title.trim() === ''
    },
    {
      id: 'old-notes',
      name: 'Old Notes',
      icon: '📚',
      description: 'Notes not updated in 30+ days',
      color: 'bg-teal-500',
      filter: (note) => {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return note.updatedAt < monthAgo;
      }
    }
  ];

  const getFilteredNotes = (folder: SmartFolder) => {
    return notes.filter(folder.filter);
  };

  const getPreview = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.substring(0, 100) + (text.length > 100 ? '...' : '');
  };

  const currentFolder = selectedFolder ? smartFolders.find(f => f.id === selectedFolder) : null;
  const currentNotes = currentFolder ? getFilteredNotes(currentFolder) : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex animate-slideIn overflow-hidden">
        {/* Sidebar with Smart Folders */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">🗂️ Smart Folders</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500">Automatic organization</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {smartFolders.map(folder => {
                const count = getFilteredNotes(folder).length;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedFolder === folder.id
                        ? 'bg-white shadow-md border-2 border-blue-500'
                        : 'hover:bg-white hover:shadow'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${folder.color} rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0`}>
                        {folder.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {folder.name}
                          </h3>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {count}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {folder.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {currentFolder ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${currentFolder.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                    {currentFolder.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{currentFolder.name}</h3>
                    <p className="text-sm text-gray-500">{currentFolder.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {currentNotes.length > 0 ? (
                  <div className="space-y-3">
                    {currentNotes.map(note => (
                      <div
                        key={note.id}
                        onClick={() => {
                          onSelectNote(note);
                          onClose();
                        }}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                          {note.title || 'Untitled'}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {getPreview(note.content)}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{note.updatedAt.toLocaleDateString()}</span>
                          {note.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex gap-1 flex-wrap">
                                {note.tags.slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {note.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    +{note.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className={`w-20 h-20 ${currentFolder.color} rounded-2xl flex items-center justify-center text-white text-4xl mb-4`}>
                      {currentFolder.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No notes in this folder
                    </h3>
                    <p className="text-gray-500 max-w-sm">
                      {currentFolder.description}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-6xl mb-4">🗂️</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Folders</h3>
              <p className="text-gray-500 max-w-md">
                Select a smart folder from the left to view automatically organized notes based on various criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
