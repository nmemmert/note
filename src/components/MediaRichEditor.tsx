'use client';

import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { useState, useEffect } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';

interface MediaRichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Custom command for inserting video embeds
const videoCommand: ICommand = {
  name: 'video',
  keyCommand: 'video',
  buttonProps: { 'aria-label': 'Insert video', title: 'Insert video (YouTube, Vimeo)' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
  ),
  execute: (state, api) => {
    const url = prompt('Enter YouTube or Vimeo URL:');
    if (url) {
      let embedCode = '';
      
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('/').pop()?.split('?')[0]
          : new URL(url).searchParams.get('v');
        embedCode = `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
      }
      // Vimeo
      else if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        embedCode = `\n<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>\n`;
      }
      
      api.replaceSelection(embedCode);
    }
  },
};

// Custom command for LaTeX math
const mathCommand: ICommand = {
  name: 'math',
  keyCommand: 'math',
  buttonProps: { 'aria-label': 'Insert math', title: 'Insert LaTeX math' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <text x="2" y="18" fontSize="16" fontFamily="serif">∑</text>
    </svg>
  ),
  execute: (state, api) => {
    const inline = confirm('Inline math? (Cancel for block math)');
    if (inline) {
      api.replaceSelection('$E = mc^2$');
    } else {
      api.replaceSelection('\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n');
    }
  },
};

// Custom command for Mermaid diagrams
const mermaidCommand: ICommand = {
  name: 'mermaid',
  keyCommand: 'mermaid',
  buttonProps: { 'aria-label': 'Insert diagram', title: 'Insert Mermaid diagram' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  ),
  execute: (state, api) => {
    const diagramType = prompt('Diagram type: flowchart, sequence, gantt, pie, class, state, er (default: flowchart)') || 'flowchart';
    let template = '';
    
    switch(diagramType) {
      case 'flowchart':
        template = '```mermaid\nflowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E\n```\n';
        break;
      case 'sequence':
        template = '```mermaid\nsequenceDiagram\n    participant A as Alice\n    participant B as Bob\n    A->>B: Hello Bob!\n    B->>A: Hello Alice!\n```\n';
        break;
      case 'gantt':
        template = '```mermaid\ngantt\n    title Project Schedule\n    dateFormat YYYY-MM-DD\n    section Phase 1\n    Task 1: 2024-01-01, 30d\n    Task 2: after Task 1, 20d\n```\n';
        break;
      case 'pie':
        template = '```mermaid\npie title Pets adopted by volunteers\n    "Dogs" : 386\n    "Cats" : 85\n    "Rats" : 15\n```\n';
        break;
      default:
        template = '```mermaid\nflowchart LR\n    A --> B\n    B --> C\n```\n';
    }
    
    api.replaceSelection('\n' + template + '\n');
  },
};

export default function MediaRichEditor({ content, onChange, placeholder = "Start writing..." }: MediaRichEditorProps) {
  const [value, setValue] = useState(content);

  useEffect(() => {
    setValue(content);
  }, [content]);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  const handleChange = (val?: string) => {
    const newValue = val || '';
    setValue(newValue);
    onChange(newValue);
  };

  // Custom toolbar with media commands
  const customCommands = [
    commands.group([
      commands.title1,
      commands.title2,
      commands.title3,
      commands.title4,
    ], {
      name: 'title',
      groupName: 'Headings',
      buttonProps: { 'aria-label': 'Insert title' }
    }),
    commands.divider,
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.image,
    videoCommand,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.divider,
    commands.table,
    commands.divider,
    mathCommand,
    mermaidCommand,
    commands.divider,
    commands.codeEdit,
    commands.codeLive,
    commands.codePreview,
    commands.divider,
    commands.fullscreen,
  ];

  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={handleChange}
        commands={customCommands}
        preview="live"
        height={600}
        visibleDragbar={false}
        highlightEnable={true}
        previewOptions={{
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
          components: {
            code: ({ inline, className, children, ...props }: any) => {
              const match = /language-mermaid/.exec(className || '');
              if (!inline && match) {
                return (
                  <div className="mermaid">
                    {String(children).replace(/\n$/, '')}
                  </div>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          },
        }}
        textareaProps={{
          placeholder: placeholder,
        }}
      />
      <style jsx global>{`
        .mermaid {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }
      `}</style>
    </div>
  );
}
