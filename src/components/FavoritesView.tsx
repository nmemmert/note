'use client';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  favorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: string;
}

interface FavoritesViewProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onToggleFavorite: (noteId: string) => void;
  onClose: () => void;
}

export default function FavoritesView({ notes, onSelectNote, onToggleFavorite, onClose }: FavoritesViewProps) {
  const favoriteNotes = notes.filter(note => note.favorite);

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
                ⭐ Favorites
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {favoriteNotes.length} {favoriteNotes.length === 1 ? 'note' : 'notes'}
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

        {/* Favorites List */}
        <div className="flex-1 overflow-y-auto p-6">
          {favoriteNotes.length > 0 ? (
            <div className="space-y-3">
              {favoriteNotes.map(note => (
                <div
                  key={note.id}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => {
                    onSelectNote(note);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                        {note.title || 'Untitled'}
                      </h3>
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(note.id);
                      }}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors flex-shrink-0"
                      title="Remove from favorites"
                    >
                      <span className="text-2xl">⭐</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-6xl mb-4">⭐</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500 max-w-md">
                Star your important notes to quickly access them here. Click the star icon on any note to add it to favorites.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
