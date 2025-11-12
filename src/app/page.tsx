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
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import CommandPalette from '../components/CommandPalette';
import ReadingMode from '../components/ReadingMode';
import ThemeSelector, { applyTheme } from '../components/ThemeSelector';
import PomodoroTimer from '../components/PomodoroTimer';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import SmartTagSuggestions from '../components/SmartTagSuggestions';
import TemplateLibrary from '../components/TemplateLibrary';
import FavoritesView from '../components/FavoritesView';
import ArchiveView from '../components/ArchiveView';
import SmartFolders from '../components/SmartFolders';

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
  favorite?: boolean; // For favorites
  archived?: boolean; // For archive
  archivedAt?: Date; // When note was archived
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; noteId?: string } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [distractionFreeMode, setDistractionFreeMode] = useState(false);
  const [collapsedNotebooks, setCollapsedNotebooks] = useState<Set<string>>(new Set());
  const [wordCount, setWordCount] = useState(0);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showReadingMode, setShowReadingMode] = useState(false);
  const [readingFontSize, setReadingFontSize] = useState(18);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [showPomodoroTimer, setShowPomodoroTimer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showSmartFolders, setShowSmartFolders] = useState(false);

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('theme', themeId);
    showToast(`Theme changed to ${themeId}`, 'success');
  };

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

  const createNewNote = (templateContent = '') => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: templateContent,
      tags: [],
      notebookId: selectedNotebook === 'All' ? 'general' : selectedNotebook,
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [],
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    setShowTemplateSelector(false);
    showToast('Note created successfully', 'success');
  };  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
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
    setConfirmDialog({ isOpen: true, noteId: id });
  };

  const confirmDeleteNote = () => {
    if (confirmDialog?.noteId) {
      setNotes(prev => prev.filter(note => note.id !== confirmDialog.noteId));
      
      // If we're deleting the active note, select the first remaining note
      if (activeNote?.id === confirmDialog.noteId) {
        const remainingNotes = notes.filter(note => note.id !== confirmDialog.noteId);
        setActiveNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
      }
      showToast('Note deleted successfully', 'success');
    }
    setConfirmDialog(null);
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
      // Filter out archived notes
      if (note.archived) return false;
      
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
      }
      // Ctrl/Cmd + P: Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Ctrl/Cmd + S: Auto-save (already happening)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showToast('Note saved', 'success');
      }
      // Ctrl/Cmd + K: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
      // Ctrl/Cmd + D: Distraction-free mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDistractionFreeMode(prev => !prev);
      }
      // Ctrl/Cmd + R: Reading mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && activeNote) {
        e.preventDefault();
        setShowReadingMode(true);
      }
      // Escape: Exit distraction-free mode
      if (e.key === 'Escape' && distractionFreeMode) {
        setDistractionFreeMode(false);
      }
      // Escape: Close command palette
      if (e.key === 'Escape' && showCommandPalette) {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [distractionFreeMode, showCommandPalette, activeNote]);

  // Calculate word count
  useEffect(() => {
    if (activeNote) {
      const text = activeNote.content.replace(/<[^>]*>/g, '').trim();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [activeNote?.content]);

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
    showToast(`Notebook "${name}" created`, 'success');
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
          
          showToast('Backup restored successfully!', 'success');
        } else {
          showToast('Invalid backup file format', 'error');
        }
      } catch (error) {
        showToast('Failed to restore backup', 'error');
        console.error('Restore error:', error);
      }
    };
    reader.readAsText(file);
  };

  // Command palette commands
  const commands = [
    // Note actions
    { id: 'new-note', label: 'New Note', icon: '📝', action: () => createNewNote(), category: 'Notes', keywords: ['create', 'add'] },
    { id: 'delete-note', label: 'Delete Note', icon: '🗑️', action: () => activeNote && deleteNote(activeNote.id), category: 'Notes', keywords: ['remove', 'trash'] },
    { id: 'pin-note', label: 'Pin/Unpin Note', icon: '📌', action: () => activeNote && updateNote(activeNote.id, { pinned: !activeNote.pinned }), category: 'Notes' },
    
    // Views
    { id: 'reading-mode', label: 'Reading Mode', icon: '📖', action: () => setShowReadingMode(true), category: 'Views', keywords: ['read', 'view'] },
    { id: 'distraction-free', label: 'Distraction Free Mode', icon: '🎯', action: () => setDistractionFreeMode(!distractionFreeMode), category: 'Views', keywords: ['focus', 'zen'] },
    { id: 'calendar', label: 'Toggle Calendar', icon: '📅', action: () => setShowCalendar(!showCalendar), category: 'Views' },
    { id: 'toc', label: 'Toggle Table of Contents', icon: '📋', action: () => setShowTableOfContents(!showTableOfContents), category: 'Views' },
    { id: 'sidebar', label: 'Toggle Sidebar', icon: '↔️', action: () => setIsSidebarCollapsed(!isSidebarCollapsed), category: 'Views' },
    
    // Tools
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: '⏲️', action: () => setShowPomodoroTimer(!showPomodoroTimer), category: 'Tools', keywords: ['timer', 'focus'] },
    { id: 'analytics', label: 'Analytics Dashboard', icon: '📊', action: () => setShowAnalytics(true), category: 'Tools', keywords: ['stats', 'statistics'] },
    { id: 'themes', label: 'Change Theme', icon: '🎨', action: () => setShowThemeSelector(true), category: 'Tools', keywords: ['appearance', 'colors'] },
    { id: 'web-clipper', label: 'Web Clipper', icon: '📎', action: () => setShowWebClipper(true), category: 'Tools', keywords: ['clip', 'save'] },
    
    // Organization
    { id: 'templates', label: 'Template Library', icon: '📚', action: () => setShowTemplateLibrary(true), category: 'Organization', keywords: ['template', 'preset'] },
    { id: 'favorites', label: 'Favorites', icon: '⭐', action: () => setShowFavorites(true), category: 'Organization', keywords: ['starred', 'important'] },
    { id: 'archive', label: 'Archive', icon: '📦', action: () => setShowArchive(true), category: 'Organization', keywords: ['archived', 'hidden'] },
    { id: 'smart-folders', label: 'Smart Folders', icon: '🗂️', action: () => setShowSmartFolders(true), category: 'Organization', keywords: ['automatic', 'filter'] },
    { id: 'toggle-favorite', label: 'Toggle Favorite', icon: '⭐', action: () => activeNote && updateNote(activeNote.id, { favorite: !activeNote.favorite }), category: 'Organization' },
    { id: 'archive-note', label: 'Archive Note', icon: '📦', action: () => activeNote && updateNote(activeNote.id, { archived: true, archivedAt: new Date() }), category: 'Organization' },
    
    // Data
    { id: 'backup', label: 'Backup & Restore', icon: '💾', action: () => setShowBackupDialog(true), category: 'Data', keywords: ['export', 'save'] },
    { id: 'import', label: 'Import from UpNote', icon: '📥', action: () => setShowUpNoteImporter(true), category: 'Data', keywords: ['import', 'migrate'] },
    { id: 'export', label: 'Export Note', icon: '📤', action: () => setShowExportDialog(true), category: 'Data', keywords: ['download', 'save'] },
    
    // Notebooks
    { id: 'new-notebook', label: 'New Notebook', icon: '📚', action: () => setShowNewNotebookDialog(true), category: 'Notebooks', keywords: ['create', 'folder'] },
    
    // Search
    { id: 'advanced-search', label: 'Advanced Search', icon: '🔍', action: () => setShowAdvancedSearch(!showAdvancedSearch), category: 'Search', keywords: ['find', 'filter'] },
  ];

  return (
    <>
      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          commands={commands}
        />
      )}

      {/* Reading Mode */}
      {showReadingMode && activeNote && (
        <ReadingMode
          content={activeNote.content}
          title={activeNote.title}
          fontSize={readingFontSize}
          onFontSizeChange={setReadingFontSize}
          onClose={() => setShowReadingMode(false)}
        />
      )}

      {/* Theme Selector */}
      {showThemeSelector && (
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={(theme) => {
            setCurrentTheme(theme);
            setShowThemeSelector(false);
          }}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {/* Pomodoro Timer */}
      {showPomodoroTimer && (
        <div className="fixed bottom-4 right-4 z-40 animate-slideIn">
          <PomodoroTimer 
            isOpen={showPomodoroTimer}
            onClose={() => setShowPomodoroTimer(false)} 
          />
        </div>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <AnalyticsDashboard 
          notes={notes} 
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* Template Library */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelectTemplate={(template) => {
            const newNote: Note = {
              id: Date.now().toString(),
              title: template.name,
              content: template.content,
              tags: template.tags,
              notebookId: selectedNotebook === 'all' ? 'general' : selectedNotebook,
              createdAt: new Date(),
              updatedAt: new Date(),
              pinned: false,
              versions: []
            };
            setNotes([newNote, ...notes]);
            setActiveNote(newNote);
            setShowTemplateLibrary(false);
            showToast(`Created note from "${template.name}" template`, 'success');
          }}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}

      {/* Favorites View */}
      {showFavorites && (
        <FavoritesView
          notes={notes.filter(n => !n.archived)}
          onSelectNote={(note) => setActiveNote(note)}
          onToggleFavorite={(noteId) => {
            const note = notes.find(n => n.id === noteId);
            updateNote(noteId, { favorite: !note?.favorite });
            showToast(note?.favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
          }}
          onClose={() => setShowFavorites(false)}
        />
      )}

      {/* Archive View */}
      {showArchive && (
        <ArchiveView
          notes={notes}
          onSelectNote={(note) => setActiveNote(note)}
          onUnarchive={(noteId) => {
            updateNote(noteId, { archived: false, archivedAt: undefined });
            showToast('Note restored from archive', 'success');
          }}
          onPermanentDelete={(noteId) => {
            deleteNote(noteId);
            showToast('Note permanently deleted', 'success');
          }}
          onClose={() => setShowArchive(false)}
        />
      )}

      {/* Smart Folders */}
      {showSmartFolders && (
        <SmartFolders
          notes={notes.filter(n => !n.archived)}
          onSelectNote={(note) => {
            setActiveNote(note);
            setShowSmartFolders(false);
          }}
          onClose={() => setShowSmartFolders(false)}
        />
      )}

    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Command Bar */}
      {!distractionFreeMode && (
        <div className="bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="px-6 py-3 flex items-center gap-4">
            {/* App Title */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NoteMaster
              </h1>
            </div>

            {/* Command Bar Search */}
            <div className="flex-1 max-w-2xl">
              <button
                onClick={() => setShowCommandPalette(true)}
                className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm text-gray-500 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span>🔍</span>
                  <span>Search or type a command...</span>
                </div>
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600 group-hover:border-gray-300">
                  Ctrl+P
                </kbd>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => createNewNote()}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow"
                title="New Note (Ctrl+N)"
              >
                <span>➕</span>
                <span className="hidden md:inline">New Note</span>
              </button>
              <button
                onClick={() => setShowTemplateLibrary(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                title="Templates"
              >
                📚
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                title="Favorites"
              >
                ⭐
              </button>
              <button
                onClick={() => setShowSmartFolders(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                title="Smart Folders"
              >
                🗂️
              </button>
              <button
                onClick={() => setShowAnalytics(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                title="Analytics"
              >
                📊
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        {/* Sidebar */}
        {!distractionFreeMode && (
        <div className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-all shadow-sm"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
          </div>
          {!isSidebarCollapsed && (
            <>
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
            </>
          )}
        </div>

        {/* Notes List */}
        {!isSidebarCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No notes found"
              description="Create your first note to get started"
              action={{
                label: "Create Note",
                onClick: () => createNewNote()
              }}
            />
          ) : (
            filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={`card-hover p-4 border-b border-gray-100 cursor-pointer transition-all ${
                activeNote?.id === note.id 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-gray-50'
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
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNote(note.id, { favorite: !note.favorite });
                    }}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      note.favorite ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    title={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinNote(note.id);
                    }}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      note.pinned ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    title={note.pinned ? 'Unpin note' : 'Pin note'}
                  >
                    📌
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
        )}
      </div>
      )}

      {/* Quick Access Panel */}
      {showQuickAccess && !distractionFreeMode && (
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
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span className="hover:text-blue-600 cursor-pointer">
                  {notebooks.find(nb => nb.id === activeNote.notebookId)?.icon} {notebooks.find(nb => nb.id === activeNote.notebookId)?.name || 'General'}
                </span>
                <span>›</span>
                <span className="text-gray-900">{activeNote.title || 'Untitled'}</span>
              </div>
              
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-3xl font-bold text-gray-900 bg-transparent border-none outline-none w-full mb-3"
                placeholder="Note title..."
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: {activeNote.updatedAt.toLocaleString()}</span>
                  <span className="text-gray-300">|</span>
                  <span>{wordCount} words</span>
                  <span className="text-gray-300">|</span>
                  <span>{charCount} characters</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDistractionFreeMode(!distractionFreeMode)}
                    className="text-purple-600 hover:text-purple-800 text-sm px-3 py-1 rounded-lg hover:bg-purple-50 transition-all"
                    title="Distraction Free Mode (Ctrl+D)"
                  >
                    👁️ Focus
                  </button>
                  <button
                    onClick={() => setShowVersionHistory(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-all"
                    title="Version History"
                  >
                    📚 History
                  </button>
                  <button
                    onClick={() => setShowExportDialog(true)}
                    className="text-green-600 hover:text-green-800 text-sm px-3 py-1 rounded-lg hover:bg-green-50 transition-all"
                    title="Export & Share"
                  >
                    📤 Export
                  </button>
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1 flex">
              <div className={`p-6 bg-white ${showCalendar || showTableOfContents ? 'flex-1' : 'w-full'} ${distractionFreeMode ? 'max-w-4xl mx-auto' : ''}`}>
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
                
                {/* Smart Tag Suggestions */}
                {activeNote.content.length > 50 && (
                  <div className="mt-4">
                    <SmartTagSuggestions
                      content={activeNote.content}
                      existingTags={activeNote.tags}
                      allTags={Array.from(new Set(notes.flatMap(n => n.tags)))}
                      onAddTag={(tag: string) => {
                        if (!activeNote.tags.includes(tag)) {
                          updateNote(activeNote.id, { tags: [...activeNote.tags, tag] });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Calendar View */}
              {showCalendar && !distractionFreeMode && (
                <div className="w-80 border-l border-gray-200 p-4 bg-white shadow-sm">
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
              {showTableOfContents && !distractionFreeMode && (
                <div className="w-64 border-l border-gray-200 p-4 bg-white shadow-sm">
                  <div>Table of Contents will be implemented with editor integration</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            icon="📝"
            title="Select a note to start"
            description="Choose a note from the sidebar or create a new one to begin writing."
            action={{
              label: "Create Your First Note",
              onClick: () => createNewNote()
            }}
          />
        )}
      </div>

      {/* Toasts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDeleteNote}
          onCancel={() => setConfirmDialog(null)}
          type="danger"
        />
      )}

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
    </div>
    </>
  );
}
