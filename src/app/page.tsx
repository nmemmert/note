'use client';

import { useState, useEffect, useCallback } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import TemplateSelector from '../components/TemplateSelector';
import WebClipper from '../components/WebClipper';
import ExportDialog from '../components/ExportDialog';
import UpNoteImporter from '../components/UpNoteImporter';
import { TableOfContents } from '../components/TableOfContents';
import { CalendarView } from '../components/CalendarView';
import { BackupDialog } from '../components/BackupDialog';

// Global function to update note tags
declare global {
  var updateNoteTags: ((tags: string[]) => void) | undefined;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notebookId?: string; // Changed from category to notebookId
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
  versions?: NoteVersion[];
  dueDate?: string; // For task management
  completed?: boolean; // For task completion status
}

interface NoteVersion {
  id: string;
  timestamp: Date;
  title: string;
  content: string;
  tags: string[];
  notebookId?: string; // Changed from category to notebookId
}

interface Notebook {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const [showNewNotebookDialog, setShowNewNotebookDialog] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newNotebookDescription, setNewNotebookDescription] = useState('');
  const [newNotebookColor, setNewNotebookColor] = useState('#3b82f6');
  const [newNotebookIcon, setNewNotebookIcon] = useState('📓');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showWebClipper, setShowWebClipper] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showUpNoteImporter, setShowUpNoteImporter] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    dateFrom: '',
    dateTo: '',
    hasTasks: false,
    completed: 'all', // 'all', 'completed', 'incomplete'
    contentType: 'all', // 'all', 'text', 'images', 'links'
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  // Load notes and folders from localStorage on mount
  useEffect(() => {
    const initializeData = () => {
      const savedNotes = localStorage.getItem('notes');
      const savedNotebooks = localStorage.getItem('notebooks');
      
      // Initialize default notebooks if none exist
      let initialNotebooks: Notebook[] = [];
      if (savedNotebooks) {
        try {
          initialNotebooks = JSON.parse(savedNotebooks).map((notebook: any) => ({
            ...notebook,
            createdAt: new Date(notebook.createdAt),
            updatedAt: new Date(notebook.updatedAt),
          }));
        } catch (error) {
          console.error('Failed to parse saved notebooks:', error);
        }
      }

      // Create default notebooks if none exist
      if (initialNotebooks.length === 0) {
        initialNotebooks = [
          {
            id: 'general',
            name: 'General',
            description: 'General notes and ideas',
            color: '#6b7280',
            icon: '📓',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'work',
            name: 'Work',
            description: 'Work-related notes and tasks',
            color: '#3b82f6',
            icon: '💼',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'personal',
            name: 'Personal',
            description: 'Personal notes and thoughts',
            color: '#10b981',
            icon: '🏠',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
      setNotebooks(initialNotebooks);

      if (savedNotes) {
        try {
          const parsedNotes: Note[] = JSON.parse(savedNotes).map((note: any) => ({
            ...note,
            tags: note.tags || [],
            notebookId: note.notebookId || note.category === 'General' ? 'general' : 
                       note.category === 'Work' ? 'work' :
                       note.category === 'Personal' ? 'personal' : 'general', // Migration from old category system
            pinned: note.pinned || false,
            versions: note.versions || [],
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
          return parsedNotes;
        } catch (error) {
          console.error('Failed to parse saved notes:', error);
        }
      }

      return null;
    };

    const loadedNotes = initializeData();
    if (loadedNotes) {
      setNotes(loadedNotes);
      setActiveNote(loadedNotes.length > 0 ? loadedNotes[0] : null);
    } else {
      // Create a welcome note
      const welcomeNote: Note = {
        id: '1',
        title: 'Welcome to NoteMaster',
        content: '<p>Start taking notes! This app is designed to be better than UpNote with rich text editing, powerful search, and a clean interface.</p>',
        tags: ['welcome', 'getting-started'],
        notebookId: 'general',
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes([welcomeNote]);
      setActiveNote(welcomeNote);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Save notebooks to localStorage whenever notebooks change
  useEffect(() => {
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  const createNewNote = (content: string = '', notebookId?: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content,
      tags: [],
      notebookId: notebookId || selectedNotebook !== 'All' ? selectedNotebook : 'general',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
  };

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === id) {
        // Create a version before updating (only for significant changes)
        const shouldCreateVersion = updates.content !== undefined || updates.title !== undefined;
        const newVersions = shouldCreateVersion ? [
          ...(note.versions || []),
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            title: note.title,
            content: note.content,
            tags: [...note.tags],
            notebookId: note.notebookId,
          }
        ].slice(-10) : note.versions || []; // Keep only last 10 versions

        return { 
          ...note, 
          ...updates, 
          updatedAt: new Date(),
          versions: newVersions
        };
      }
      return note;
    }));
  }, []);

  const togglePinNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { pinned: !note.pinned });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    
    // If we're deleting the active note, select the first remaining note
    if (activeNote?.id === id) {
      const remainingNotes = notes.filter(note => note.id !== id);
      setActiveNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
  };

  const selectNote = (id: string) => {
    setActiveNote(notes.find(note => note.id === id) || null);
    // Track recently accessed notes
    setRecentNotes(prev => {
      const filtered = prev.filter(noteId => noteId !== id);
      return [id, ...filtered].slice(0, 5); // Keep only 5 most recent
    });
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNotebook = selectedNotebook === 'All' || note.notebookId === selectedNotebook;
      const matchesTag = selectedTag === 'All' || note.tags.includes(selectedTag);
      
      // Advanced filters
      const matchesDateFrom = !searchFilters.dateFrom || new Date(note.createdAt) >= new Date(searchFilters.dateFrom);
      const matchesDateTo = !searchFilters.dateTo || new Date(note.createdAt) <= new Date(searchFilters.dateTo);
      const matchesTasks = !searchFilters.hasTasks || (note.dueDate || note.content.includes('data-type="taskItem"'));
      const matchesCompleted = searchFilters.completed === 'all' || 
                              (searchFilters.completed === 'completed' && note.completed) ||
                              (searchFilters.completed === 'incomplete' && !note.completed);
      const matchesContentType = searchFilters.contentType === 'all' ||
                                (searchFilters.contentType === 'images' && note.content.includes('<img')) ||
                                (searchFilters.contentType === 'links' && note.content.includes('<a href')) ||
                                (searchFilters.contentType === 'text' && !note.content.includes('<img') && !note.content.includes('<a href'));
      
      return matchesSearch && matchesNotebook && matchesTag && matchesDateFrom && matchesDateTo && matchesTasks && matchesCompleted && matchesContentType;
    })
    .sort((a, b) => {
      // Pinned notes come first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then sort by updated date (most recent first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Set up global function for hashtag updates
  useEffect(() => {
    window.updateNoteTags = (hashtags: string[]) => {
      if (activeNote) {
        updateNote(activeNote.id, { tags: hashtags });
      }
    };

    return () => {
      window.updateNoteTags = undefined;
    };
  }, [activeNote]);

  const restoreVersion = (noteId: string, version: NoteVersion) => {
    updateNote(noteId, {
      title: version.title,
      content: version.content,
      tags: version.tags,
      notebookId: version.notebookId,
    });
    setShowVersionHistory(false);
  };

  const createNotebook = (name: string, description: string = '', color: string = '#3b82f6', icon: string = '📓') => {
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name,
      description,
      color,
      icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotebooks(prev => [...prev, newNotebook]);
    return newNotebook.id;
  };

  const deleteNotebook = (id: string) => {
    // Move notes in this notebook to 'general'
    setNotes(prev => prev.map(note => 
      note.notebookId === id ? { ...note, notebookId: 'general' } : note
    ));
    
    // Don't allow deletion of default notebooks
    if (!['general', 'work', 'personal'].includes(id)) {
      setNotebooks(prev => prev.filter(n => n.id !== id));
    }
  };

  const updateNotebook = (id: string, updates: Partial<Notebook>) => {
    setNotebooks(prev => prev.map(notebook => 
      notebook.id === id ? { ...notebook, ...updates, updatedAt: new Date() } : notebook
    ));
  };

  const handleWebClip = (title: string, content: string, url?: string) => {
    const clippedContent = url 
      ? `<h2>${title}</h2><p><em>Source: <a href="${url}" target="_blank">${url}</a></em></p><br>${content}`
      : `<h2>${title}</h2><br>${content}`;
    
    createNewNote(clippedContent);
  };

  const handleUpNoteImport = (importedNotes: Array<{
    title: string;
    content: string;
    tags: string[];
    notebook?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>) => {
    const notesToAdd = importedNotes.map(importedNote => {
      // Find or create notebook
      let notebookId = 'general';
      if (importedNote.notebook) {
        let existingNotebook = notebooks.find(nb => 
          nb.name.toLowerCase() === importedNote.notebook!.toLowerCase()
        );
        
        if (!existingNotebook) {
          // Create new notebook for imported notes
          const newNotebook: Notebook = {
            id: Date.now().toString() + Math.random(),
            name: importedNote.notebook,
            description: `Imported from UpNote`,
            color: '#8b5cf6',
            icon: '📂',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setNotebooks(prev => [...prev, newNotebook]);
          notebookId = newNotebook.id;
        } else {
          notebookId = existingNotebook.id;
        }
      }

      const note: Note = {
        id: Date.now().toString() + Math.random(),
        title: importedNote.title || 'Imported Note',
        content: importedNote.content || '',
        tags: importedNote.tags || [],
        notebookId,
        pinned: false,
        createdAt: importedNote.createdAt || new Date(),
        updatedAt: importedNote.updatedAt || new Date(),
        versions: [],
      };
      
      return note;
    });

    setNotes(prev => [...notesToAdd, ...prev]);
    
    // Select the first imported note
    if (notesToAdd.length > 0) {
      setActiveNote(notesToAdd[0]);
    }
    
    setShowUpNoteImporter(false);
  };

  const handleBackup = () => {
    const backupData = {
      notes,
      notebooks,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notemaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        if (backupData.notes && backupData.notebooks) {
          // Restore notes with proper date parsing
          const restoredNotes = backupData.notes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            versions: note.versions?.map((version: any) => ({
              ...version,
              timestamp: new Date(version.timestamp),
            })) || [],
          }));
          
          // Restore notebooks with proper date parsing
          const restoredNotebooks = backupData.notebooks.map((notebook: any) => ({
            ...notebook,
            createdAt: new Date(notebook.createdAt),
            updatedAt: new Date(notebook.updatedAt),
          }));
          
          setNotes(restoredNotes);
          setNotebooks(restoredNotebooks);
          
          if (restoredNotes.length > 0) {
            setActiveNote(restoredNotes[0]);
          }
          
          alert('Backup restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (error) {
        alert('Failed to restore backup. Please check the file format.');
        console.error('Restore error:', error);
      }
    };
    reader.readAsText(file);
  };

  // Close sidebar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSidebarMenu && !(event.target as Element).closest('.sidebar-menu')) {
        setShowSidebarMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSidebarMenu]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">NoteMaster</h1>
            <div className="flex flex-wrap gap-1 justify-end">
              <div className="relative sidebar-menu">
              <button
                  onClick={() => setShowSidebarMenu(!showSidebarMenu)}
                  className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  title="Menu"
                >
                  ☰
                </button>
                
                {showSidebarMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowQuickAccess(!showQuickAccess);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>⚡</span> Quick Access
                      </button>
                      <button
                        onClick={() => {
                          setShowWebClipper(true);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>📎</span> Web Clipper
                      </button>
                      <button
                        onClick={() => {
                          setShowUpNoteImporter(true);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>📥</span> Import from UpNote
                      </button>
                      <button
                        onClick={() => {
                          setShowNewNotebookDialog(true);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>📚</span> New Notebook
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowAdvancedSearch(!showAdvancedSearch);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>🔍</span> Advanced Search
                      </button>
                      <button
                        onClick={() => {
                          setShowCalendar(!showCalendar);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>📅</span> Calendar View
                      </button>
                      <button
                        onClick={() => {
                          setShowTableOfContents(!showTableOfContents);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>📋</span> Table of Contents
                      </button>
                      <button
                        onClick={() => {
                          setShowBackupDialog(true);
                          setShowSidebarMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>💾</span> Backup & Restore
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Note
          </button>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
            {showAdvancedSearch && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                <h4 className="font-medium mb-2">Advanced Filters</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      placeholder="From date"
                      value={searchFilters.dateFrom}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="date"
                      placeholder="To date"
                      value={searchFilters.dateTo}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasTasks"
                      checked={searchFilters.hasTasks}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, hasTasks: e.target.checked }))}
                    />
                    <label htmlFor="hasTasks" className="text-sm">Has tasks</label>
                  </div>
                  <select
                    value={searchFilters.completed}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, completed: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="all">All tasks</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                  <select
                    value={searchFilters.contentType}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, contentType: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="all">All content</option>
                    <option value="text">Text only</option>
                    <option value="images">With images</option>
                    <option value="links">With links</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Notebook</label>
              <select
                value={selectedNotebook}
                onChange={(e) => setSelectedNotebook(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
              >
                <option value="All">All Notebooks</option>
                {notebooks.map(notebook => (
                  <option key={notebook.id} value={notebook.id}>
                    {notebook.icon} {notebook.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
              >
                <option value="All">All Tags</option>
                {Array.from(new Set(notes.flatMap(note => note.tags || []))).map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeNote?.id === note.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {note.pinned && <span className="text-yellow-500">📌</span>}
                    <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">
                        {note.updatedAt.toLocaleDateString()}
                      </p>
                      {note.notebookId && notebooks.find(nb => nb.id === note.notebookId) && (
                        <span 
                          className="text-xs px-2 py-1 rounded text-white"
                          style={{ backgroundColor: notebooks.find(nb => nb.id === note.notebookId)?.color || '#6b7280' }}
                        >
                          {notebooks.find(nb => nb.id === note.notebookId)?.icon} {notebooks.find(nb => nb.id === note.notebookId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinNote(note.id);
                  }}
                  className={`ml-2 p-1 rounded hover:bg-gray-200 ${
                    note.pinned ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                  title={note.pinned ? 'Unpin note' : 'Pin note'}
                >
                  📌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Panel */}
      {showQuickAccess && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Recent Notes */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Notes</h3>
              <div className="space-y-2">
                {recentNotes.slice(0, 3).map(noteId => {
                  const note = notes.find(n => n.id === noteId);
                  if (!note) return null;
                  return (
                    <button
                      key={note.id}
                      onClick={() => {
                        selectNote(note.id);
                        setShowQuickAccess(false);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        {note.pinned && <span className="text-yellow-500 text-xs">📌</span>}
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {note.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {note.updatedAt.toLocaleDateString()}
                      </span>
                    </button>
                  );
                })}
                {recentNotes.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent notes</p>
                )}
              </div>
            </div>

            {/* Pinned Notes */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pinned Notes</h3>
              <div className="space-y-2">
                {notes.filter(note => note.pinned).slice(0, 3).map(note => (
                  <button
                    key={note.id}
                    onClick={() => {
                      selectNote(note.id);
                      setShowQuickAccess(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xs">📌</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {note.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {note.updatedAt.toLocaleDateString()}
                    </span>
                  </button>
                ))}
                {notes.filter(note => note.pinned).length === 0 && (
                  <p className="text-sm text-gray-500">No pinned notes</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            {/* Note Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none w-full mb-2"
                placeholder="Note title..."
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {activeNote.updatedAt.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowVersionHistory(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="Version History"
                  >
                    📚 History
                  </button>
                  <button
                    onClick={() => setShowExportDialog(true)}
                    className="text-green-600 hover:text-green-800 text-sm"
                    title="Export & Share"
                  >
                    📤 Export
                  </button>
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1 flex">
              <div className={`p-4 bg-white ${showCalendar || showTableOfContents ? 'flex-1' : 'w-full'}`}>
                <RichTextEditor
                  content={activeNote.content}
                  onChange={(content) => updateNote(activeNote.id, { content })}
                  placeholder="Start writing your note..."
                  notebookId={activeNote.notebookId}
                  notebooks={notebooks}
                  onNotebookChange={(notebookId) => updateNote(activeNote.id, { notebookId })}
                  tags={activeNote.tags}
                  onTagsChange={(tags) => updateNote(activeNote.id, { tags })}
                  dueDate={activeNote.dueDate}
                  onDueDateChange={(dueDate) => updateNote(activeNote.id, { dueDate })}
                  completed={activeNote.completed}
                  onCompletedChange={(completed) => updateNote(activeNote.id, { completed })}
                />
              </div>
              
              {/* Calendar View */}
              {showCalendar && (
                <div className="w-80 border-l border-gray-200 p-4 bg-white">
                  <CalendarView
                    selectedDate={selectedDate || undefined}
                    onDateSelect={setSelectedDate}
                    notes={notes.map(note => ({
                      id: note.id,
                      title: note.title,
                      createdAt: note.createdAt.toISOString(),
                      dueDate: note.dueDate,
                    }))}
                  />
                </div>
              )}
              
              {/* Table of Contents */}
              {showTableOfContents && (
                <div className="w-64 border-l border-gray-200 p-4 bg-white">
                  <div>Table of Contents will be implemented with editor integration</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No notes selected</h2>
              <p className="text-gray-500">Create a new note or select one from the sidebar</p>
            </div>
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showVersionHistory && activeNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Version History - {activeNote.title}
                </h2>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Current Version */}
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Current Version</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {activeNote.updatedAt.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">
                      Current
                    </span>
                  </div>
                </div>

                {/* Previous Versions */}
                {(activeNote.versions || []).slice().reverse().map((version, index) => (
                  <div key={version.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Version {activeNote.versions!.length - index}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {version.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => restoreVersion(activeNote.id, version)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Restore
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p><strong>Title:</strong> {version.title}</p>
                      <p><strong>Notebook:</strong> {notebooks.find(nb => nb.id === version.notebookId)?.name || 'Unknown'}</p>
                      <p><strong>Tags:</strong> {version.tags.join(', ') || 'None'}</p>
                      <div className="mt-2">
                        <strong>Content Preview:</strong>
                        <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs max-h-20 overflow-hidden">
                          {version.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(!activeNote.versions || activeNote.versions.length === 0) && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No previous versions available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <WebClipper
        isOpen={showWebClipper}
        onClose={() => setShowWebClipper(false)}
        onClipContent={handleWebClip}
      />

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        note={activeNote}
      />

      <UpNoteImporter
        isOpen={showUpNoteImporter}
        onClose={() => setShowUpNoteImporter(false)}
        onImport={handleUpNoteImport}
      />

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={(content) => createNewNote(content)}
      />

      {/* New Notebook Dialog */}
      {showNewNotebookDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Notebook</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Notebook name..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newNotebookDescription}
                  onChange={(e) => setNewNotebookDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                  <select
                    value={newNotebookIcon}
                    onChange={(e) => setNewNotebookIcon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="📓">📓 Notebook</option>
                    <option value="📘">📘 Blue Book</option>
                    <option value="📗">📗 Green Book</option>
                    <option value="📕">📕 Red Book</option>
                    <option value="📔">📔 Orange Book</option>
                    <option value="📒">📒 Ledger</option>
                    <option value="💼">💼 Briefcase</option>
                    <option value="🏠">🏠 Home</option>
                    <option value="💡">💡 Ideas</option>
                    <option value="🔬">🔬 Research</option>
                    <option value="📚">📚 Library</option>
                    <option value="🎯">🎯 Goals</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                  <input
                    type="color"
                    value={newNotebookColor}
                    onChange={(e) => setNewNotebookColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (newNotebookName.trim()) {
                    createNotebook(newNotebookName.trim(), newNotebookDescription.trim(), newNotebookColor, newNotebookIcon);
                    setNewNotebookName('');
                    setNewNotebookDescription('');
                    setNewNotebookColor('#3b82f6');
                    setNewNotebookIcon('📓');
                    setShowNewNotebookDialog(false);
                  }
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!newNotebookName.trim()}
              >
                Create Notebook
              </button>
              <button
                onClick={() => {
                  setNewNotebookName('');
                  setNewNotebookDescription('');
                  setNewNotebookColor('#3b82f6');
                  setNewNotebookIcon('📓');
                  setShowNewNotebookDialog(false);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BackupDialog
        isOpen={showBackupDialog}
        onClose={() => setShowBackupDialog(false)}
        onBackup={handleBackup}
        onRestore={handleRestore}
      />
    </div>
  );
}
