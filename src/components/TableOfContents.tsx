'use client';

import { useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  editor: ReturnType<typeof useEditor>;
}

const TableOfContents = ({ editor }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!editor) return;

    const updateToc = () => {
      const headings: TocItem[] = [];
      const doc = editor.state.doc;

      doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const level = node.attrs.level;
          const text = node.textContent;
          const id = `heading-${pos}`;

          headings.push({
            id,
            text,
            level,
          });
        }
      });

      setTocItems(headings);
    };

    updateToc();

    editor.on('update', updateToc);

    return () => {
      editor.off('update', updateToc);
    };
  }, [editor]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="toc bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">Table of Contents</h3>
      <ul className="space-y-1">
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer hover:text-blue-600 ${
              item.level === 1 ? 'font-medium' :
              item.level === 2 ? 'ml-4' :
              item.level === 3 ? 'ml-8' : 'ml-12'
            }`}
            onClick={() => scrollToHeading(item.id)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { TableOfContents };