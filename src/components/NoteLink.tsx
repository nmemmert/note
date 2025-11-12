'use client';

import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

interface NoteLinkOptions {
  onNoteLinkClick?: (noteTitle: string) => void;
}

const NoteLink = Extension.create<NoteLinkOptions>({
  name: 'noteLink',

  addOptions() {
    return {
      onNoteLinkClick: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || '';
                const regex = /\[\[([^\]]+)\]\]/g;
                let match;

                while ((match = regex.exec(text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  const noteTitle = match[1];

                  decorations.push(
                    Decoration.inline(start, end, {
                      class: 'note-link bg-blue-100 text-blue-800 px-1 py-0.5 rounded cursor-pointer hover:bg-blue-200',
                      'data-note-title': noteTitle,
                    })
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
          handleClick: (view, pos, event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('note-link')) {
              const noteTitle = target.getAttribute('data-note-title');
              if (noteTitle && this.options.onNoteLinkClick) {
                this.options.onNoteLinkClick(noteTitle);
                return true;
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});

export { NoteLink };