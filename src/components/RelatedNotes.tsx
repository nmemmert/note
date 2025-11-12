'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { TFIDFAnalyzer } from '@/lib/textAnalysis';

interface RelatedNotesProps {
  currentNote: Note;
  allNotes: Note[];
  onNoteSelect: (note: Note) => void;
}

export default function RelatedNotes({ currentNote, allNotes, onNoteSelect }: RelatedNotesProps) {
  const [relatedNotes, setRelatedNotes] = useState<Array<{
    note: Note;
    similarity: number;
    commonTerms: string[];
  }>>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!currentNote || allNotes.length < 2) {
      setRelatedNotes([]);
      return;
    }

    // Prepare documents for analysis
    const analyzer = new TFIDFAnalyzer();
    const docs = allNotes.map(note => ({
      id: note.id,
      text: `${note.title} ${note.content}`
    }));

    analyzer.addDocuments(docs);

    // Find similar notes
    const similar = analyzer.findSimilar(currentNote.id, 5);
    
    // Map back to full note objects
    const relatedWithNotes = similar
      .map(s => ({
        note: allNotes.find(n => n.id === s.id)!,
        similarity: s.similarity,
        commonTerms: s.commonTerms
      }))
      .filter(r => r.note); // Filter out any undefined notes

    setRelatedNotes(relatedWithNotes);
  }, [currentNote, allNotes]);

  if (relatedNotes.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Related Notes
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({relatedNotes.length})
          </span>
        </div>
        <svg
          className="w-4 h-4 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {relatedNotes.map(({ note, similarity, commonTerms }) => (
            <button
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {note.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                  {commonTerms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {commonTerms.slice(0, 3).map((term, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    {Math.round(similarity * 100)}%
                  </div>
                  <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${similarity * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
