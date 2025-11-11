'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start with a clean slate',
    content: '',
    category: 'Basic'
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Structured template for meeting notes',
    content: `<h2>Meeting Title</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Attendees:</strong> </p>
<p><strong>Agenda:</strong></p>
<ul>
<li>Topic 1</li>
<li>Topic 2</li>
<li>Topic 3</li>
</ul>
<p><strong>Discussion Notes:</strong></p>
<p><strong>Action Items:</strong></p>
<ul>
<li><input type="checkbox"> Action item 1</li>
<li><input type="checkbox"> Action item 2</li>
</ul>
<p><strong>Next Steps:</strong></p>`,
    category: 'Work'
  },
  {
    id: 'project',
    name: 'Project Plan',
    description: 'Template for project planning and tracking',
    content: `<h1>Project Title</h1>
<p><strong>Project Overview:</strong></p>
<p>Describe the project goals, scope, and objectives.</p>

<p><strong>Timeline:</strong></p>
<ul>
<li>Start Date: </li>
<li>End Date: </li>
<li>Milestones: </li>
</ul>

<p><strong>Team Members:</strong></p>
<ul>
<li>Role 1: Name</li>
<li>Role 2: Name</li>
</ul>

<p><strong>Resources Needed:</strong></p>
<ul>
<li>Resource 1</li>
<li>Resource 2</li>
</ul>

<p><strong>Risks & Mitigation:</strong></p>
<ul>
<li>Risk 1: Mitigation strategy</li>
<li>Risk 2: Mitigation strategy</li>
</ul>`,
    category: 'Work'
  },
  {
    id: 'research',
    name: 'Research Notes',
    description: 'Template for organizing research and findings',
    content: `<h1>Research Topic</h1>
<p><strong>Research Question:</strong></p>
<p>What is the main question you're trying to answer?</p>

<p><strong>Hypothesis:</strong></p>
<p>Your initial hypothesis or expected outcome.</p>

<p><strong>Sources:</strong></p>
<ol>
<li>Source 1: Key findings</li>
<li>Source 2: Key findings</li>
<li>Source 3: Key findings</li>
</ol>

<p><strong>Key Findings:</strong></p>
<ul>
<li>Finding 1 with supporting evidence</li>
<li>Finding 2 with supporting evidence</li>
</ul>

<p><strong>Conclusions:</strong></p>
<p>Summary of your research and implications.</p>`,
    category: 'Academic'
  },
  {
    id: 'journal',
    name: 'Daily Journal',
    description: 'Template for daily reflection and journaling',
    content: `<h2>Daily Journal - ${new Date().toLocaleDateString()}</h2>
<p><strong>Today's Highlights:</strong></p>
<ul>
<li>What went well today?</li>
<li>Any challenges faced?</li>
</ul>

<p><strong>Gratitude:</strong></p>
<p>Three things I'm grateful for today:</p>
<ol>
<li></li>
<li></li>
<li></li>
</ol>

<p><strong>Tomorrow's Goals:</strong></p>
<ul>
<li>Goal 1</li>
<li>Goal 2</li>
<li>Goal 3</li>
</ul>

<p><strong>Reflections:</strong></p>
<p>Any thoughts, feelings, or insights from today...</p>`,
    category: 'Personal'
  },
  {
    id: 'book',
    name: 'Book Notes',
    description: 'Template for taking notes while reading',
    content: `<h1>Book Title</h1>
<p><strong>Author:</strong> </p>
<p><strong>Genre:</strong> </p>
<p><strong>Started Reading:</strong> ${new Date().toLocaleDateString()}</p>

<p><strong>Why I Chose This Book:</strong></p>
<p></p>

<p><strong>Key Quotes:</strong></p>
<blockquote>
<p>"Quote 1" - Page number</p>
</blockquote>

<p><strong>Main Themes:</strong></p>
<ul>
<li>Theme 1</li>
<li>Theme 2</li>
</ul>

<p><strong>Character Analysis:</strong></p>
<ul>
<li>Character 1: Description and development</li>
<li>Character 2: Description and development</li>
</ul>

<p><strong>My Thoughts:</strong></p>
<p>Overall impressions and rating...</p>`,
    category: 'Personal'
  }
];

const TemplateSelector = ({ onSelectTemplate, isOpen, onClose }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Choose a Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => {
                  onSelectTemplate(template.content);
                  onClose();
                }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {template.description}
                </p>
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {template.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;