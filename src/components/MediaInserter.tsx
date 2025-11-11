'use client';

import { useState, useRef } from 'react';

interface MediaInserterProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (src: string, alt?: string) => void;
  onInsertLink: (url: string, text?: string) => void;
  onInsertFile: (file: File) => void;
}

const MediaInserter = ({ isOpen, onClose, onInsertImage, onInsertLink, onInsertFile }: MediaInserterProps) => {
  const [activeTab, setActiveTab] = useState<'image' | 'link' | 'file'>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      onInsertImage(imageUrl, imageAlt || undefined);
      setImageUrl('');
      setImageAlt('');
      onClose();
    }
  };

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      onInsertLink(linkUrl, linkText || undefined);
      setLinkUrl('');
      setLinkText('');
      onClose();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onInsertFile(file);
      onClose();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[300px]">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'image'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Image
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'link'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Link
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'file'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          File
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt Text (optional)
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={handleInsertImage}
              disabled={!imageUrl.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        )}

        {activeTab === 'link' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link Text (optional)
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={handleInsertLink}
              disabled={!linkUrl.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Link
            </button>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select a file to attach to your note
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,audio/*,video/*,application/*,text/*"
              />
              <button
                onClick={openFileDialog}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Choose File
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Supported: Images, Audio, Video, Documents, Text files
            </p>
          </div>
        )}
      </div>

      {/* Close button */}
      <div className="border-t border-gray-200 dark:border-gray-600 p-2 flex justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MediaInserter;