'use client';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  archived?: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: string;
}

interface ArchiveViewProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onUnarchive: (noteId: string) => void;
  onPermanentDelete: (noteId: string) => void;
  onClose: () => void;
}

export default function ArchiveView({ 
  notes, 
  onSelectNote, 
  onUnarchive, 
  onPermanentDelete, 
  onClose 
}: ArchiveViewProps) {
  const archivedNotes = notes.filter(note => note.archived);

  const getPreview = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                📦 Archive
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {archivedNotes.length} archived {archivedNotes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Archive List */}
        <div className="flex-1 overflow-y-auto p-6">
          {archivedNotes.length > 0 ? (
            <div className="space-y-3">
              {archivedNotes.map(note => (
                <div
                  key={note.id}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all group bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        onSelectNote(note);
                        onClose();
                      }}
                    >
                      <h3 className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors mb-1 truncate">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {getPreview(note.content)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Archived {note.archivedAt?.toLocaleDateString() || note.updatedAt.toLocaleDateString()}</span>
                        {note.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1 flex-wrap">
                              {note.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-200 text-gray-600 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded">
                                  +{note.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onUnarchive(note.id)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Restore from archive"
                      >
                        <span className="text-lg">📤</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Permanently delete this note? This cannot be undone.')) {
                            onPermanentDelete(note.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete permanently"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-6xl mb-4">📦</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Archive is empty</h3>
              <p className="text-gray-500 max-w-md">
                Archive notes you want to keep but don't need in your main workspace. Archived notes won't appear in searches or the main list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
