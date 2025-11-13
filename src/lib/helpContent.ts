export interface HelpArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  keywords: string[];
  relatedArticles: string[];
}

export const helpArticles: HelpArticle[] = [
  // Getting Started
  {
    id: 'getting-started',
    category: 'basics',
    title: 'Getting Started with NoteMaster',
    description: 'Learn the basics of creating and managing your notes',
    icon: '🚀',
    keywords: ['introduction', 'start', 'basics', 'tutorial', 'guide'],
    relatedArticles: ['creating-notes', 'organizing-notebooks', 'keyboard-shortcuts'],
    content: `
      <h2>Welcome to NoteMaster!</h2>
      <p>NoteMaster is a powerful, feature-rich note-taking application designed to help you capture, organize, and connect your ideas.</p>
      
      <h3>Quick Start Guide</h3>
      <ol>
        <li><strong>Create your first note:</strong> Click the "+" button in the sidebar or press <kbd>Ctrl+N</kbd></li>
        <li><strong>Start writing:</strong> Use the rich text editor to format your content</li>
        <li><strong>Organize:</strong> Add tags, assign to notebooks, and pin important notes</li>
        <li><strong>Discover:</strong> Use the command palette (<kbd>Ctrl+P</kbd>) to access features quickly</li>
      </ol>

      <h3>Key Features</h3>
      <ul>
        <li>📝 Rich text editor with formatting options</li>
        <li>📁 Organize notes in notebooks</li>
        <li>🏷️ Tag system for easy categorization</li>
        <li>🔍 Powerful search across all notes</li>
        <li>🤖 AI-powered insights and suggestions</li>
        <li>� Share notes with public links</li>
        <li>📚 Automatic version control and history</li>
        <li>🎨 Rich media support (videos, LaTeX, diagrams)</li>
        <li>📧 Email invitations for note sharing</li>
        <li>�🔐 Secure authentication and data encryption</li>
      </ul>

      <h3>Interface Overview</h3>
      <p><strong>Sidebar:</strong> Navigate between notebooks, tags, and special folders (Favorites, Archive)</p>
      <p><strong>Note List:</strong> View all notes with preview, tags, and date information</p>
      <p><strong>Editor:</strong> Write and format your notes with a full-featured editor</p>
      <p><strong>Command Palette:</strong> Quick access to all features (<kbd>Ctrl+P</kbd>)</p>
    `
  },

  // Creating and Editing
  {
    id: 'creating-notes',
    category: 'basics',
    title: 'Creating and Editing Notes',
    description: 'How to create, edit, and format your notes',
    icon: '📝',
    keywords: ['create', 'new', 'edit', 'write', 'format', 'text'],
    relatedArticles: ['rich-text-editor', 'templates', 'markdown'],
    content: `
      <h2>Creating Notes</h2>
      <p>There are multiple ways to create a new note:</p>
      <ul>
        <li>Click the <strong>"+ New Note"</strong> button in the sidebar</li>
        <li>Press <kbd>Ctrl+N</kbd> (Windows/Linux) or <kbd>Cmd+N</kbd> (Mac)</li>
        <li>Use the Command Palette (<kbd>Ctrl+P</kbd>) and type "new note"</li>
        <li>Click "New Note" in any notebook view</li>
      </ul>

      <h2>Editing Notes</h2>
      <h3>Title</h3>
      <p>Click the title field at the top of the note to edit it. The title is automatically saved as you type.</p>

      <h3>Content</h3>
      <p>The rich text editor supports:</p>
      <ul>
        <li><strong>Bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s></li>
        <li>Headings (H1, H2, H3)</li>
        <li>Bullet and numbered lists</li>
        <li>Code blocks and inline code</li>
        <li>Links and images</li>
        <li>Text colors and highlights</li>
        <li>Undo/Redo</li>
      </ul>

      <h3>Auto-Save</h3>
      <p>All changes are automatically saved to the database as you type. Look for the save indicator in the toolbar.</p>

      <h3>Quick Formatting</h3>
      <p>Use these keyboard shortcuts for fast formatting:</p>
      <ul>
        <li><kbd>Ctrl+B</kbd> - Bold</li>
        <li><kbd>Ctrl+I</kbd> - Italic</li>
        <li><kbd>Ctrl+U</kbd> - Underline</li>
        <li><kbd>Ctrl+Z</kbd> - Undo</li>
        <li><kbd>Ctrl+Y</kbd> - Redo</li>
      </ul>
    `
  },

  {
    id: 'rich-text-editor',
    category: 'editing',
    title: 'Rich Text Editor',
    description: 'Master the powerful formatting tools',
    icon: '✏️',
    keywords: ['editor', 'formatting', 'toolbar', 'style', 'format'],
    relatedArticles: ['creating-notes', 'markdown'],
    content: `
      <h2>Rich Text Editor Toolbar</h2>
      <p>The editor toolbar provides comprehensive formatting options:</p>

      <h3>Text Formatting</h3>
      <ul>
        <li><strong>Bold (B):</strong> Make text stand out with bold formatting</li>
        <li><strong>Italic (I):</strong> Emphasize text with italics</li>
        <li><strong>Underline (U):</strong> Underline important text</li>
        <li><strong>Strikethrough (S):</strong> Cross out completed items or outdated info</li>
      </ul>

      <h3>Headings</h3>
      <p>Use headings to structure your content:</p>
      <ul>
        <li><strong>H1:</strong> Main title (largest)</li>
        <li><strong>H2:</strong> Section headers</li>
        <li><strong>H3:</strong> Subsection headers</li>
      </ul>

      <h3>Lists</h3>
      <ul>
        <li><strong>Bullet List:</strong> Unordered list of items</li>
        <li><strong>Numbered List:</strong> Ordered list with numbers</li>
        <li><strong>Checklist:</strong> Todo items with checkboxes</li>
      </ul>

      <h3>Colors & Highlights</h3>
      <p>Make important information stand out:</p>
      <ul>
        <li><strong>Text Color:</strong> Change the color of selected text</li>
        <li><strong>Background Color:</strong> Highlight text with background colors</li>
        <li>Available colors: Red, Blue, Green, Yellow, Purple, Orange</li>
      </ul>

      <h3>Advanced Features</h3>
      <ul>
        <li><strong>Code Block:</strong> Insert code with syntax highlighting</li>
        <li><strong>Quote:</strong> Block quotes for citations</li>
        <li><strong>Link:</strong> Add hyperlinks to external resources</li>
        <li><strong>Image:</strong> Embed images in your notes</li>
      </ul>

      <h3>Undo/Redo</h3>
      <p>Made a mistake? Use the undo button or press <kbd>Ctrl+Z</kbd>. Redo with <kbd>Ctrl+Y</kbd>.</p>
    `
  },

  // Organization
  {
    id: 'organizing-notebooks',
    category: 'organization',
    title: 'Organizing with Notebooks',
    description: 'Use notebooks to group related notes',
    icon: '📁',
    keywords: ['notebook', 'organize', 'folder', 'category', 'group'],
    relatedArticles: ['tags-system', 'smart-folders', 'favorites'],
    content: `
      <h2>What are Notebooks?</h2>
      <p>Notebooks are collections of related notes, similar to folders. They help you organize your notes by project, topic, or any other criteria.</p>

      <h3>Creating Notebooks</h3>
      <ol>
        <li>Click the "+" button next to "Notebooks" in the sidebar</li>
        <li>Enter a name for your notebook</li>
        <li>Choose an icon (optional)</li>
        <li>Click "Create"</li>
      </ol>

      <h3>Default Notebooks</h3>
      <p>NoteMaster comes with these default notebooks:</p>
      <ul>
        <li><strong>📚 General:</strong> Default location for new notes</li>
        <li><strong>💼 Work:</strong> Professional and work-related notes</li>
        <li><strong>💡 Ideas:</strong> Creative thoughts and inspiration</li>
        <li><strong>✅ Tasks:</strong> Todo lists and action items</li>
      </ul>

      <h3>Moving Notes Between Notebooks</h3>
      <p>To move a note to a different notebook:</p>
      <ol>
        <li>Open the note you want to move</li>
        <li>Click the notebook dropdown in the editor</li>
        <li>Select the destination notebook</li>
        <li>The note is moved automatically</li>
      </ol>

      <h3>Nested Organization</h3>
      <p>Use notebooks in combination with:</p>
      <ul>
        <li><strong>Tags:</strong> Cross-cutting categories</li>
        <li><strong>Favorites:</strong> Quick access to important notes</li>
        <li><strong>Archive:</strong> Long-term storage</li>
      </ul>
    `
  },

  {
    id: 'tags-system',
    category: 'organization',
    title: 'Using Tags',
    description: 'Categorize and find notes with tags',
    icon: '🏷️',
    keywords: ['tag', 'label', 'category', 'organize', 'filter'],
    relatedArticles: ['smart-tags', 'search', 'organizing-notebooks'],
    content: `
      <h2>Tag System</h2>
      <p>Tags are flexible labels that help you categorize notes across different notebooks. A single note can have multiple tags.</p>

      <h3>Adding Tags</h3>
      <ol>
        <li>Open a note in the editor</li>
        <li>Find the "Tags" section below the content</li>
        <li>Click "+ Add tag" or start typing</li>
        <li>Select an existing tag or create a new one</li>
        <li>Press Enter to add the tag</li>
      </ol>

      <h3>Tag Best Practices</h3>
      <ul>
        <li><strong>Be Consistent:</strong> Use the same tags across similar notes</li>
        <li><strong>Keep it Simple:</strong> Use lowercase, single words when possible</li>
        <li><strong>Use Hierarchies:</strong> Example: project/website, project/mobile</li>
        <li><strong>Limit Tags:</strong> 3-5 tags per note is usually enough</li>
      </ul>

      <h3>Smart Tag Suggestions</h3>
      <p>NoteMaster analyzes your note content and suggests relevant tags automatically. Look for the "Smart Tag Suggestions" section while editing.</p>

      <h3>Filtering by Tags</h3>
      <p>Click any tag in the sidebar to see all notes with that tag. You can also:</p>
      <ul>
        <li>Click multiple tags to filter by all selected tags</li>
        <li>Use the search bar with # prefix (e.g., #important)</li>
        <li>View tag clouds to see your most-used tags</li>
      </ul>

      <h3>Managing Tags</h3>
      <ul>
        <li><strong>Rename:</strong> Right-click a tag and select "Rename"</li>
        <li><strong>Delete:</strong> Right-click and select "Delete" (notes won't be deleted)</li>
        <li><strong>Merge:</strong> Rename one tag to match another to merge them</li>
      </ul>
    `
  },

  // AI Features
  {
    id: 'ai-features',
    category: 'ai',
    title: 'AI-Powered Features',
    description: 'Get intelligent insights from your notes',
    icon: '🤖',
    keywords: ['ai', 'artificial intelligence', 'smart', 'suggestions', 'automation'],
    relatedArticles: ['related-notes', 'auto-summary', 'writing-suggestions'],
    content: `
      <h2>AI & Smart Features</h2>
      <p>NoteMaster uses advanced text analysis and AI to help you write better and discover connections in your notes.</p>

      <h3>Available AI Features</h3>
      
      <h4>1. Related Notes</h4>
      <p>Automatically finds notes with similar content using TF-IDF similarity analysis. Shows:</p>
      <ul>
        <li>Similarity percentage</li>
        <li>Common keywords</li>
        <li>Quick navigation to related notes</li>
      </ul>

      <h4>2. Auto Summary</h4>
      <p>Generates concise 3-sentence summaries of your notes using extractive summarization. Also suggests relevant tags based on content.</p>

      <h4>3. Writing Suggestions</h4>
      <p>Analyzes your writing and provides:</p>
      <ul>
        <li>Word count and reading time</li>
        <li>Readability metrics</li>
        <li>Style suggestions</li>
        <li>Sentence structure feedback</li>
      </ul>

      <h4>4. Smart Tag Suggestions</h4>
      <p>Analyzes note content and suggests relevant tags automatically based on keyword frequency and context.</p>

      <h3>How to Use AI Features</h3>
      <ol>
        <li>Write at least 100 characters in your note</li>
        <li>Scroll down below the editor</li>
        <li>AI features will appear automatically</li>
        <li>Click to expand each section</li>
        <li>Apply suggestions with one click</li>
      </ol>

      <h3>Privacy & Data</h3>
      <p>All AI processing happens locally in your browser. Your note content is never sent to external servers for analysis.</p>
    `
  },

  {
    id: 'related-notes',
    category: 'ai',
    title: 'Related Notes Finder',
    description: 'Discover connections between your notes',
    icon: '🔗',
    keywords: ['related', 'similar', 'connections', 'links', 'discover'],
    relatedArticles: ['ai-features', 'search', 'tags-system'],
    content: `
      <h2>Related Notes</h2>
      <p>The Related Notes feature uses TF-IDF (Term Frequency-Inverse Document Frequency) analysis to find notes with similar content.</p>

      <h3>How It Works</h3>
      <ol>
        <li>Analyzes the content of your current note</li>
        <li>Compares it with all other notes in your workspace</li>
        <li>Calculates similarity scores using cosine similarity</li>
        <li>Shows the top 5 most related notes</li>
      </ol>

      <h3>Understanding Similarity Scores</h3>
      <ul>
        <li><strong>80-100%:</strong> Very similar content, shared topics</li>
        <li><strong>60-80%:</strong> Related concepts, some overlap</li>
        <li><strong>40-60%:</strong> Loosely related, few common themes</li>
        <li><strong>Below 40%:</strong> Minimal connection</li>
      </ul>

      <h3>Common Terms</h3>
      <p>Each related note shows up to 3 common keywords that appear in both notes, helping you understand the connection.</p>

      <h3>Benefits</h3>
      <ul>
        <li><strong>Discover Connections:</strong> Find related information you forgot about</li>
        <li><strong>Cross-Reference:</strong> Build a knowledge network</li>
        <li><strong>Avoid Duplicates:</strong> See if you already have similar content</li>
        <li><strong>Enhance Research:</strong> Find all notes on a topic quickly</li>
      </ul>

      <h3>Tips for Better Results</h3>
      <ul>
        <li>Write detailed notes (200+ words)</li>
        <li>Use specific terminology</li>
        <li>Include keywords naturally</li>
        <li>Keep notes focused on specific topics</li>
      </ul>
    `
  },

  {
    id: 'writing-suggestions',
    category: 'ai',
    title: 'Writing Suggestions',
    description: 'Improve your writing with AI feedback',
    icon: '💡',
    keywords: ['writing', 'suggestions', 'feedback', 'improve', 'tips'],
    relatedArticles: ['ai-features', 'rich-text-editor'],
    content: `
      <h2>Writing Suggestions</h2>
      <p>Get real-time feedback on your writing with statistics and actionable suggestions.</p>

      <h3>Writing Statistics</h3>
      <p>Track these metrics as you write:</p>
      <ul>
        <li><strong>Word Count:</strong> Total words in your note</li>
        <li><strong>Reading Time:</strong> Estimated time to read (200 words/min)</li>
        <li><strong>Sentences:</strong> Number of sentences</li>
        <li><strong>Paragraphs:</strong> Number of paragraphs</li>
        <li><strong>Average Word Length:</strong> Complexity indicator</li>
        <li><strong>Average Sentence Length:</strong> Readability metric</li>
      </ul>

      <h3>Types of Suggestions</h3>

      <h4>Readability</h4>
      <ul>
        <li>Warns about overly long sentences (&gt;25 words)</li>
        <li>Suggests breaking up complex sentences</li>
        <li>Recommends paragraph breaks for long content</li>
      </ul>

      <h4>Style</h4>
      <ul>
        <li>Detects passive voice usage</li>
        <li>Suggests more active voice</li>
        <li>Recommends adding detail to short notes</li>
        <li>Encourages better structure</li>
      </ul>

      <h4>Positive Feedback</h4>
      <p>When your note is well-written, you'll get positive reinforcement! Look for green success messages.</p>

      <h3>How to Use Suggestions</h3>
      <ol>
        <li>Write your content naturally</li>
        <li>Scroll down to see Writing Insights</li>
        <li>Click to expand the section</li>
        <li>Review statistics and suggestions</li>
        <li>Make improvements based on feedback</li>
      </ol>

      <h3>Best Practices</h3>
      <ul>
        <li>Use suggestions as guidelines, not rules</li>
        <li>Consider your audience and purpose</li>
        <li>Maintain your unique writing voice</li>
        <li>Focus on clarity and communication</li>
      </ul>
    `
  },

  // Search & Navigation
  {
    id: 'search',
    category: 'features',
    title: 'Search and Find Notes',
    description: 'Quickly find any note with powerful search',
    icon: '🔍',
    keywords: ['search', 'find', 'query', 'filter', 'lookup'],
    relatedArticles: ['command-palette', 'tags-system', 'keyboard-shortcuts'],
    content: `
      <h2>Search Capabilities</h2>
      <p>NoteMaster offers multiple ways to find your notes quickly.</p>

      <h3>Quick Search</h3>
      <p>Use the search bar at the top of the sidebar:</p>
      <ul>
        <li>Type any keyword to search titles and content</li>
        <li>Results update in real-time as you type</li>
        <li>Search across all notebooks simultaneously</li>
        <li>Case-insensitive by default</li>
      </ul>

      <h3>Advanced Search Operators</h3>
      <ul>
        <li><code>#tag</code> - Search by tag (e.g., #important)</li>
        <li><code>notebook:name</code> - Filter by notebook</li>
        <li><code>is:pinned</code> - Show only pinned notes</li>
        <li><code>is:archived</code> - Search archived notes</li>
        <li><code>created:today</code> - Filter by date</li>
      </ul>

      <h3>Command Palette Search</h3>
      <p>Press <kbd>Ctrl+P</kbd> to open the command palette:</p>
      <ul>
        <li>Search for notes and commands</li>
        <li>Navigate with keyboard arrows</li>
        <li>Press Enter to open selected note</li>
        <li>Fuzzy matching for flexible search</li>
      </ul>

      <h3>Filter by Attributes</h3>
      <p>Click these in the sidebar to filter:</p>
      <ul>
        <li><strong>Notebooks:</strong> Show notes in specific notebook</li>
        <li><strong>Tags:</strong> Filter by one or more tags</li>
        <li><strong>Favorites:</strong> Show starred notes</li>
        <li><strong>Archive:</strong> View archived notes</li>
      </ul>

      <h3>Search Tips</h3>
      <ul>
        <li>Use specific keywords for better results</li>
        <li>Combine search with filters</li>
        <li>Check spelling if no results found</li>
        <li>Try synonyms or related terms</li>
      </ul>
    `
  },

  {
    id: 'command-palette',
    category: 'features',
    title: 'Command Palette',
    description: 'Quick access to all features with keyboard',
    icon: '⌨️',
    keywords: ['command', 'palette', 'keyboard', 'shortcut', 'quick'],
    relatedArticles: ['keyboard-shortcuts', 'search'],
    content: `
      <h2>Command Palette</h2>
      <p>The command palette gives you instant access to all NoteMaster features through a searchable interface.</p>

      <h3>Opening the Command Palette</h3>
      <ul>
        <li>Press <kbd>Ctrl+P</kbd> (Windows/Linux)</li>
        <li>Press <kbd>Cmd+P</kbd> (Mac)</li>
        <li>Click the command icon in the toolbar</li>
      </ul>

      <h3>Available Commands</h3>

      <h4>Note Operations</h4>
      <ul>
        <li><strong>New Note</strong> - Create a new note</li>
        <li><strong>Delete Note</strong> - Delete the current note</li>
        <li><strong>Pin Note</strong> - Pin/unpin current note</li>
        <li><strong>Archive Note</strong> - Move to archive</li>
        <li><strong>Add to Favorites</strong> - Star the note</li>
      </ul>

      <h4>View Commands</h4>
      <ul>
        <li><strong>Reading Mode</strong> - Distraction-free reading</li>
        <li><strong>Split View</strong> - View two notes side-by-side</li>
        <li><strong>Calendar View</strong> - Show calendar</li>
        <li><strong>Table of Contents</strong> - Navigate by headings</li>
      </ul>

      <h4>Tools</h4>
      <ul>
        <li><strong>Export Note</strong> - Export to various formats</li>
        <li><strong>Web Clipper</strong> - Save web content</li>
        <li><strong>Analytics</strong> - View usage statistics</li>
        <li><strong>Settings</strong> - Open settings panel</li>
      </ul>

      <h3>How to Use</h3>
      <ol>
        <li>Open the command palette (<kbd>Ctrl+P</kbd>)</li>
        <li>Type to search for commands or notes</li>
        <li>Use ↑/↓ arrows to navigate</li>
        <li>Press Enter to execute command</li>
        <li>Press Esc to close</li>
      </ol>

      <h3>Tips</h3>
      <ul>
        <li>You don't need to type the full command name</li>
        <li>Fuzzy matching works (e.g., "nwnote" finds "New Note")</li>
        <li>Recent commands appear at the top</li>
        <li>Use it to navigate between notes quickly</li>
      </ul>
    `
  },

  // Keyboard Shortcuts
  {
    id: 'keyboard-shortcuts',
    category: 'basics',
    title: 'Keyboard Shortcuts',
    description: 'Work faster with keyboard shortcuts',
    icon: '⌨️',
    keywords: ['keyboard', 'shortcuts', 'hotkeys', 'keys', 'fast'],
    relatedArticles: ['command-palette', 'creating-notes'],
    content: `
      <h2>Keyboard Shortcuts</h2>
      <p>Master these shortcuts to work faster and more efficiently.</p>

      <h3>General</h3>
      <ul>
        <li><kbd>Ctrl+P</kbd> - Open command palette</li>
        <li><kbd>Ctrl+N</kbd> - New note</li>
        <li><kbd>Ctrl+S</kbd> - Save note (auto-saves already)</li>
        <li><kbd>Ctrl+F</kbd> - Search notes</li>
        <li><kbd>?</kbd> - Open help center</li>
      </ul>

      <h3>Text Formatting</h3>
      <ul>
        <li><kbd>Ctrl+B</kbd> - Bold</li>
        <li><kbd>Ctrl+I</kbd> - Italic</li>
        <li><kbd>Ctrl+U</kbd> - Underline</li>
        <li><kbd>Ctrl+Z</kbd> - Undo</li>
        <li><kbd>Ctrl+Y</kbd> - Redo</li>
        <li><kbd>Ctrl+K</kbd> - Insert link</li>
      </ul>

      <h3>Navigation</h3>
      <ul>
        <li><kbd>↑/↓</kbd> - Navigate note list</li>
        <li><kbd>Enter</kbd> - Open selected note</li>
        <li><kbd>Esc</kbd> - Close dialogs</li>
        <li><kbd>Ctrl+[</kbd> - Previous note</li>
        <li><kbd>Ctrl+]</kbd> - Next note</li>
      </ul>

      <h3>Organization</h3>
      <ul>
        <li><kbd>Ctrl+Shift+P</kbd> - Pin/unpin note</li>
        <li><kbd>Ctrl+Shift+F</kbd> - Add to favorites</li>
        <li><kbd>Ctrl+Shift+A</kbd> - Archive note</li>
        <li><kbd>Ctrl+Shift+T</kbd> - Add tag</li>
      </ul>

      <h3>Views</h3>
      <ul>
        <li><kbd>Ctrl+Shift+R</kbd> - Reading mode</li>
        <li><kbd>Ctrl+Shift+S</kbd> - Split view</li>
        <li><kbd>Ctrl+Shift+C</kbd> - Calendar view</li>
        <li><kbd>Ctrl+\\</kbd> - Toggle sidebar</li>
      </ul>

      <h3>macOS Shortcuts</h3>
      <p>On Mac, replace <kbd>Ctrl</kbd> with <kbd>Cmd</kbd> for most shortcuts.</p>
    `
  },

  // Templates
  {
    id: 'templates',
    category: 'features',
    title: 'Using Templates',
    description: 'Start notes quickly with pre-built templates',
    icon: '📋',
    keywords: ['template', 'preset', 'starter', 'format', 'structure'],
    relatedArticles: ['creating-notes', 'organizing-notebooks'],
    content: `
      <h2>Note Templates</h2>
      <p>Templates help you start notes with pre-defined structure and formatting.</p>

      <h3>Available Templates</h3>
      
      <h4>📝 Meeting Notes</h4>
      <p>Structured template for meeting notes with sections for attendees, agenda, and action items.</p>

      <h4>✅ Task List</h4>
      <p>Checklist template for todos and tasks with priority levels.</p>

      <h4>📚 Book Notes</h4>
      <p>Template for capturing book summaries, key quotes, and reflections.</p>

      <h4>💭 Daily Journal</h4>
      <p>Daily journal entry with prompts for reflection and planning.</p>

      <h4>🎯 Project Plan</h4>
      <p>Project planning template with goals, milestones, and resources.</p>

      <h4>📊 Research Notes</h4>
      <p>Academic research template with hypothesis, methods, and findings.</p>

      <h3>Using Templates</h3>
      <ol>
        <li>Click "New Note" button</li>
        <li>Click "Choose Template" at the top</li>
        <li>Browse and select a template</li>
        <li>Click "Use Template"</li>
        <li>Fill in the template sections</li>
      </ol>

      <h3>Creating Custom Templates</h3>
      <ol>
        <li>Create a note with your desired structure</li>
        <li>Format it exactly how you want</li>
        <li>Click "Save as Template" in the menu</li>
        <li>Give it a name and description</li>
        <li>It will appear in your template library</li>
      </ol>

      <h3>Template Best Practices</h3>
      <ul>
        <li>Use headings to organize sections</li>
        <li>Include placeholder text as examples</li>
        <li>Add instructions in italics</li>
        <li>Use consistent formatting</li>
        <li>Keep templates focused and reusable</li>
      </ul>
    `
  },

  // Export & Backup
  {
    id: 'export',
    category: 'features',
    title: 'Export and Backup',
    description: 'Save your notes in different formats',
    icon: '📤',
    keywords: ['export', 'backup', 'save', 'download', 'markdown'],
    relatedArticles: ['import', 'backup'],
    content: `
      <h2>Export Options</h2>
      <p>NoteMaster supports exporting your notes to various formats for sharing and backup.</p>

      <h3>Supported Export Formats</h3>
      
      <h4>� Markdown (.md)</h4>
      <ul>
        <li>Plain text with formatting markers</li>
        <li>Compatible with many apps</li>
        <li>Easy to version control</li>
        <li>Preserves basic formatting</li>
      </ul>

      <h4>🌐 HTML (.html)</h4>
      <ul>
        <li>Web-ready format</li>
        <li>Preserves all formatting</li>
        <li>Can be opened in browsers</li>
        <li>Includes inline styles</li>
      </ul>

      <h4>📋 Plain Text (.txt)</h4>
      <ul>
        <li>No formatting, just content</li>
        <li>Universal compatibility</li>
        <li>Smallest file size</li>
      </ul>

      <h4>📊 JSON</h4>
      <ul>
        <li>Machine-readable format</li>
        <li>Includes all metadata (tags, category, timestamps)</li>
        <li>Perfect for programmatic use or backups</li>
      </ul>

      <h3>How to Export</h3>
      <ol>
        <li>Open the note you want to export</li>
        <li>Click the "Export" button (download icon) in the toolbar</li>
        <li>Choose your preferred format from the dropdown</li>
        <li>Click "Export"</li>
        <li>The file will be downloaded to your browser's download folder</li>
      </ol>

      <h3>Tips for Exporting</h3>
      <ul>
        <li><strong>Markdown:</strong> Best for migrating to other note-taking apps</li>
        <li><strong>HTML:</strong> Best for sharing formatted notes via web</li>
        <li><strong>Plain Text:</strong> Best for reading content without formatting</li>
        <li><strong>JSON:</strong> Best for backups with full metadata preservation</li>
      </ul>
    `
  },

  // Settings & Customization
  {
    id: 'settings',
    category: 'basics',
    title: 'Settings and Customization',
    description: 'Personalize your NoteMaster experience',
    icon: '⚙️',
    keywords: ['settings', 'preferences', 'customize', 'options', 'configuration'],
    relatedArticles: ['themes', 'fonts'],
    content: `
      <h2>Settings</h2>
      <p>Customize NoteMaster to match your preferences and workflow.</p>

      <h3>Accessing Settings</h3>
      <ul>
        <li>Click the settings icon (⚙️) in the sidebar</li>
        <li>Press <kbd>Ctrl+,</kbd></li>
        <li>Use Command Palette → "Settings"</li>
      </ul>

      <h3>Appearance Settings</h3>
      <ul>
        <li><strong>Theme:</strong> Choose from 6 color themes (Light, Dark, Nord, Solarized, Dracula, Monokai)</li>
        <li><strong>Font:</strong> Select your preferred font family</li>
        <li><strong>Font Size:</strong> Adjust text size (12px - 24px)</li>
        <li><strong>Line Height:</strong> Control spacing between lines</li>
      </ul>

      <h3>Editor Settings</h3>
      <ul>
        <li><strong>Auto-save:</strong> Enable/disable automatic saving</li>
        <li><strong>Spell Check:</strong> Browser-based spell checking</li>
        <li><strong>Line Numbers:</strong> Show line numbers in editor</li>
        <li><strong>Word Wrap:</strong> Wrap long lines</li>
      </ul>

      <h3>Organization Settings</h3>
      <ul>
        <li><strong>Default Notebook:</strong> Where new notes are created</li>
        <li><strong>Note Sorting:</strong> Sort by date, title, or manual</li>
        <li><strong>Archive Behavior:</strong> Auto-archive old notes</li>
      </ul>

      <h3>AI Features</h3>
      <ul>
        <li><strong>Enable AI:</strong> Toggle AI features on/off</li>
        <li><strong>Auto-suggestions:</strong> Show smart tag suggestions</li>
        <li><strong>Related Notes:</strong> Enable related notes finder</li>
        <li><strong>Writing Insights:</strong> Show writing statistics</li>
      </ul>

      <h3>Privacy & Security</h3>
      <ul>
        <li><strong>End-to-end Encryption:</strong> Encrypt notes at rest</li>
        <li><strong>Auto-lock:</strong> Lock app after inactivity</li>
        <li><strong>Password Protection:</strong> Require password to open</li>
      </ul>

      <h3>Data & Storage</h3>
      <ul>
        <li><strong>Local Storage:</strong> Notes stored in browser IndexedDB</li>
        <li><strong>Export Backups:</strong> Manually export notes as JSON for backup</li>
        <li><strong>Clear Data:</strong> Option to reset and clear all notes (use with caution)</li>
      </ul>
    `
  },

  {
    id: 'themes',
    category: 'customization',
    title: 'Themes and Appearance',
    description: 'Customize the look and feel of NoteMaster',
    icon: '🎨',
    keywords: ['theme', 'color', 'dark mode', 'appearance', 'style'],
    relatedArticles: ['settings', 'fonts'],
    content: `
      <h2>Themes</h2>
      <p>NoteMaster includes 6 professionally designed themes to suit your preferences.</p>

      <h3>Available Themes</h3>

      <h4>☀️ Light</h4>
      <p>Clean, bright theme perfect for daytime use. High contrast for easy reading.</p>

      <h4>🌙 Dark</h4>
      <p>Easy on the eyes in low-light conditions. Modern dark interface with blue accents.</p>

      <h4>❄️ Nord</h4>
      <p>Arctic-inspired color palette. Cool blues and grays for a calm atmosphere.</p>

      <h4>🌅 Solarized</h4>
      <p>Carefully designed contrast ratios. Warm tones that reduce eye strain.</p>

      <h4>🧛 Dracula</h4>
      <p>Popular dark theme with vibrant purple accents. High contrast for code and text.</p>

      <h4>🌃 Monokai</h4>
      <p>Warm dark theme with earthy tones. Originally designed for code editors.</p>

      <h3>Changing Themes</h3>
      <ol>
        <li>Open Settings (⚙️)</li>
        <li>Go to "Appearance" section</li>
        <li>Click on a theme preview</li>
        <li>Theme changes instantly</li>
      </ol>

      <h3>Theme Features</h3>
      <ul>
        <li><strong>Consistent:</strong> All UI elements follow the theme</li>
        <li><strong>Accessible:</strong> WCAG AA contrast standards</li>
        <li><strong>Responsive:</strong> Works in all views and dialogs</li>
        <li><strong>Persistent:</strong> Saved across sessions</li>
      </ul>

      <h3>Custom Colors</h3>
      <p>While creating custom themes isn't supported yet, you can:</p>
      <ul>
        <li>Use text color and highlight tools in the editor</li>
        <li>Customize individual notes with colors</li>
        <li>Request custom themes via feedback</li>
      </ul>
    `
  },

  // Smart Folders
  {
    id: 'smart-folders',
    category: 'organization',
    title: 'Smart Folders',
    description: 'Automatic organization with intelligent filters',
    icon: '🗂️',
    keywords: ['smart folder', 'automatic', 'filter', 'organize', 'dynamic'],
    relatedArticles: ['organizing-notebooks', 'tags-system', 'favorites'],
    content: `
      <h2>Smart Folders</h2>
      <p>Smart Folders automatically organize notes based on rules and criteria.</p>

      <h3>Default Smart Folders</h3>

      <h4>📌 Pinned</h4>
      <p>All notes you've pinned for quick access.</p>

      <h4>📅 Today</h4>
      <p>Notes created or modified today.</p>

      <h4>📆 This Week</h4>
      <p>Notes from the past 7 days.</p>

      <h4>⭐ Favorites</h4>
      <p>Notes you've marked as favorites.</p>

      <h4>✅ Tasks</h4>
      <p>Notes with checkboxes or in the Tasks notebook.</p>

      <h4>📋 Untagged</h4>
      <p>Notes without any tags (helps you organize better).</p>

      <h4>🔖 Long Notes</h4>
      <p>Notes with more than 1000 words.</p>

      <h4>📝 Short Notes</h4>
      <p>Quick notes under 100 words.</p>

      <h4>🔗 With Links</h4>
      <p>Notes containing external links.</p>

      <h4>📸 With Images</h4>
      <p>Notes that include images.</p>

      <h3>How Smart Folders Work</h3>
      <ul>
        <li><strong>Automatic:</strong> Notes appear automatically when they match criteria</li>
        <li><strong>Dynamic:</strong> Updates in real-time as notes change</li>
        <li><strong>Non-destructive:</strong> Notes stay in their original location</li>
        <li><strong>Multiple:</strong> Same note can appear in multiple smart folders</li>
      </ul>

      <h3>Creating Custom Smart Folders</h3>
      <ol>
        <li>Click "+ New Smart Folder" in sidebar</li>
        <li>Name your folder</li>
        <li>Set filter criteria:
          <ul>
            <li>Contains text</li>
            <li>Has tag(s)</li>
            <li>In notebook(s)</li>
            <li>Created/modified date</li>
            <li>Word count range</li>
          </ul>
        </li>
        <li>Click "Create"</li>
      </ol>

      <h3>Use Cases</h3>
      <ul>
        <li><strong>Project Tracking:</strong> All notes tagged with project name</li>
        <li><strong>Study Materials:</strong> Notes in specific notebooks with certain tags</li>
        <li><strong>Content Calendar:</strong> Notes with due dates this month</li>
        <li><strong>Research Collection:</strong> Long notes with specific keywords</li>
      </ul>
    `
  },

  // Favorites & Archive
  {
    id: 'favorites',
    category: 'organization',
    title: 'Favorites and Archive',
    description: 'Quick access and long-term storage',
    icon: '⭐',
    keywords: ['favorite', 'star', 'archive', 'storage', 'bookmark'],
    relatedArticles: ['organizing-notebooks', 'smart-folders'],
    content: `
      <h2>Favorites</h2>
      <p>Mark important notes as favorites for quick access.</p>

      <h3>Adding to Favorites</h3>
      <ul>
        <li>Click the star icon next to note title</li>
        <li>Right-click note → "Add to Favorites"</li>
        <li>Press <kbd>Ctrl+Shift+F</kbd></li>
        <li>Use Command Palette → "Add to Favorites"</li>
      </ul>

      <h3>Viewing Favorites</h3>
      <p>Click the "Favorites" folder in the sidebar to see all starred notes. Favorites are:</p>
      <ul>
        <li>Sorted by last modified</li>
        <li>Accessible from any notebook</li>
        <li>Stored locally in your browser</li>
        <li>Searchable like regular notes</li>
      </ul>

      <h2>Archive</h2>
      <p>Archive old or completed notes to reduce clutter while keeping them accessible.</p>

      <h3>Archiving Notes</h3>
      <ul>
        <li>Click "Archive" button in note menu</li>
        <li>Right-click note → "Archive"</li>
        <li>Press <kbd>Ctrl+Shift+A</kbd></li>
        <li>Use Command Palette → "Archive Note"</li>
      </ul>

      <h3>What Happens When Archived</h3>
      <ul>
        <li>Note is removed from main view</li>
        <li>Still searchable if you include archived notes</li>
        <li>Keeps all tags, attachments, and metadata</li>
        <li>Can be unarchived anytime</li>
      </ul>

      <h3>Viewing Archived Notes</h3>
      <ol>
        <li>Click "Archive" in sidebar</li>
        <li>Browse archived notes</li>
        <li>Click any note to view</li>
        <li>Click "Unarchive" to restore</li>
      </ol>

      <h3>When to Archive</h3>
      <ul>
        <li>Completed projects</li>
        <li>Old meeting notes</li>
        <li>Reference material you rarely need</li>
        <li>Finished tasks and todos</li>
        <li>Historical records</li>
      </ul>

      <h3>Archive vs. Delete</h3>
      <ul>
        <li><strong>Archive:</strong> Keeps note, just hidden from main view</li>
        <li><strong>Delete:</strong> Permanently removes note (can't be recovered)</li>
      </ul>
    `
  },

  // Troubleshooting
  {
    id: 'troubleshooting',
    category: 'help',
    title: 'Troubleshooting Common Issues',
    description: 'Solutions to common problems',
    icon: '🔧',
    keywords: ['troubleshoot', 'problem', 'issue', 'error', 'bug', 'fix'],
    relatedArticles: ['settings', 'backup'],
    content: `
      <h2>Common Issues & Solutions</h2>

      <h3>Notes Not Saving</h3>
      <p><strong>Problem:</strong> Changes aren't being saved</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Check browser storage quota (Settings → Storage)</li>
        <li>Verify you're logged in</li>
        <li>Try refreshing the page</li>
        <li>Check browser console for errors</li>
        <li>Clear browser cache and reload</li>
        <li>Ensure browser allows IndexedDB storage</li>
      </ul>

      <h3>Search Not Working</h3>
      <p><strong>Problem:</strong> Can't find notes in search</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Check spelling</li>
        <li>Try different keywords</li>
        <li>Make sure note isn't archived (check archive folder)</li>
        <li>Verify search operators are correct</li>
        <li>Wait a few seconds for search index to update</li>
      </ul>

      <h3>AI Features Not Appearing</h3>
      <p><strong>Problem:</strong> Related Notes or suggestions not showing</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Write at least 100 characters in your note</li>
        <li>Check Settings → AI Features are enabled</li>
        <li>Ensure you have multiple notes (for Related Notes)</li>
        <li>Disable distraction-free mode</li>
        <li>Scroll down below the editor</li>
      </ul>

      <h3>Formatting Issues</h3>
      <p><strong>Problem:</strong> Text formatting looks wrong</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Try using the formatting toolbar instead of paste</li>
        <li>Use "Paste as Plain Text" (Ctrl+Shift+V)</li>
        <li>Clear formatting and reapply</li>
        <li>Check if theme is applied correctly</li>
      </ul>

      <h3>Performance Issues</h3>
      <p><strong>Problem:</strong> App is slow or laggy</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Close other browser tabs</li>
        <li>Clear browser cache</li>
        <li>Disable browser extensions</li>
        <li>Reduce font size</li>
        <li>Archive old notes</li>
        <li>Use fewer AI features simultaneously</li>
      </ul>

      <h3>Login Problems</h3>
      <p><strong>Problem:</strong> Can't sign in or session expired</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Clear cookies and cache</li>
        <li>Check username/password are correct</li>
        <li>Reset password if forgotten</li>
        <li>Try a different browser</li>
        <li>Disable browser privacy extensions temporarily</li>
      </ul>

      <h3>Data Storage Issues</h3>
      <p><strong>Problem:</strong> Notes not saving or loading</p>
      <p><strong>Solutions:</strong></p>
      <ul>
        <li>Check browser storage quota (Settings → Storage)</li>
        <li>Clear browser cache and reload page</li>
        <li>Ensure browser allows local storage for this site</li>
        <li>Try exporting notes as backup before troubleshooting</li>
        <li>Check browser console for error messages</li>
      </ul>

      <h3>Still Need Help?</h3>
      <ul>
        <li>Check the documentation for your specific feature</li>
        <li>Search existing help articles</li>
        <li>Contact support with detailed description</li>
        <li>Include browser/OS version information</li>
        <li>Provide screenshots if possible</li>
      </ul>
    `
  },

  // NEW v1.5.0 Features
  {
    id: 'sharing-notes',
    category: 'collaboration',
    title: 'Sharing Notes with Public Links',
    description: 'Share your notes with anyone using public links',
    icon: '🔗',
    keywords: ['share', 'link', 'public', 'collaborate', 'url', 'sharing'],
    relatedArticles: ['email-invitations', 'version-control'],
    content: `
      <h2>Share Your Notes</h2>
      <p>NoteMaster v1.5.0 introduces powerful sharing capabilities. Share any note with colleagues, friends, or the public using secure share links.</p>

      <h3>How to Generate a Share Link</h3>
      <ol>
        <li>Open the note you want to share</li>
        <li>Click the <strong>🔗 Share</strong> button in the toolbar</li>
        <li>Choose an expiration option (optional):
          <ul>
            <li>Never expires (default)</li>
            <li>1 day</li>
            <li>7 days</li>
            <li>30 days</li>
            <li>90 days</li>
          </ul>
        </li>
        <li>Click <strong>"Generate Share Link"</strong></li>
        <li>Copy the link and share it!</li>
      </ol>

      <h3>Quick Access</h3>
      <ul>
        <li>Use Command Palette: <kbd>Ctrl+P</kbd> → type "share"</li>
        <li>Toolbar button: <strong>🔗 Share</strong></li>
      </ul>

      <h3>Link Security</h3>
      <ul>
        <li><strong>Unique tokens:</strong> Each link uses a cryptographically secure 64-character token</li>
        <li><strong>Read-only:</strong> Shared notes cannot be edited by viewers</li>
        <li><strong>Expiration:</strong> Links automatically expire based on your settings</li>
        <li><strong>Revocable:</strong> You can delete share links at any time</li>
      </ul>

      <h3>What Viewers See</h3>
      <p>When someone opens your share link, they'll see:</p>
      <ul>
        <li>Note title and content (read-only)</li>
        <li>Tags associated with the note</li>
        <li>Creation and update dates</li>
        <li>Clean, distraction-free interface</li>
        <li>Link to try NoteMaster</li>
      </ul>

      <h3>Sharing Tips</h3>
      <ul>
        <li>Use expiration dates for sensitive information</li>
        <li>Review note content before sharing</li>
        <li>Share links work without authentication</li>
        <li>Perfect for documentation, tutorials, and collaboration</li>
      </ul>

      <h3>Managing Share Links</h3>
      <p>To revoke a share link:</p>
      <ol>
        <li>Open the Share dialog</li>
        <li>Click "Generate New Link" to invalidate the old one</li>
      </ol>
    `
  },

  {
    id: 'email-invitations',
    category: 'collaboration',
    title: 'Email Invitations',
    description: 'Send notes directly via email with personalized invitations',
    icon: '📧',
    keywords: ['email', 'invite', 'send', 'invitation', 'share', 'mailto'],
    relatedArticles: ['sharing-notes', 'version-control'],
    content: `
      <h2>Email Invitations</h2>
      <p>Share notes directly via email with personalized messages and professional formatting.</p>

      <h3>How to Send an Email Invitation</h3>
      <ol>
        <li>Generate a share link for your note</li>
        <li>In the Share dialog, scroll to <strong>"📧 Send via Email"</strong></li>
        <li>Enter recipient's email address</li>
        <li>Add a personal message (optional)</li>
        <li>Click <strong>"Send Email Invitation"</strong></li>
      </ol>

      <h3>Email Template</h3>
      <p>Recipients receive a professionally formatted email containing:</p>
      <ul>
        <li>Your name and note title</li>
        <li>Your personal message</li>
        <li>Prominent "View Shared Note" button</li>
        <li>NoteMaster branding</li>
        <li>Clean, mobile-responsive design</li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li><strong>Personalize:</strong> Add context in your message</li>
        <li><strong>Be specific:</strong> Mention why you're sharing</li>
        <li><strong>Set expectations:</strong> Tell them what to expect</li>
        <li><strong>Check content:</strong> Review note before sharing</li>
      </ul>

      <h3>Example Messages</h3>
      <p><strong>For work:</strong><br>
      "Here are the meeting notes from today's discussion. Please review and let me know if I missed anything."</p>
      
      <p><strong>For study groups:</strong><br>
      "Check out my notes on Chapter 5. Hope this helps with the exam!"</p>
      
      <p><strong>For projects:</strong><br>
      "Latest project documentation is ready. Take a look and share your feedback."</p>

      <h3>Email Integration</h3>
      <p><em>Note:</em> The email feature requires email service configuration (SendGrid, Nodemailer, etc.) for production use. In development, emails are logged to the console.</p>
    `
  },

  {
    id: 'version-control',
    category: 'collaboration',
    title: 'Version Control & History',
    description: 'Track changes and restore previous versions of your notes',
    icon: '📚',
    keywords: ['version', 'history', 'restore', 'backup', 'changes', 'revisions'],
    relatedArticles: ['sharing-notes', 'creating-notes'],
    content: `
      <h2>Version Control System</h2>
      <p>Never lose work again! NoteMaster automatically tracks changes and lets you restore any previous version of your notes.</p>

      <h3>Automatic Version Tracking</h3>
      <p>Versions are automatically created when you:</p>
      <ul>
        <li>Change the note title</li>
        <li>Modify note content</li>
        <li>Update tags or notebook assignment</li>
      </ul>
      <p><em>Note:</em> Version snapshots are created periodically, not with every keystroke, to optimize performance.</p>

      <h3>Viewing Version History</h3>
      <ol>
        <li>Open any note</li>
        <li>Click <strong>📚 History</strong> in the toolbar</li>
        <li>View all past versions with metadata:
          <ul>
            <li>Version number</li>
            <li>Timestamp</li>
            <li>Title at that time</li>
            <li>Tags at that time</li>
            <li>Notebook assignment</li>
            <li>Content preview</li>
          </ul>
        </li>
      </ol>

      <h3>Restoring a Previous Version</h3>
      <ol>
        <li>Open the Version History dialog</li>
        <li>Review the version you want to restore</li>
        <li>Click the <strong>"Restore"</strong> button</li>
        <li>Confirm restoration</li>
      </ol>
      <p><strong>Important:</strong> Restoring creates a new version with the old content, so you can always undo a restore.</p>

      <h3>Version Limits</h3>
      <ul>
        <li>NoteMaster keeps the last <strong>50 versions</strong> per note</li>
        <li>Oldest versions are automatically removed when limit is reached</li>
        <li>Current version is always preserved</li>
      </ul>

      <h3>Version Metadata</h3>
      <p>Each version stores:</p>
      <ul>
        <li><strong>Content:</strong> Full note text</li>
        <li><strong>Title:</strong> Note title at that time</li>
        <li><strong>Tags:</strong> All tags applied</li>
        <li><strong>Notebook:</strong> Notebook assignment</li>
        <li><strong>Timestamp:</strong> When version was created</li>
      </ul>

      <h3>Use Cases</h3>
      <ul>
        <li><strong>Accidental deletions:</strong> Restore content you accidentally removed</li>
        <li><strong>Experimentation:</strong> Try different approaches and revert if needed</li>
        <li><strong>Document evolution:</strong> Track how your thinking evolved over time</li>
        <li><strong>Audit trail:</strong> Maintain history for important documents</li>
        <li><strong>Peace of mind:</strong> Never worry about losing work</li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>Check version history before major rewrites</li>
        <li>Use descriptive titles to identify versions easily</li>
        <li>Restore versions when needed, don't hesitate</li>
        <li>Combine with regular backups for extra safety</li>
      </ul>
    `
  },

  {
    id: 'media-content',
    category: 'editing',
    title: 'Rich Media Content',
    description: 'Embed videos, math equations, and diagrams in your notes',
    icon: '🎨',
    keywords: ['media', 'video', 'math', 'latex', 'mermaid', 'diagram', 'embed'],
    relatedArticles: ['rich-text-editor', 'markdown', 'creating-notes'],
    content: `
      <h2>Rich Media Support</h2>
      <p>NoteMaster v1.5.0 includes powerful media embedding capabilities for professional documentation and technical notes.</p>

      <h3>Video Embeds 🎥</h3>
      <p>Embed videos directly in your notes:</p>
      
      <h4>Supported Platforms:</h4>
      <ul>
        <li><strong>YouTube:</strong> Full videos, playlists, and shorts</li>
        <li><strong>Vimeo:</strong> Standard and private videos</li>
      </ul>

      <h4>How to Embed Videos:</h4>
      <ol>
        <li>Click the video button in the editor toolbar</li>
        <li>Paste the YouTube or Vimeo URL</li>
        <li>Video automatically embeds with responsive player</li>
      </ol>

      <h4>Manual Embed (Advanced):</h4>
      <pre><code>&lt;iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID"&gt;&lt;/iframe&gt;</code></pre>

      <h3>LaTeX Math Equations ∑</h3>
      <p>Write beautiful mathematical equations using LaTeX syntax:</p>

      <h4>Inline Math:</h4>
      <p>Wrap equations in single dollar signs: <code>$E = mc^2$</code></p>
      <p>Example: The equation $E = mc^2$ is Einstein's famous formula.</p>

      <h4>Block Math:</h4>
      <p>Wrap equations in double dollar signs for display mode:</p>
      <pre><code>$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$</code></pre>

      <h4>Common Math Symbols:</h4>
      <ul>
        <li>Fractions: <code>\\frac{a}{b}</code></li>
        <li>Superscript: <code>x^2</code></li>
        <li>Subscript: <code>x_i</code></li>
        <li>Square root: <code>\\sqrt{x}</code></li>
        <li>Summation: <code>\\sum_{i=1}^{n}</code></li>
        <li>Integral: <code>\\int_{a}^{b}</code></li>
        <li>Greek letters: <code>\\alpha, \\beta, \\gamma</code></li>
      </ul>

      <h4>Quick Insert:</h4>
      <p>Click the <strong>∑</strong> button in the toolbar and choose inline or block math.</p>

      <h3>Mermaid Diagrams 📊</h3>
      <p>Create flowcharts, sequence diagrams, and more using Mermaid syntax:</p>

      <h4>Flowcharts:</h4>
      <pre><code>\`\`\`mermaid
flowchart TD
    A[Start] --&gt; B{Decision}
    B --&gt;|Yes| C[Action 1]
    B --&gt;|No| D[Action 2]
\`\`\`</code></pre>

      <h4>Sequence Diagrams:</h4>
      <pre><code>\`\`\`mermaid
sequenceDiagram
    Alice-&gt;&gt;Bob: Hello!
    Bob-&gt;&gt;Alice: Hi there!
\`\`\`</code></pre>

      <h4>Gantt Charts:</h4>
      <pre><code>\`\`\`mermaid
gantt
    title Project Timeline
    section Phase 1
    Task 1: 2024-01-01, 30d
    Task 2: after Task 1, 20d
\`\`\`</code></pre>

      <h4>Supported Diagram Types:</h4>
      <ul>
        <li>Flowcharts</li>
        <li>Sequence diagrams</li>
        <li>Gantt charts</li>
        <li>Pie charts</li>
        <li>Class diagrams</li>
        <li>State diagrams</li>
        <li>Entity-relationship diagrams</li>
      </ul>

      <h4>Quick Insert:</h4>
      <p>Click the diagram button in the toolbar, choose diagram type, and edit the template.</p>

      <h3>Code Syntax Highlighting 💻</h3>
      <p>Enhanced code blocks with syntax highlighting:</p>
      <pre><code>\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`</code></pre>

      <p>Supported languages: JavaScript, Python, TypeScript, Java, C++, and many more!</p>

      <h3>Tips for Rich Media</h3>
      <ul>
        <li>Use video embeds for tutorials and demonstrations</li>
        <li>LaTeX is perfect for scientific and academic notes</li>
        <li>Mermaid diagrams great for technical documentation</li>
        <li>Combine media types for comprehensive notes</li>
        <li>Preview your content before sharing</li>
      </ul>
    `
  },
];

