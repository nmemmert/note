'use client';

import { useState } from 'react';

interface ImportedNote {
  title: string;
  content: string;
  tags: string[];
  notebook?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UpNoteImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (notes: ImportedNote[]) => void;
}

const UpNoteImporter = ({ isOpen, onClose, onImport }: UpNoteImporterProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setImporting(true);
    setImportResults(null);

    const allImportedNotes: ImportedNote[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const notes = await parseFile(file);
        allImportedNotes.push(...notes);
      } catch (error) {
        errors.push(`Error processing ${file.name}: ${error}`);
      }
    }

    setImportResults({
      success: allImportedNotes.length,
      errors
    });

    if (allImportedNotes.length > 0) {
      onImport(allImportedNotes);
    }

    setImporting(false);
  };

  const parseFile = async (file: File): Promise<ImportedNote[]> => {
    const fileName = file.name.toLowerCase();
    const text = await file.text();

    if (fileName.endsWith('.json')) {
      return parseUpNoteJSON(text);
    } else if (fileName.endsWith('.md') || fileName.endsWith('.markdown')) {
      return parseMarkdown(text, file.name);
    } else if (fileName.endsWith('.enex')) {
      return parseENEX(text);
    } else if (fileName.endsWith('.txt')) {
      return parsePlainText(text, file.name);
    } else {
      throw new Error(`Unsupported file format: ${fileName}`);
    }
  };

  const parseUpNoteJSON = (jsonText: string): ImportedNote[] => {
    try {
      const data = JSON.parse(jsonText);
      
      // Handle different UpNote export formats
      if (data.notes && Array.isArray(data.notes)) {
        return data.notes.map((note: any) => ({
          title: note.title || note.name || 'Untitled',
          content: note.content || note.body || note.text || '',
          tags: note.tags || note.labels || [],
          notebook: note.notebook || note.category || note.folder,
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
          updatedAt: note.updatedAt || note.modifiedAt ? new Date(note.updatedAt || note.modifiedAt) : new Date(),
        }));
      } else if (Array.isArray(data)) {
        return data.map((note: any) => ({
          title: note.title || note.name || 'Untitled',
          content: note.content || note.body || note.text || '',
          tags: note.tags || note.labels || [],
          notebook: note.notebook || note.category || note.folder,
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
          updatedAt: note.updatedAt || note.modifiedAt ? new Date(note.updatedAt || note.modifiedAt) : new Date(),
        }));
      } else if (data.title || data.content) {
        // Single note
        return [{
          title: data.title || 'Untitled',
          content: data.content || data.body || data.text || '',
          tags: data.tags || data.labels || [],
          notebook: data.notebook || data.category || data.folder,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt || data.modifiedAt ? new Date(data.updatedAt || data.modifiedAt) : new Date(),
        }];
      }
      
      throw new Error('Unrecognized JSON format');
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const parseMarkdown = (markdown: string, fileName: string): ImportedNote[] => {
    const title = fileName.replace(/\.(md|markdown)$/i, '');
    
    // Extract frontmatter if present
    const frontmatterRegex = /^---\s*[\r\n]([\s\S]*?)[\r\n]---\s*[\r\n]([\s\S]*)$/;
    const frontmatterMatch = markdown.match(frontmatterRegex);
    
    let content = markdown;
    let tags: string[] = [];
    let notebook: string | undefined;
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      content = frontmatterMatch[2];
      
      // Parse YAML-like frontmatter
      const tagMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      if (tagMatch) {
        tags = tagMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
      }
      
      const notebookMatch = frontmatter.match(/notebook:\s*['"]?(.*?)['"]?$/m);
      if (notebookMatch) {
        notebook = notebookMatch[1];
      }
    }
    
    // Convert markdown to HTML for the editor
    content = convertMarkdownToHTML(content);
    
    return [{
      title,
      content,
      tags,
      notebook,
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
  };

  const parseENEX = (enexText: string): ImportedNote[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(enexText, 'text/xml');
    const notes = xmlDoc.getElementsByTagName('note');
    
    const importedNotes: ImportedNote[] = [];
    
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const title = note.getElementsByTagName('title')[0]?.textContent || 'Untitled';
      const content = note.getElementsByTagName('content')[0]?.textContent || '';
      const created = note.getElementsByTagName('created')[0]?.textContent;
      const updated = note.getElementsByTagName('updated')[0]?.textContent;
      
      // Extract tags
      const tagElements = note.getElementsByTagName('tag');
      const tags: string[] = [];
      for (let j = 0; j < tagElements.length; j++) {
        if (tagElements[j].textContent) {
          tags.push(tagElements[j].textContent);
        }
      }
      
      // Convert ENEX content to HTML
      const htmlContent = convertENEXToHTML(content);
      
      importedNotes.push({
        title,
        content: htmlContent,
        tags,
        createdAt: created ? new Date(created) : new Date(),
        updatedAt: updated ? new Date(updated) : new Date(),
      });
    }
    
    return importedNotes;
  };

  const parsePlainText = (text: string, fileName: string): ImportedNote[] => {
    const title = fileName.replace(/\.txt$/i, '');
    const content = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    
    return [{
      title,
      content,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
  };

  const convertMarkdownToHTML = (markdown: string): string => {
    // Basic markdown to HTML conversion
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/<br><br>/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  const convertENEXToHTML = (enexContent: string): string => {
    // ENEX content is usually already in a form of HTML/XML
    // Clean up and convert to standard HTML
    return enexContent
      .replace(/<en-note>/g, '')
      .replace(/<\/en-note>/g, '')
      .replace(/<en-media[^>]*>/g, '<p><em>[Media content]</em></p>')
      .replace(/<\/en-media>/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Import from UpNote</h2>
        
        {!importing && !importResults && (
          <div>
            <p className="text-gray-600 mb-4">
              Import your notes from UpNote. Supported formats:
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>JSON export from UpNote</li>
              <li>Markdown files (.md)</li>
              <li>Evernote export (.enex)</li>
              <li>Plain text files (.txt)</li>
            </ul>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-gray-600 mb-2">
                📁 Drag and drop files here
              </div>
              <div className="text-sm text-gray-500 mb-4">or</div>
              <input
                type="file"
                multiple
                accept=".json,.md,.markdown,.enex,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
              >
                Choose Files
              </label>
            </div>
          </div>
        )}

        {importing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Importing notes...</p>
          </div>
        )}

        {importResults && (
          <div className="py-4">
            <div className="mb-4">
              <p className="text-green-600 font-medium">
                ✅ Successfully imported {importResults.success} notes
              </p>
              {importResults.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-600 font-medium">Errors:</p>
                  <ul className="text-sm text-red-500 list-disc list-inside">
                    {importResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {importResults ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpNoteImporter;