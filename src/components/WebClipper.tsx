'use client';

import { useState } from 'react';

interface WebClipperProps {
  isOpen: boolean;
  onClose: () => void;
  onClipContent: (title: string, content: string, url?: string) => void;
}

const WebClipper = ({ isOpen, onClose, onClipContent }: WebClipperProps) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clipMode, setClipMode] = useState<'url' | 'manual'>('url');

  const handleFetchUrl = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      // Note: In a real implementation, this would require a backend service
      // to fetch web content due to CORS restrictions
      const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || 'Clipped Content');
        setContent(data.content || '');
      } else {
        // Fallback: just create a note with the URL
        setTitle('Clipped from: ' + url);
        setContent(`Source: ${url}\n\n[Paste content here]`);
      }
    } catch (error) {
      // Fallback for demo purposes
      setTitle('Clipped from: ' + url);
      setContent(`Source: ${url}\n\n[Paste content here]`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClip = () => {
    if (title.trim() && content.trim()) {
      onClipContent(title.trim(), content.trim(), url.trim() || undefined);
      // Reset form
      setUrl('');
      setTitle('');
      setContent('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Web Clipper</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Mode Selection */}
          <div className="mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setClipMode('url')}
                className={`px-4 py-2 rounded ${
                  clipMode === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                From URL
              </button>
              <button
                onClick={() => setClipMode('manual')}
                className={`px-4 py-2 rounded ${
                  clipMode === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Manual Entry
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {clipMode === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL to Clip
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={handleFetchUrl}
                    disabled={!url.trim() || isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '...' : 'Fetch'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Note: URL fetching may be limited due to browser security restrictions
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title for the clipped content"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or enter the content to clip..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleClip}
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clip Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebClipper;