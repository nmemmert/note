'use client';

import { useState, useEffect } from 'react';
import { getWritingSuggestions, analyzeWriting, WritingSuggestion } from '@/lib/textAnalysis';

interface WritingSuggestionsProps {
  content: string;
}

export default function WritingSuggestions({ content }: WritingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof analyzeWriting> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!content || content.trim().length === 0) {
      setSuggestions([]);
      setStats(null);
      return;
    }

    const newStats = analyzeWriting(content);
    const newSuggestions = getWritingSuggestions(content);
    
    setStats(newStats);
    setSuggestions(newSuggestions);
  }, [content]);

  if (!stats) {
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
            Writing Insights
          </h3>
          {suggestions.length > 0 && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {suggestions.length}
            </span>
          )}
        </div>
        <svg
          className="w-4 h-4 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4">
          {/* Writing Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.wordCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">words</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.readingTime}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">min read</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.sentenceCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">sentences</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.paragraphCount}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">paragraphs</div>
            </div>
          </div>

          {/* Advanced Stats */}
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Average word length:</span>
              <span className="font-medium">{stats.averageWordLength.toFixed(1)} characters</span>
            </div>
            <div className="flex justify-between">
              <span>Average sentence length:</span>
              <span className="font-medium">{stats.averageSentenceLength.toFixed(1)} words</span>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Suggestions
              </h4>
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    suggestion.type === 'tip'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : suggestion.severity === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {suggestion.type === 'tip' ? (
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : suggestion.severity === 'warning' ? (
                        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {suggestion.type}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {suggestion.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
