// Export utilities for notes

export type ExportFormat = 'markdown' | 'html' | 'json' | 'txt';

export const exportNote = (note: any, format: ExportFormat): string => {
  const { title, content, tags, category, createdAt, updatedAt } = note;

  switch (format) {
    case 'markdown':
      return generateMarkdown(title, content, tags, category, createdAt, updatedAt);

    case 'html':
      return generateHTML(title, content, tags, category, createdAt, updatedAt);

    case 'json':
      return JSON.stringify({
        title,
        content,
        tags,
        category,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      }, null, 2);

    case 'txt':
      return generatePlainText(title, content, tags, category, createdAt, updatedAt);

    default:
      return content;
  }
};

const generateMarkdown = (title: string, content: string, tags: string[], category: string, createdAt: Date, updatedAt: Date): string => {
  let markdown = `# ${title}\n\n`;

  if (category) {
    markdown += `**Category:** ${category}\n\n`;
  }

  if (tags.length > 0) {
    markdown += `**Tags:** ${tags.join(', ')}\n\n`;
  }

  markdown += `**Created:** ${createdAt.toLocaleString()}\n`;
  markdown += `**Updated:** ${updatedAt.toLocaleString()}\n\n`;

  markdown += '---\n\n';

  // Convert HTML to Markdown (basic conversion)
  let convertedContent = content
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>')
    .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
      let counter = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
    })
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags

  markdown += convertedContent;

  return markdown;
};

const generateHTML = (title: string, content: string, tags: string[], category: string, createdAt: Date, updatedAt: Date): string => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .metadata { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="metadata">
        ${category ? `<p><strong>Category:</strong> ${category}</p>` : ''}
        ${tags.length > 0 ? `<p><strong>Tags:</strong> ${tags.join(', ')}</p>` : ''}
        <p><strong>Created:</strong> ${createdAt.toLocaleString()}</p>
        <p><strong>Updated:</strong> ${updatedAt.toLocaleString()}</p>
    </div>
    ${content}
</body>
</html>`;
};

const generatePlainText = (title: string, content: string, tags: string[], category: string, createdAt: Date, updatedAt: Date): string => {
  let text = `${title}\n${'='.repeat(title.length)}\n\n`;

  if (category) {
    text += `Category: ${category}\n\n`;
  }

  if (tags.length > 0) {
    text += `Tags: ${tags.join(', ')}\n\n`;
  }

  text += `Created: ${createdAt.toLocaleString()}\n`;
  text += `Updated: ${updatedAt.toLocaleString()}\n\n`;

  text += '-'.repeat(50) + '\n\n';

  // Strip HTML tags for plain text
  const plainContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  text += plainContent;

  return text;
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateShareableLink = (note: any): string => {
  // In a real app, this would create a unique shareable URL
  // For now, we'll create a data URL with the note content
  const noteData = {
    title: note.title,
    content: note.content,
    tags: note.tags,
    category: note.category,
    sharedAt: new Date().toISOString(),
  };

  const encodedData = btoa(JSON.stringify(noteData));
  return `${window.location.origin}/shared/${encodedData}`;
};