'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  content: string;
  tags: string[];
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const templates: Template[] = [
  // Meeting Templates
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Structured template for meeting minutes',
    icon: '👥',
    category: 'Meetings',
    content: `<h2>Meeting Notes</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Attendees:</strong> </p>
<p><strong>Agenda:</strong></p>
<ul>
  <li></li>
</ul>
<h3>Discussion Points</h3>
<p></p>
<h3>Action Items</h3>
<ul>
  <li>[ ] </li>
</ul>
<h3>Next Steps</h3>
<p></p>`,
    tags: ['meeting', 'work']
  },
  {
    id: 'one-on-one',
    name: '1:1 Meeting',
    description: 'Template for one-on-one meetings',
    icon: '🤝',
    category: 'Meetings',
    content: `<h2>1:1 Meeting</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>With:</strong> </p>
<h3>Topics to Discuss</h3>
<ul>
  <li></li>
</ul>
<h3>Wins & Accomplishments</h3>
<p></p>
<h3>Challenges & Concerns</h3>
<p></p>
<h3>Goals & Development</h3>
<p></p>
<h3>Action Items</h3>
<ul>
  <li>[ ] </li>
</ul>`,
    tags: ['meeting', '1-on-1', 'work']
  },

  // Project Templates
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Comprehensive project planning template',
    icon: '📋',
    category: 'Projects',
    content: `<h2>Project Plan</h2>
<p><strong>Project Name:</strong> </p>
<p><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Owner:</strong> </p>
<h3>Project Overview</h3>
<p></p>
<h3>Goals & Objectives</h3>
<ul>
  <li></li>
</ul>
<h3>Timeline & Milestones</h3>
<ul>
  <li></li>
</ul>
<h3>Resources Needed</h3>
<ul>
  <li></li>
</ul>
<h3>Risks & Mitigation</h3>
<p></p>
<h3>Success Metrics</h3>
<ul>
  <li></li>
</ul>`,
    tags: ['project', 'planning', 'work']
  },
  {
    id: 'sprint-planning',
    name: 'Sprint Planning',
    description: 'Agile sprint planning template',
    icon: '⚡',
    category: 'Projects',
    content: `<h2>Sprint Planning</h2>
<p><strong>Sprint Number:</strong> </p>
<p><strong>Duration:</strong> 2 weeks</p>
<p><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
<h3>Sprint Goal</h3>
<p></p>
<h3>User Stories</h3>
<ul>
  <li>[ ] Story 1 - Points: </li>
</ul>
<h3>Team Capacity</h3>
<p></p>
<h3>Definition of Done</h3>
<ul>
  <li></li>
</ul>`,
    tags: ['sprint', 'agile', 'work']
  },

  // Personal Templates
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    description: 'Reflect on your day',
    icon: '📔',
    category: 'Personal',
    content: `<h2>Daily Journal - ${new Date().toLocaleDateString()}</h2>
<h3>Today's Highlights</h3>
<p></p>
<h3>Grateful For</h3>
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
<h3>Lessons Learned</h3>
<p></p>
<h3>Tomorrow's Focus</h3>
<ul>
  <li></li>
</ul>
<h3>Mood & Energy</h3>
<p>😊 Mood: </p>
<p>⚡ Energy: </p>`,
    tags: ['journal', 'personal', 'reflection']
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    description: 'SMART goals template',
    icon: '🎯',
    category: 'Personal',
    content: `<h2>Goal Setting</h2>
<p><strong>Created:</strong> ${new Date().toLocaleDateString()}</p>
<h3>Goal Statement</h3>
<p></p>
<h3>SMART Criteria</h3>
<ul>
  <li><strong>Specific:</strong> </li>
  <li><strong>Measurable:</strong> </li>
  <li><strong>Achievable:</strong> </li>
  <li><strong>Relevant:</strong> </li>
  <li><strong>Time-bound:</strong> </li>
</ul>
<h3>Action Steps</h3>
<ul>
  <li>[ ] Step 1</li>
</ul>
<h3>Progress Tracking</h3>
<p></p>
<h3>Obstacles & Solutions</h3>
<p></p>`,
    tags: ['goals', 'personal', 'planning']
  },
  {
    id: 'weekly-review',
    name: 'Weekly Review',
    description: 'Review your week and plan ahead',
    icon: '📅',
    category: 'Personal',
    content: `<h2>Weekly Review</h2>
<p><strong>Week of:</strong> ${new Date().toLocaleDateString()}</p>
<h3>This Week's Wins</h3>
<ul>
  <li></li>
</ul>
<h3>Challenges Faced</h3>
<p></p>
<h3>What I Learned</h3>
<p></p>
<h3>Next Week's Priorities</h3>
<ul>
  <li></li>
</ul>
<h3>Personal Development</h3>
<p></p>`,
    tags: ['review', 'weekly', 'personal']
  },

  // Learning Templates
  {
    id: 'book-notes',
    name: 'Book Notes',
    description: 'Capture insights from books',
    icon: '📚',
    category: 'Learning',
    content: `<h2>Book Notes</h2>
<p><strong>Title:</strong> </p>
<p><strong>Author:</strong> </p>
<p><strong>Started:</strong> ${new Date().toLocaleDateString()}</p>
<h3>Key Themes</h3>
<ul>
  <li></li>
</ul>
<h3>Important Quotes</h3>
<blockquote>
  <p></p>
</blockquote>
<h3>Main Takeaways</h3>
<ul>
  <li></li>
</ul>
<h3>Action Items</h3>
<ul>
  <li>[ ] </li>
</ul>
<h3>Rating</h3>
<p>⭐⭐⭐⭐⭐</p>`,
    tags: ['book', 'learning', 'notes']
  },
  {
    id: 'course-notes',
    name: 'Course Notes',
    description: 'Notes for online courses',
    icon: '🎓',
    category: 'Learning',
    content: `<h2>Course Notes</h2>
<p><strong>Course:</strong> </p>
<p><strong>Instructor:</strong> </p>
<p><strong>Platform:</strong> </p>
<h3>Module/Lesson</h3>
<p></p>
<h3>Key Concepts</h3>
<ul>
  <li></li>
</ul>
<h3>Code Examples</h3>
<pre><code></code></pre>
<h3>Resources</h3>
<ul>
  <li></li>
</ul>
<h3>Practice Ideas</h3>
<ul>
  <li></li>
</ul>`,
    tags: ['course', 'learning', 'education']
  },

  // Work Templates
  {
    id: 'decision-log',
    name: 'Decision Log',
    description: 'Document important decisions',
    icon: '⚖️',
    category: 'Work',
    content: `<h2>Decision Log</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Decision Maker(s):</strong> </p>
<h3>Context & Background</h3>
<p></p>
<h3>Options Considered</h3>
<ul>
  <li><strong>Option A:</strong> Pros: | Cons: </li>
  <li><strong>Option B:</strong> Pros: | Cons: </li>
</ul>
<h3>Final Decision</h3>
<p></p>
<h3>Rationale</h3>
<p></p>
<h3>Impact & Next Steps</h3>
<p></p>`,
    tags: ['decision', 'work', 'documentation']
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    description: 'Detailed bug tracking template',
    icon: '🐛',
    category: 'Work',
    content: `<h2>Bug Report</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Reporter:</strong> </p>
<p><strong>Priority:</strong> 🔴 High / 🟡 Medium / 🟢 Low</p>
<h3>Description</h3>
<p></p>
<h3>Steps to Reproduce</h3>
<ol>
  <li></li>
</ol>
<h3>Expected Behavior</h3>
<p></p>
<h3>Actual Behavior</h3>
<p></p>
<h3>Environment</h3>
<ul>
  <li>Browser: </li>
  <li>OS: </li>
  <li>Version: </li>
</ul>
<h3>Solution/Workaround</h3>
<p></p>`,
    tags: ['bug', 'work', 'technical']
  },

  // Blank Template
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start from scratch',
    icon: '📄',
    category: 'General',
    content: '<p></p>',
    tags: []
  }
];

export default function TemplateLibrary({ onSelectTemplate, onClose }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">📚 Template Library</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="px-6 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No templates found</p>
              <p className="text-gray-400 text-sm mt-2">Try a different search or category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
