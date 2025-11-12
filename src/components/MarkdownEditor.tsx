'use client';

import MDEditor, { commands } from '@uiw/react-md-editor';
import { useState } from 'react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MarkdownEditor = ({ content, onChange, placeholder = "Start writing in Markdown..." }: MarkdownEditorProps) => {
  const [value, setValue] = useState(content);

  const handleChange = (val?: string) => {
    const newValue = val || '';
    setValue(newValue);
    onChange(newValue);
  };

  // Enhanced toolbar with more commands
  const customCommands = [
    commands.group([
      commands.title1,
      commands.title2,
      commands.title3,
      commands.title4,
      commands.title5,
      commands.title6,
    ], {
      name: 'title',
      groupName: 'title',
      buttonProps: { 'aria-label': 'Insert title' }
    }),
    commands.divider,
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.divider,
    commands.hr,
    commands.divider,
    commands.group([commands.link, commands.quote, commands.code, commands.image], {
      name: 'insert',
      groupName: 'Insert',
      buttonProps: { 'aria-label': 'Insert' }
    }),
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.divider,
    commands.codeBlock,
    commands.table,
    commands.divider,
    commands.help,
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="live"
        hideToolbar={false}
        visibleDragbar={true}
        data-color-mode="light"
        textareaProps={{
          placeholder,
        }}
        height={500}
        commands={customCommands}
        extraCommands={[
          commands.codeEdit,
          commands.codeLive,
          commands.codePreview,
          commands.fullscreen,
        ]}
        style={{
          fontFamily: 'var(--editor-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          fontSize: 'var(--editor-font-size, 16px)',
        }}
      />
    </div>
  );
};

export default MarkdownEditor;