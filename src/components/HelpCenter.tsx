'use client';

import { useState } from 'react';
import { helpArticles, HelpArticle } from '@/lib/helpContent';

interface HelpCenterProps {
  onClose: () => void;
}

export default function HelpCenter({ onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const uniqueCategories = Array.from(new Set(helpArticles.map((a: HelpArticle) => a.category))) as string[];
  const categories: string[] = ['all', ...uniqueCategories];

  // Filter articles based on search and category
  const filteredArticles = helpArticles.filter((article: HelpArticle) => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Learn how to use NoteMaster features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Articles ({filteredArticles.length})
              </h3>
              <div className="space-y-2">
                {filteredArticles.map((article: HelpArticle) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-3 rounded-lg transition-colors group ${
                      selectedArticle?.id === article.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl flex-shrink-0">{article.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                          {article.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {selectedArticle ? (
              <div className="max-w-3xl">
                {/* Article Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-5xl">{selectedArticle.icon}</span>
                    <div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {selectedArticle.category}
                      </span>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {selectedArticle.title}
                      </h1>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {selectedArticle.description}
                  </p>
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-blue dark:prose-invert max-w-none [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h3]:text-gray-800 dark:[&_h3]:text-gray-100 [&_p]:text-gray-700 dark:[&_p]:text-gray-200 [&_li]:text-gray-700 dark:[&_li]:text-gray-200 [&_strong]:text-gray-900 dark:[&_strong]:text-white [&_code]:text-gray-900 dark:[&_code]:text-gray-100 [&_kbd]:text-gray-900 dark:[&_kbd]:text-gray-100"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />

                {/* Keywords */}
                {selectedArticle.keywords.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Related Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.keywords.map((keyword: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Articles */}
                {selectedArticle.relatedArticles.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      See Also
                    </h3>
                    <div className="space-y-2">
                      {selectedArticle.relatedArticles.map((relatedId: string) => {
                        const related = helpArticles.find((a: HelpArticle) => a.id === relatedId);
                        if (!related) return null;
                        return (
                          <button
                            key={relatedId}
                            onClick={() => setSelectedArticle(related)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
                          >
                            <span className="text-2xl">{related.icon}</span>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {related.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {related.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select an article to get started
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse the categories or search for specific features
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>💡 Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">?</kbd> anytime to open help</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{filteredArticles.length} articles available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
