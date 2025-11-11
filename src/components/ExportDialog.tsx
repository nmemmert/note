'use client';

import { useState } from 'react';
import { exportNote, downloadFile, generateShareableLink, ExportFormat } from '../lib/exportUtils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  note: any;
}

const ExportDialog = ({ isOpen, onClose, note }: ExportDialogProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [shareableLink, setShareableLink] = useState('');

  if (!isOpen || !note) return null;

  const handleExport = () => {
    const content = exportNote(note, selectedFormat);
    const extension = selectedFormat === 'json' ? 'json' : selectedFormat;
    const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
    
    let mimeType = 'text/plain';
    switch (selectedFormat) {
      case 'html':
        mimeType = 'text/html';
        break;
      case 'json':
        mimeType = 'application/json';
        break;
      case 'markdown':
        mimeType = 'text/markdown';
        break;
    }

    downloadFile(content, filename, mimeType);
  };

  const handleGenerateShareLink = () => {
    const link = generateShareableLink(note);
    setShareableLink(link);
    navigator.clipboard.writeText(link);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Export & Share</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Export Note</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="markdown">Markdown (.md)</option>
                  <option value="html">HTML (.html)</option>
                  <option value="json">JSON (.json)</option>
                  <option value="txt">Plain Text (.txt)</option>
                </select>
              </div>
              <button
                onClick={handleExport}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download as {selectedFormat.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Share Note</h3>
            <div className="space-y-3">
              {!shareableLink ? (
                <button
                  onClick={handleGenerateShareLink}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Generate Shareable Link
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Shareable link generated and copied to clipboard:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareableLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(shareableLink)}
                      className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;