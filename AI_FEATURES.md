# AI & Smart Features Documentation

## Overview
NoteMaster includes advanced AI-powered features that help you write better, find connections between your notes, and extract insights from your content automatically.

## Features Implemented

### 1. Related Notes Finder
**Technology**: TF-IDF (Term Frequency-Inverse Document Frequency) + Cosine Similarity

**What it does**:
- Analyzes the content of your current note
- Finds other notes with similar topics and themes
- Shows similarity percentage and common keywords
- Helps you discover connections in your knowledge base

**How it works**:
1. Tokenizes and cleans all note content (removes HTML, punctuation)
2. Filters out common stop words (the, and, is, etc.)
3. Calculates term frequency for each document
4. Computes inverse document frequency across all notes
5. Creates TF-IDF vectors for each note
6. Uses cosine similarity to compare vectors
7. Returns top 5 most similar notes

**Usage**:
- Automatically appears when you have multiple notes
- Shows only for notes with >100 characters
- Click any related note to open it
- Expandable panel to save screen space

**UI Elements**:
- Similarity percentage (visual bar and number)
- Common terms (up to 3 shown as tags)
- Note preview (truncated content)
- Purple theme with hover effects

---

### 2. Auto Summary
**Technology**: Extractive summarization using sentence scoring

**What it does**:
- Generates concise 3-sentence summaries of your notes
- Suggests relevant tags based on keyword frequency
- Helps you quickly understand note content at a glance

**How it works**:
1. Extracts sentences from the note content
2. Calculates word frequency across the document
3. Scores each sentence based on important word density
4. Selects top 3 most representative sentences
5. Maintains original sentence order in summary
6. Extracts keywords for tag suggestions

**Usage**:
- Appears for notes with >100 characters
- Click "Regenerate" to create a new summary
- Click suggested tags to add them instantly
- Summary adapts as you write

**Features**:
- Keyword-based tag suggestions (up to 5)
- Filters out tags you already have
- One-click tag addition
- Beautiful gradient indigo/purple UI

---

### 3. Writing Suggestions
**Technology**: Statistical text analysis + Readability metrics

**What it does**:
- Provides real-time writing statistics
- Offers suggestions to improve readability
- Gives feedback on writing style
- Estimates reading time

**Statistics Tracked**:
- Word count
- Reading time (based on 200 words/minute)
- Sentence count
- Paragraph count
- Average word length
- Average sentence length

**Suggestions**:
1. **Readability**: Warns if sentences are too long (>25 words average)
2. **Style**: Suggests breaking content into paragraphs
3. **Detail**: Encourages adding more content for short notes
4. **Voice**: Detects passive voice patterns and suggests active alternatives
5. **Positive Feedback**: Celebrates well-structured notes

**UI**:
- Color-coded statistic cards (blue, purple, green, orange)
- Gradient backgrounds for each metric
- Suggestion cards with icons (info, warning, success)
- Expandable panel

---

### 4. Smart Tag Suggestions (Enhanced)
**Technology**: Keyword extraction + Frequency analysis

**What it does**:
- Analyzes note content to suggest relevant tags
- Learns from your existing tag vocabulary
- Suggests tags as you write

**How it works**:
1. Extracts keywords from note content
2. Filters words by length (>3 characters)
3. Ranks by frequency
4. Excludes existing tags
5. Returns top 5 suggestions

**Features**:
- Hover to see add icon
- Click to instantly add tag
- Respects existing tags (no duplicates)
- Updates in real-time as you type

---

## Technical Implementation

### Text Analysis Library (`src/lib/textAnalysis.ts`)

#### Key Classes

**TFIDFAnalyzer**:
```typescript
class TFIDFAnalyzer {
  // Add documents for analysis
  addDocuments(docs: Array<{ id: string; text: string }>)
  
  // Find similar documents
  findSimilar(docId: string, topN: number): Array<{
    id: string;
    similarity: number;
    commonTerms: string[];
  }>
}
```

#### Key Functions

- `generateSummary(text: string, maxSentences: number): string`
- `extractKeywords(text: string, topN: number): string[]`
- `suggestTags(text: string, existingTags: string[]): string[]`
- `analyzeWriting(text: string): WritingStats`
- `getWritingSuggestions(text: string): WritingSuggestion[]`

---

## Components

### RelatedNotes.tsx
- Props: `currentNote`, `allNotes`, `onNoteSelect`
- Updates when note content changes
- Memoizes expensive calculations
- Expandable UI with animations

### AutoSummary.tsx
- Props: `content`, `currentTags`, `onAddTag`
- Regenerate button with loading state
- Tag suggestions with one-click add
- Gradient indigo/purple theme

### WritingSuggestions.tsx
- Props: `content`
- Real-time statistics calculation
- Debounced updates (500ms)
- Grid layout for stats
- Collapsible suggestion list

---

## Performance Considerations

1. **Lazy Loading**: Components only render when content exceeds thresholds
2. **Debouncing**: Text analysis runs with delays to avoid excessive calculations
3. **Memoization**: Results cached until content changes
4. **Efficient Algorithms**: O(n) for most operations, O(n²) only for similarity matrix
5. **Stop Words**: Reduces vocabulary size by ~30%
6. **Tokenization**: Regex-based for speed

---

## Future Enhancements

1. **Machine Learning**: Train models on user's writing style
2. **Advanced NLP**: Use transformers for better understanding
3. **Citation Detection**: Automatically create note links
4. **Sentiment Analysis**: Track emotional tone of notes
5. **Topic Modeling**: Automatic categorization
6. **Grammar Checking**: Integration with LanguageTool API
7. **Plagiarism Detection**: Check against external sources
8. **Voice to Text**: Transcription capabilities
9. **Mind Map Generation**: Visual representation of note connections
10. **Smart Search**: Semantic search using embeddings

---

## Usage Best Practices

### For Best Related Notes Results:
- Write detailed notes (200+ words)
- Use consistent terminology across notes
- Include specific keywords and concepts
- Avoid very short notes (<50 words)

### For Better Summaries:
- Write in clear sentences
- Include one main idea per paragraph
- Use specific, descriptive language
- Avoid excessive lists or bullet points

### For Helpful Writing Suggestions:
- Write at least 50 words to get meaningful analysis
- Break content into paragraphs
- Vary sentence length for readability
- Use active voice when possible

### For Accurate Tag Suggestions:
- Write focused, topic-specific content
- Use keywords naturally in your writing
- Review and refine suggested tags
- Build a consistent tag vocabulary

---

## Known Limitations

1. **Language**: Currently optimized for English only
2. **Code Blocks**: May interfere with text analysis
3. **HTML**: Stripped from analysis (only plain text analyzed)
4. **Very Short Notes**: Limited insights for <100 words
5. **Real-time**: Some delay on very large notes (>5000 words)
6. **Similarity**: Requires at least 2 notes to show related notes
7. **Stop Words**: Fixed list, not customizable yet

---

## Troubleshooting

**Problem**: Related notes not showing
- **Solution**: Ensure you have at least 2 notes with >100 characters each

**Problem**: Summary seems inaccurate
- **Solution**: Write in complete sentences, avoid lists and code blocks

**Problem**: No tag suggestions appearing
- **Solution**: Write more content (>50 words with specific keywords)

**Problem**: Writing suggestions seem wrong
- **Solution**: These are general guidelines, not strict rules - use your judgment

**Problem**: Performance issues with AI features
- **Solution**: Disable distraction-free mode, or reduce note length

---

## API Reference

### Component Props

#### RelatedNotes
```typescript
interface RelatedNotesProps {
  currentNote: Note;        // The active note
  allNotes: Note[];         // All available notes
  onNoteSelect: (note: Note) => void;  // Callback when note is clicked
}
```

#### AutoSummary
```typescript
interface AutoSummaryProps {
  content: string;                  // Note content (HTML or plain text)
  currentTags: string[];            // Existing tags on the note
  onAddTag?: (tag: string) => void; // Callback to add suggested tag
}
```

#### WritingSuggestions
```typescript
interface WritingSuggestionsProps {
  content: string;  // Note content to analyze
}
```

---

## Credits

**Algorithms**:
- TF-IDF: Standard information retrieval algorithm
- Cosine Similarity: Vector space model from linear algebra
- Extractive Summarization: Frequency-based sentence ranking

**Inspiration**:
- Roam Research (bidirectional links)
- Obsidian (knowledge graphs)
- Notion (AI writing assistant)
- UpNote (clean interface)

---

Last Updated: November 12, 2025
