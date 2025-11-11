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

// Global function to update note tags
declare global {
  var updateNoteTags: ((tags: string[]) => void) | undefined;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [showMediaInserter, setShowMediaInserter] = useState(false);

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
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      CodeBlock,
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
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => setIsMarkdownMode(true)}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          Markdown Mode
        </button>
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <button
            onClick={toggleBold}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={toggleItalic}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            <em>I</em>
          </button>
          <button
            onClick={toggleUnderline}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            <u>U</u>
          </button>
          <button
            onClick={toggleStrike}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('strike') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            <s>S</s>
          </button>

          {/* Lists */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
          <button
            onClick={toggleBulletList}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            • List
          </button>
          <button
            onClick={toggleOrderedList}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            1. List
          </button>

          {/* Block Elements */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
          <button
            onClick={toggleBlockquote}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            &quot;
          </button>

          {/* Text Alignment */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
          <button
            onClick={() => setTextAlign('left')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            ⬅
          </button>
          <button
            onClick={() => setTextAlign('center')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            ⬌
          </button>
          <button
            onClick={() => setTextAlign('right')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            ➡
          </button>

          {/* Highlight */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
          <button
            onClick={toggleHighlight}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('highlight') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            🖍️
          </button>

          {/* Code Block */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
          <button
            onClick={toggleCodeBlock}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('codeBlock') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            &lt;/&gt;
          </button>

          {/* Table */}
          <button
            onClick={addTable}
            className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
          >
            📊
          </button>

          {/* Task List */}
          <button
            onClick={toggleTaskList}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('taskList') ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            ☑️
          </button>

          {/* Collapsible Section */}
          <button
            onClick={addCollapsibleSection}
            className="px-3 py-1 rounded text-sm font-medium bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
          >
            📁
          </button>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} className="min-h-[300px] bg-white" />
      </div>
    </div>
  );
};

export default RichTextEditor;