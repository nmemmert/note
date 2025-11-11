'use client';

import { useState, useEffect } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';

export const CollapsibleSectionComponent = ({
  node,
  updateAttributes,
}: NodeViewProps) => {
  const [isOpen, setIsOpen] = useState((node.attrs as any).open ?? true);
  const [summary, setSummary] = useState(
    (node.attrs as any).summary ?? 'Collapsible Section'
  );

  useEffect(() => {
    setIsOpen((node.attrs as any).open ?? true);
  }, [(node.attrs as any).open]);

  useEffect(() => {
    setSummary((node.attrs as any).summary ?? 'Collapsible Section');
  }, [(node.attrs as any).summary]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    updateAttributes({ open: newOpen });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSummary = e.target.value;
    setSummary(newSummary);
    updateAttributes({ summary: newSummary });
  };

  return (
    <NodeViewWrapper>
      <details open={isOpen} className="border border-gray-300 dark:border-gray-600 rounded-lg my-2">
        <summary
          onClick={(e) => {
            e.preventDefault();
            handleToggle();
          }}
          className="cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg flex items-center"
        >
          <span className="mr-2 text-lg">{isOpen ? '▼' : '▶'}</span>
          <input
            type="text"
            value={summary}
            onChange={handleSummaryChange}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-medium"
            placeholder="Section title..."
          />
        </summary>
        <div className="p-3 border-t border-gray-200 dark:border-gray-600">
          <NodeViewContent />
        </div>
      </details>
    </NodeViewWrapper>
  );
};