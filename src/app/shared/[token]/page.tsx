'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
);

interface SharedNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export default function SharedNotePage() {
  const params = useParams();
  const [note, setNote] = useState<SharedNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const response = await fetch(`/api/shared/${params.token}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load shared note');
        }
        const data = await response.json();
        setNote(data.note);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    if (params.token) {
      fetchSharedNote();
    }
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Note Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'This note does not exist or the share link has expired.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to NoteMaster
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              📝 NoteMaster
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">Shared Note</span>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Try NoteMaster
          </a>
        </div>
      </header>

      {/* Note Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Note Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {note.title}
            </h1>
            
            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Metadata */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                Created: {new Date(note.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {note.updatedAt !== note.createdAt && (
                <span>
                  Updated: {new Date(note.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div className="px-8 py-6">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownPreview source={note.content} />
            </div>
          </div>
        </article>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            This note was shared from{' '}
            <a href="/" className="text-blue-500 hover:underline">
              NoteMaster
            </a>
          </p>
          <p className="mt-2">
            Create your own notes at{' '}
            <a href="/" className="text-blue-500 hover:underline font-semibold">
              NoteMaster
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
