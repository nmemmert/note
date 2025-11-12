'use client';

import { useEffect } from 'react';

interface ReadingModeProps {
  content: string;
  title: string;
  onClose: () => void;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
}

export default function ReadingMode({ 
  content, 
  title, 
  onClose,
  fontSize = 18,
  onFontSizeChange 
}: ReadingModeProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        onFontSizeChange?.(fontSize + 2);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        onFontSizeChange?.(Math.max(12, fontSize - 2));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, fontSize, onFontSizeChange]);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <button
              onClick={() => onFontSizeChange?.(Math.max(12, fontSize - 2))}
              className="text-gray-600 hover:text-gray-900 font-bold"
              title="Decrease font size (Ctrl+-)"
            >
              A-
            </button>
            <span className="text-sm text-gray-600">{fontSize}px</span>
            <button
              onClick={() => onFontSizeChange?.(fontSize + 2)}
              className="text-gray-600 hover:text-gray-900 font-bold"
              title="Increase font size (Ctrl+=)"
            >
              A+
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
          >
            Exit Reading Mode
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div 
          className="prose prose-lg max-w-none"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
