'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CollapsibleSectionComponent } from './CollapsibleSectionComponent';

export const CollapsibleSection = Node.create({
  name: 'collapsibleSection',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      summary: {
        default: 'Collapsible Section',
      },
      open: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'details',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CollapsibleSectionComponent);
  },

  addCommands() {
    return {
      setCollapsibleSection:
        (attributes: { summary?: string; open?: boolean }) =>
        ({ commands }: any) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCollapsibleSection:
        () =>
        ({ commands }: any) => {
          return commands.updateAttributes(this.name, (attributes: any) => ({
            open: !attributes.open,
          }));
        },
    } as any;
  },
});