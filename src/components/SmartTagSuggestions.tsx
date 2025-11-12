'use client';

import { useState, useEffect } from 'react';

interface SmartTagSuggestionsProps {
  content: string;
  existingTags: string[];
  allTags: string[];
  onAddTag: (tag: string) => void;
}

export default function SmartTagSuggestions({ 
  content, 
  existingTags, 
  allTags,
  onAddTag 
}: SmartTagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Generate smart tag suggestions based on content
    const generateSuggestions = () => {
      const text = content.toLowerCase().replace(/<[^>]*>/g, '');
      const words = text.split(/\s+/).filter(w => w.length > 3);
      
      // Common keywords for auto-tagging
      const keywordMap: Record<string, string[]> = {
        'work': ['project', 'meeting', 'deadline', 'task', 'client'],
        'personal': ['family', 'home', 'friend', 'vacation', 'health'],
        'idea': ['thought', 'concept', 'innovation', 'brainstorm', 'creative'],
        'todo': ['todo', 'task', 'action', 'next', 'complete'],
        'urgent': ['urgent', 'asap', 'important', 'priority', 'critical'],
        'code': ['function', 'class', 'variable', 'algorithm', 'programming'],
        'design': ['ui', 'ux', 'mockup', 'prototype', 'wireframe'],
        'research': ['study', 'analysis', 'data', 'findings', 'investigation'],
      };

      const suggested = new Set<string>();

      // Check for keyword matches
      Object.entries(keywordMap).forEach(([tag, keywords]) => {
        if (keywords.some(kw => text.includes(kw)) && !existingTags.includes(tag)) {
          suggested.add(tag);
        }
      });

      // Suggest frequent tags from history
      const tagFrequency: Record<string, number> = {};
      allTags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });

      const frequentTags = Object.entries(tagFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag)
        .filter(tag => !existingTags.includes(tag) && !suggested.has(tag));

      return [...Array.from(suggested), ...frequentTags].slice(0, 5);
    };

    setSuggestions(generateSuggestions());
  }, [content, existingTags, allTags]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-sm font-medium text-blue-900 mb-2">✨ Suggested Tags:</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(tag => (
          <button
            key={tag}
            onClick={() => onAddTag(tag)}
            className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
