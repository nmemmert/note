# NoteMaster - Better Than UpNote

A modern, powerful note-taking application built with Next.js, TypeScript, and Tailwind CSS. Designed to be better than UpNote with rich text editing, markdown support, cloud synchronization, and dark mode.

## Features

- ✨ **Rich Text Editing** - Full-featured WYSIWYG editor with formatting toolbar (bold, italic, underline, lists, alignment, highlighting)
- 📝 **Markdown Support** - Toggle between rich text and markdown editing modes
- 🏷️ **Tags & Categories** - Organize notes with tags and categories
- ☁️ **Cloud Synchronization** - Sync notes between devices with server-side storage
- 🌙 **Dark Mode** - Beautiful dark theme with automatic system preference detection
- 🔍 **Powerful Search** - Search through note titles and content instantly
- 💾 **Local & Cloud Storage** - Notes saved locally and synchronized to cloud
- 📱 **Responsive Design** - Works great on desktop and mobile devices
- ⚡ **Fast & Lightweight** - Built with Next.js for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd note
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating and Editing Notes

- **Create Notes**: Click the "+ New Note" button to create a new note
- **Rich Text Editing**: Use the formatting toolbar for bold, italic, lists, etc.
- **Markdown Mode**: Toggle to markdown editing for code-friendly writing
- **Categories & Tags**: Organize notes with categories and comma-separated tags

### Organization Features

- **Categories**: Choose from predefined categories (General, Work, Personal, etc.)
- **Tags**: Add multiple tags to notes for flexible organization
- **Search**: Find notes by title, content, or tags
- **Filtering**: Filter notes by category or tag

### Themes & Sync

- **Dark Mode**: Toggle between light and dark themes
- **Auto Theme**: Automatically detects system preference
- **Cloud Sync**: Notes are synchronized to the server for cross-device access

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Tiptap
- **Markdown Editor**: @uiw/react-md-editor
- **Database**: SQLite (development) / PostgreSQL (production)
- **State Management**: React Hooks
- **API**: Next.js API Routes

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes for cloud sync
│   │   ├── notes/          # CRUD operations for notes
│   │   ├── sync/           # Synchronization endpoint
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main note-taking interface
│   └── globals.css         # Global styles with dark mode
├── components/
│   ├── RichTextEditor.tsx  # WYSIWYG editor component
│   ├── MarkdownEditor.tsx  # Markdown editor component
│   └── ThemeProvider.tsx   # Theme context provider
└── lib/
    └── noteStorage.ts      # Database storage layer
```

## API Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get a specific note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note
- `POST /api/sync` - Synchronize notes between client and server

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

This project uses ESLint for code quality. Make sure to run `npm run lint` before committing changes.

## Database

The application uses SQLite for development and can be easily upgraded to PostgreSQL for production. The database schema includes:

- `notes` table with fields: id, title, content, tags (JSON), category, created_at, updated_at

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Note sharing and permissions
- [ ] Advanced search with filters
- [ ] Note templates
- [ ] Export to PDF/Markdown
- [ ] Mobile app companion
- [ ] Plugin system for extensions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Rich text editing powered by [Tiptap](https://tiptap.dev)
- Markdown editing with [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor)
- Styled with [Tailwind CSS](https://tailwindcss.com)
