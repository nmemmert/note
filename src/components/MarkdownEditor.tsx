'use client';

import MDEditor from '@uiw/react-md-editor';
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

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        data-color-mode="light"
        textareaProps={{
          placeholder,
        }}
        height={400}
      />
    </div>
  );
};

export default MarkdownEditor;