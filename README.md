# NoteMaster - Better Than UpNote

A modern, powerful note-taking application built with Next.js, TypeScript, and Tailwind CSS. Designed to be better than UpNote with rich text editing, AI-powered features, multi-user authentication, and 6 beautiful themes.

## ✨ Features

### Core Features
- ✨ **Rich Text Editing** - Full-featured WYSIWYG editor with advanced formatting
- 📝 **Markdown Support** - Toggle between rich text and markdown editing
- 🔐 **User Authentication** - Secure login/signup with NextAuth.js
- 🗂️ **Nested Notebooks** - Organize notes in hierarchical folders
- 🏷️ **Smart Tags** - Auto-suggested tags based on content
- 🔍 **Powerful Search** - Search through titles, content, and tags
- 🎨 **6 Beautiful Themes** - Light, Dark, Nord, Solarized, Dracula, Monokai
- 📱 **Responsive Design** - Works great on desktop and mobile

### Smart AI Features
- 🤖 **Auto-Summary** - AI-generated summaries of your notes
- 💡 **Writing Suggestions** - Real-time readability analysis
- 🔗 **Related Notes** - Automatically find connected notes
- 📊 **Text Analysis** - Word count, reading time, complexity scores

### Organization & Productivity
- 📚 **Templates Library** - 12 pre-built templates (Meeting Notes, Journal, etc.)
- � **Smart Folders** - Auto-organize by tags, dates, and categories
- ⭐ **Favorites & Archive** - Quick access to important notes
- ⏱️ **Pomodoro Timer** - Built-in focus timer
- ⌨️ **Command Palette** - Quick actions with Ctrl+P
- � **Reading Mode** - Distraction-free reading
- 📅 **Daily Notes** - Quick-capture daily thoughts

### Help & Documentation
- ❓ **In-App Help Center** - 20+ articles with search (Press '?')
- ⌨️ **Keyboard Shortcuts** - Comprehensive shortcut reference
- � **Feature Guides** - Step-by-step tutorials

## 🚀 Quick Start

### Option 1: One-Command Installation (Ubuntu/Debian) - Recommended

Perfect for self-hosting on your own hardware!

```bash
# Download and run installer
git clone https://github.com/nmemmert/note.git
cd note
chmod +x install.sh && ./install.sh
```

**That's it!** The installer will:
- ✅ Install Node.js, PostgreSQL, PM2, Nginx
- ✅ Set up the database with secure passwords
- ✅ Build and start the application
- ✅ Configure reverse proxy and firewall
- ✅ Automatically detect and use available ports
- ✅ Create backup scripts

Access at: `http://localhost:3000` or `http://YOUR_SERVER_IP`

📖 **Full guide**: See [INSTALL.md](INSTALL.md)

### Option 2: Development Setup

For local development:

```bash
# Clone repository
git clone https://github.com/nmemmert/note.git
cd note

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 3: Docker Deployment

For containerized deployment:

```bash
# Using Docker Compose
docker-compose up -d
```

📖 **Full guide**: See [DOCKER.md](DOCKER.md)

## 📦 Deployment Options

NoteMaster can be deployed in multiple ways:

| Method | Best For | Difficulty | Cost |
|--------|----------|------------|------|
| **[One-Command Install](INSTALL.md)** | Self-hosting on your hardware | ⭐ Easy | Free (electricity only) |
| **[Docker](DOCKER.md)** | Containerized deployment | ⭐⭐ Moderate | Varies |
| **Vercel + Supabase** | Quick cloud deployment | ⭐ Easy | Free tier available |
| **Railway** | All-in-one platform | ⭐ Easy | ~$10/month |

### Recommended: Self-Hosting with install.sh

If you have your own hardware (PC, server, Raspberry Pi), use the automated installer:

```bash
chmod +x install.sh && ./install.sh
```

**Features:**
- 🔧 Automatic port detection (uses different port if 3000 is taken)
- 🔒 Secure random password generation
- 🔄 Process management with PM2 (auto-restart)
- 🌐 Nginx reverse proxy (professional setup)
- 💾 Automatic backup script creation
- 🛡️ Firewall configuration

See [INSTALL.md](INSTALL.md) for complete documentation.

## 🔄 Updating

Keep NoteMaster up to date with the automated update script:

```bash
cd ~/notemaster
./update.sh
```

The update script automatically:
- ✅ Creates backup before updating
- ✅ Pulls latest changes
- ✅ Updates dependencies if needed
- ✅ Runs database migrations
- ✅ Rebuilds application
- ✅ Restarts with zero downtime
- ✅ Rolls back automatically if anything fails

📖 **Full guide**: See [UPDATE.md](UPDATE.md)

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

## 💻 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Tiptap with extensive extensions
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **AI/Text Analysis**: Custom TF-IDF implementation
- **Process Management**: PM2
- **Web Server**: Nginx (production)

## 📁 Project Structure

```
note/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── notes/        # Note CRUD operations
│   │   │   └── sync/         # Synchronization
│   │   ├── auth/             # Login/signup pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main note interface
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── RichTextEditor.tsx    # Main editor
│   │   ├── AutoSummary.tsx       # AI summary
│   │   ├── WritingSuggestions.tsx # Writing analysis
│   │   ├── RelatedNotes.tsx      # Note connections
│   │   ├── HelpCenter.tsx        # In-app help
│   │   └── [20+ other components]
│   └── lib/
│       ├── noteStorage.ts        # Database layer
│       ├── textAnalysis.ts       # TF-IDF analysis
│       └── helpContent.ts        # Help articles
├── prisma/
│   └── schema.prisma         # Database schema
├── install.sh                # One-command installer
├── update.sh                 # Automated updates
├── INSTALL.md               # Installation guide
├── UPDATE.md                # Update guide
├── DOCKER.md                # Docker deployment
└── TODO.md                  # Project roadmap
```

## 🔌 API Endpoints

### Notes
- `GET /api/notes` - Get all notes for current user
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get specific note
- `PATCH /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Create account
- `GET /api/auth/session` - Get current session
## 🛠️ Development

### Prerequisites

- Node.js 20+ and npm
- Git

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/nmemmert/note.git
cd note

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create new migration

### Code Quality

This project uses:
- **ESLint** - Code linting
- **TypeScript** - Type safety
- **Prettier** - Code formatting (configured in ESLint)

Run before committing:
```bash
npm run lint
```

## 💾 Database

### Development
- Uses **SQLite** for easy local development
- Database file: `prisma/dev.db`

### Production
- Uses **PostgreSQL** for reliability and performance
- Automatically configured by `install.sh`
- Migration handled by update script

### Schema
- **User** - Authentication and user data
- **Note** - Note content, metadata, tags
- **Notebook** - Hierarchical organization

View schema: `prisma/schema.prisma`

## 🔐 Environment Variables

Create `.env` file (for development):

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App
NODE_ENV="development"
```

For production, `install.sh` generates these automatically with secure values.

## 📚 Documentation

- **[INSTALL.md](INSTALL.md)** - Complete installation guide
- **[UPDATE.md](UPDATE.md)** - How to update NoteMaster
- **[DOCKER.md](DOCKER.md)** - Docker deployment guide
- **[TODO.md](TODO.md)** - Feature roadmap and progress
- **[In-App Help](?)** - Press `?` key in the app for help

## 🗺️ Roadmap

See [TODO.md](TODO.md) for the complete roadmap.

### ✅ Completed
- Core note-taking features
- User authentication
- Rich text editing
- AI-powered features
- Templates & smart folders
- Help center & documentation
- Deployment automation

### 🚧 In Progress
- Collaboration & sharing
- Advanced search
- Import/export

### 📋 Planned
- Media support (audio, video, diagrams)
- Mobile app
- Browser extension
- Advanced AI features

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test on both light and dark themes
- Ensure responsive design works
- Check all 6 themes render correctly

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Rich text editing powered by [Tiptap](https://tiptap.dev)
- Authentication with [NextAuth.js](https://next-auth.js.org)
- Database with [Prisma](https://www.prisma.io)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/nmemmert/note/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nmemmert/note/discussions)
- **In-App Help**: Press `?` key in the application

---

**Made with ❤️ by the NoteMaster team**
