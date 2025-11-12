'use client';

import { useState, useEffect } from 'react';
import { generateSummary, suggestTags } from '@/lib/textAnalysis';

interface AutoSummaryProps {
  content: string;
  currentTags: string[];
  onAddTag?: (tag: string) => void;
}

export default function AutoSummary({ content, currentTags, onAddTag }: AutoSummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!content || content.trim().length < 100) {
      setSummary('');
      setSuggestedTags([]);
      return;
    }

    // Generate summary and tags
    const newSummary = generateSummary(content, 3);
    const newTags = suggestTags(content, currentTags);
    
    setSummary(newSummary);
    setSuggestedTags(newTags);
  }, [content, currentTags]);

  const handleGenerateClick = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSummary = generateSummary(content, 3);
      setSummary(newSummary);
      setIsGenerating(false);
      setIsExpanded(true);
    }, 500);
  };

  if (!content || content.trim().length < 100) {
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
            AI Insights
          </h3>
          {suggestedTags.length > 0 && (
            <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
              {suggestedTags.length} tags
            </span>
          )}
        </div>
        <svg
          className="w-4 h-4 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4">
          {/* Summary Section */}
          {summary && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Auto Summary
                </h4>
                <button
                  onClick={handleGenerateClick}
                  disabled={isGenerating}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 flex items-center gap-1"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          )}

          {/* Suggested Tags */}
          {suggestedTags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                Suggested Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddTag?.(tag)}
                    className="group px-3 py-1.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-full text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI-powered insights based on your note content
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
