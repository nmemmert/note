'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { useCallback, useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import { CodeBlock } from '@tiptap/extension-code-block';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import MediaInserter from './MediaInserter';
import { CollapsibleSection } from './CollapsibleSection';
import { Hashtag } from './Hashtag';
import Underline from '@tiptap/extension-underline';
import { common, createLowlight } from 'lowlight';
import { NoteLink } from './NoteLink';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import FontFamily from '@tiptap/extension-font-family';

// Global function to update note tags
declare global {
  var updateNoteTags: ((tags: string[]) => void) | undefined;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  notebookId?: string;
  notebooks?: Array<{ id: string; name: string; icon: string }>;
  onNotebookChange?: (notebookId: string) => void;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  dueDate?: string;
  onDueDateChange?: (dueDate: string) => void;
  completed?: boolean;
  onCompletedChange?: (completed: boolean) => void;
}

const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Start writing...", 
  notebookId,
  notebooks = [],
  onNotebookChange,
  tags = [],
  onTagsChange,
  dueDate,
  onDueDateChange,
  completed = false,
  onCompletedChange
}: RichTextEditorProps) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [showMediaInserter, setShowMediaInserter] = useState(false);
  const [showAdvancedToolbar, setShowAdvancedToolbar] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        codeBlock: false,
        underline: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Superscript,
      Subscript,
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CollapsibleSection,
      Hashtag,
      NoteLink.configure({
        onNoteLinkClick: (noteTitle) => {
          // Handle note link clicks - this could open the linked note
          console.log('Note link clicked:', noteTitle);
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none',
      },
    },
  });

  // Sync external content changes with the editor
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const setTextAlign = useCallback((alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor?.chain().focus().setTextAlign(alignment).run();
  }, [editor]);

  const toggleHighlight = useCallback(() => {
    editor?.chain().focus().toggleHighlight().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const toggleTaskList = useCallback(() => {
    editor?.chain().focus().toggleTaskList().run();
  }, [editor]);

  const handleInsertImage = useCallback((src: string, alt?: string) => {
    editor?.chain().focus().setImage({ src, alt }).run();
  }, [editor]);

  const handleInsertLink = useCallback((url: string, text?: string) => {
    if (text) {
      editor?.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleInsertFile = useCallback((file: File) => {
    // For now, we'll just insert a placeholder. In a real implementation,
    // you'd upload the file and insert a link or embed
    const fileName = file.name;
    editor?.chain().focus().insertContent(`<p><em>📎 ${fileName}</em></p>`).run();
  }, [editor]);

  // Extract hashtags from content and return them as an array
  const extractHashtags = useCallback((htmlContent: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;

    while ((match = hashtagRegex.exec(htmlContent)) !== null) {
      hashtags.push(match[1]);
    }

    return [...new Set(hashtags)]; // Remove duplicates
  }, []);

  // Update parent component with hashtags when content changes
  const handleContentChange = useCallback((content: string) => {
    onChange(content);

    // Extract hashtags and pass them to parent if callback exists
    const hashtags = extractHashtags(content);
    if (window.updateNoteTags) {
      window.updateNoteTags(hashtags);
    }
  }, [onChange]);

  const addCollapsibleSection = useCallback(() => {
    editor?.chain().focus().insertContent({
      type: 'collapsibleSection',
      attrs: { summary: 'New Section', open: true },
      content: [{ type: 'paragraph' }],
    }).run();
  }, [editor]);

  const setHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  const undo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const redo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    editor?.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  }, [editor]);

  const setHighlightColor = useCallback((color: string) => {
    editor?.chain().focus().setHighlight({ color }).run();
    setShowBgColorPicker(false);
  }, [editor]);

  const toggleSuperscript = useCallback(() => {
    editor?.chain().focus().toggleSuperscript().run();
  }, [editor]);

  const toggleSubscript = useCallback(() => {
    editor?.chain().focus().toggleSubscript().run();
  }, [editor]);

  if (isMarkdownMode) {
    return (
      <div>
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setIsMarkdownMode(false)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Rich Text Mode
          </button>
        </div>
        <MarkdownEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <button
          onClick={() => setIsMarkdownMode(true)}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
        >
          📝 Markdown Mode
        </button>
        <button
          onClick={() => setShowAdvancedToolbar(!showAdvancedToolbar)}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
        >
          {showAdvancedToolbar ? '◀ Simple' : '▶ Advanced'}
        </button>
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Enhanced Toolbar */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
          {/* Main Toolbar */}
          <div className="p-2 flex flex-wrap gap-1 items-center">
            {/* Undo/Redo */}
            <div className="flex gap-1 mr-2">
              <button
                onClick={undo}
                disabled={!editor.can().undo()}
                className={`p-2 rounded text-sm font-medium transition-all ${
                  !editor.can().undo() 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="Undo (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                onClick={redo}
                disabled={!editor.can().redo()}
                className={`p-2 rounded text-sm font-medium transition-all ${
                  !editor.can().redo() 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="Redo (Ctrl+Y)"
              >
                ↷
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* Headings Dropdown */}
            <select
              onChange={(e) => {
                const level = e.target.value;
                if (level === 'p') {
                  editor.chain().focus().setParagraph().run();
                } else {
                  setHeading(parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6);
                }
              }}
              value={
                editor.isActive('heading', { level: 1 }) ? '1' :
                editor.isActive('heading', { level: 2 }) ? '2' :
                editor.isActive('heading', { level: 3 }) ? '3' :
                editor.isActive('heading', { level: 4 }) ? '4' :
                editor.isActive('heading', { level: 5 }) ? '5' :
                editor.isActive('heading', { level: 6 }) ? '6' : 'p'
              }
              className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              title="Text Style"
            >
              <option value="p">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text Formatting */}
            <button
              onClick={toggleBold}
              className={`px-3 py-1.5 rounded text-sm font-bold transition-all ${
                editor.isActive('bold') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button
              onClick={toggleItalic}
              className={`px-3 py-1.5 rounded text-sm italic font-medium transition-all ${
                editor.isActive('italic') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              onClick={toggleUnderline}
              className={`px-3 py-1.5 rounded text-sm font-medium underline transition-all ${
                editor.isActive('underline') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Underline (Ctrl+U)"
            >
              U
            </button>
            <button
              onClick={toggleStrike}
              className={`px-3 py-1.5 rounded text-sm font-medium line-through transition-all ${
                editor.isActive('strike') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Strikethrough"
            >
              S
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text Color */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all flex items-center gap-1"
                title="Text Color"
              >
                <span style={{ color: editor.getAttributes('textStyle').color || '#000000' }}>A</span>
                <span className="text-xs">▼</span>
              </button>
              {showColorPicker && (
                <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    {['#000000', '#374151', '#6B7280', '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D',
                      '#16A34A', '#059669', '#0D9488', '#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
                      '#9333EA', '#C026D3', '#DB2777', '#E11D48'].map(color => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Reset Color
                  </button>
                </div>
              )}
            </div>

            {/* Highlight Color */}
            <div className="relative">
              <button
                onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all"
                title="Highlight Color"
              >
                🖍️
              </button>
              {showBgColorPicker && (
                <div className="absolute z-10 mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    {['#FEF3C7', '#FDE68A', '#FCD34D', '#FCA5A5', '#FBBF24', '#FB923C', '#F87171', '#EF4444',
                      '#BBF7D0', '#86EFAC', '#4ADE80', '#BFDBFE', '#93C5FD', '#60A5FA', '#DDD6FE', '#C4B5FD',
                      '#A78BFA', '#F9A8D4', '#F472B6', '#EC4899'].map(color => (
                      <button
                        key={color}
                        onClick={() => setHighlightColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowBgColorPicker(false);
                    }}
                    className="w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Remove Highlight
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
              onClick={toggleBulletList}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive('bulletList') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Bullet List"
            >
              •
            </button>
            <button
              onClick={toggleOrderedList}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive('orderedList') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Numbered List"
            >
              1.
            </button>
            <button
              onClick={toggleTaskList}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive('taskList') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Task List"
            >
              ☑
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text Alignment */}
            <button
              onClick={() => setTextAlign('left')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive({ textAlign: 'left' }) 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Align Left"
            >
              ≡
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive({ textAlign: 'center' }) 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Align Center"
            >
              ≣
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive({ textAlign: 'right' }) 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Align Right"
            >
              ≢
            </button>
            <button
              onClick={() => setTextAlign('justify')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive({ textAlign: 'justify' }) 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Justify"
            >
              ≡
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Insert Elements */}
            <button
              onClick={setLink}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive('link') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Insert Link"
            >
              🔗
            </button>
            <button
              onClick={() => setShowMediaInserter(true)}
              className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all"
              title="Insert Media"
            >
              🖼️
            </button>
            <button
              onClick={toggleBlockquote}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive('blockquote') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Quote"
            >
              "
            </button>
            <button
              onClick={toggleCodeBlock}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                editor.isActive('codeBlock') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title="Code Block"
            >
              &lt;/&gt;
            </button>
            <button
              onClick={addTable}
              className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all"
              title="Insert Table"
            >
              ⊞
            </button>
            <button
              onClick={addCollapsibleSection}
              className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all"
              title="Collapsible Section"
            >
              📁
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Clear Formatting */}
            <button
              onClick={clearFormatting}
              className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
              title="Clear Formatting"
            >
              🧹
            </button>
          </div>

          {/* Advanced Toolbar */}
          {showAdvancedToolbar && (
            <div className="px-2 pb-2 flex flex-wrap gap-1 items-center border-t border-gray-200 pt-2">
              <span className="text-xs text-gray-500 font-medium mr-2">Advanced:</span>
              
              <button
                onClick={toggleSuperscript}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  editor.isActive('superscript') 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
                title="Superscript"
              >
                X<sup>2</sup>
              </button>
              <button
                onClick={toggleSubscript}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  editor.isActive('subscript') 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
                title="Subscript"
              >
                X<sub>2</sub>
              </button>

              <div className="w-px h-5 bg-gray-300 mx-1"></div>

              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all"
                title="Horizontal Line"
              >
                ―
              </button>
              <button
                onClick={() => editor.chain().focus().setHardBreak().run()}
                className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-700 hover:bg-blue-50 transition-all"
                title="Line Break"
              >
                ↵
              </button>
            </div>
          )}
        </div>

        {/* Note Properties Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Notebook:</label>
            <select
              value={notebookId || 'general'}
              onChange={(e) => onNotebookChange?.(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
            >
              {notebooks.map(notebook => (
                <option key={notebook.id} value={notebook.id}>
                  {notebook.icon} {notebook.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Tags:</label>
            <input
              type="text"
              value={tags?.join(', ') || ''}
              onChange={(e) => {
                const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                onTagsChange?.(newTags);
              }}
              placeholder="Add tags..."
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 min-w-[150px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Due Date:</label>
            <input
              type="date"
              value={dueDate || ''}
              onChange={(e) => onDueDateChange?.(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="completed-toolbar"
              checked={completed || false}
              onChange={(e) => onCompletedChange?.(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="completed-toolbar" className="text-sm font-medium text-gray-700">Completed</label>
          </div>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} className="min-h-[300px] bg-white" />
      </div>

      {/* Media Inserter Modal */}
      {showMediaInserter && (
        <MediaInserter
          isOpen={showMediaInserter}
          onInsertImage={handleInsertImage}
          onInsertLink={handleInsertLink}
          onInsertFile={handleInsertFile}
          onClose={() => setShowMediaInserter(false)}
        />
      )}
    </div>
  );
};

export default RichTextEditor;