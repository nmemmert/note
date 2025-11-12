/**
 * Text Analysis and AI Features
 * Provides utilities for note similarity, auto-summarization, and content analysis
 */

export interface NoteSimilarity {
  noteId: string;
  title: string;
  similarity: number;
  commonTerms: string[];
}

/**
 * Calculate TF-IDF (Term Frequency-Inverse Document Frequency) for documents
 */
export class TFIDFAnalyzer {
  private documents: Map<string, string[]> = new Map();
  private idf: Map<string, number> = new Map();
  
  // Common stop words to filter out
  private stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had',
    'what', 'when', 'where', 'who', 'which', 'why', 'how'
  ]);

  /**
   * Tokenize and clean text
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
  }

  /**
   * Add documents to the analyzer
   */
  addDocuments(docs: Array<{ id: string; text: string }>) {
    // Clear existing data
    this.documents.clear();
    this.idf.clear();

    // Tokenize all documents
    docs.forEach(doc => {
      const tokens = this.tokenize(doc.text);
      this.documents.set(doc.id, tokens);
    });

    // Calculate IDF for each term
    const docCount = docs.length;
    const termDocCount = new Map<string, number>();

    this.documents.forEach(tokens => {
      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach(token => {
        termDocCount.set(token, (termDocCount.get(token) || 0) + 1);
      });
    });

    termDocCount.forEach((count, term) => {
      this.idf.set(term, Math.log(docCount / count));
    });
  }

  /**
   * Calculate TF-IDF vector for a document
   */
  private getTFIDFVector(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    const vector = new Map<string, number>();
    
    // Calculate term frequency
    tokens.forEach(token => {
      tf.set(token, (tf.get(token) || 0) + 1);
    });

    // Calculate TF-IDF
    tf.forEach((freq, term) => {
      const idf = this.idf.get(term) || 0;
      vector.set(term, (freq / tokens.length) * idf);
    });

    return vector;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(v1: Map<string, number>, v2: Map<string, number>): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    const allTerms = new Set([...v1.keys(), ...v2.keys()]);

    allTerms.forEach(term => {
      const val1 = v1.get(term) || 0;
      const val2 = v2.get(term) || 0;
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * Find similar documents to a given document
   */
  findSimilar(docId: string, topN: number = 5): Array<{ id: string; similarity: number; commonTerms: string[] }> {
    const targetTokens = this.documents.get(docId);
    if (!targetTokens) return [];

    const targetVector = this.getTFIDFVector(targetTokens);
    const similarities: Array<{ id: string; similarity: number; commonTerms: string[] }> = [];

    this.documents.forEach((tokens, id) => {
      if (id === docId) return;

      const vector = this.getTFIDFVector(tokens);
      const similarity = this.cosineSimilarity(targetVector, vector);

      if (similarity > 0.1) { // Threshold for relevance
        // Find common important terms
        const commonTerms: string[] = [];
        targetVector.forEach((score, term) => {
          if (vector.has(term) && score > 0.1) {
            commonTerms.push(term);
          }
        });

        similarities.push({
          id,
          similarity,
          commonTerms: commonTerms.slice(0, 5)
        });
      }
    });

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN);
  }
}

/**
 * Generate an automatic summary of text
 */
export function generateSummary(text: string, maxSentences: number = 3): string {
  if (!text || text.trim().length === 0) {
    return '';
  }

  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Split into sentences
  const sentences = cleanText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // Filter out very short sentences

  if (sentences.length === 0) return '';
  if (sentences.length <= maxSentences) return sentences.join('. ') + '.';

  // Score sentences based on word frequency
  const words = cleanText.toLowerCase().split(/\s+/);
  const wordFreq = new Map<string, number>();
  
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  // Score each sentence
  const sentenceScores = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    let score = 0;
    sentenceWords.forEach(word => {
      score += wordFreq.get(word) || 0;
    });
    return { sentence, score: score / sentenceWords.length };
  });

  // Get top sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(s => s.sentence);

  return topSentences.join('. ') + '.';
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, topN: number = 10): string[] {
  const cleanText = text.replace(/<[^>]*>/g, ' ').toLowerCase();
  const words = cleanText.split(/\s+/).filter(w => w.length > 3);
  
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Suggest tags based on content
 */
export function suggestTags(text: string, existingTags: string[] = []): string[] {
  const keywords = extractKeywords(text, 15);
  
  // Filter out keywords that are already tags
  const newSuggestions = keywords.filter(
    keyword => !existingTags.some(tag => 
      tag.toLowerCase() === keyword.toLowerCase()
    )
  );

  return newSuggestions.slice(0, 5);
}

/**
 * Analyze writing statistics
 */
export interface WritingStats {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number; // in minutes
  averageWordLength: number;
  averageSentenceLength: number;
}

export function analyzeWriting(text: string): WritingStats {
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  const wordCount = words.length;
  const characterCount = cleanText.length;
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;
  
  const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / (wordCount || 1);
  const averageSentenceLength = wordCount / (sentenceCount || 1);
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute

  return {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    readingTime,
    averageWordLength,
    averageSentenceLength
  };
}

/**
 * Provide writing suggestions
 */
export interface WritingSuggestion {
  type: 'readability' | 'style' | 'grammar' | 'tip';
  message: string;
  severity: 'info' | 'warning';
}

export function getWritingSuggestions(text: string): WritingSuggestion[] {
  const suggestions: WritingSuggestion[] = [];
  const stats = analyzeWriting(text);

  // Check for very long sentences
  if (stats.averageSentenceLength > 25) {
    suggestions.push({
      type: 'readability',
      message: 'Consider breaking up long sentences for better readability.',
      severity: 'info'
    });
  }

  // Check for very short content
  if (stats.wordCount < 50) {
    suggestions.push({
      type: 'style',
      message: 'Add more detail to make your note more comprehensive.',
      severity: 'info'
    });
  }

  // Check for lack of structure
  if (stats.wordCount > 200 && stats.paragraphCount < 2) {
    suggestions.push({
      type: 'style',
      message: 'Consider breaking your content into paragraphs for better organization.',
      severity: 'info'
    });
  }

  // Check for passive voice (simplified detection)
  const passiveIndicators = /(was|were|been|being)\s+\w+ed/gi;
  const passiveMatches = text.match(passiveIndicators);
  if (passiveMatches && passiveMatches.length > 3) {
    suggestions.push({
      type: 'style',
      message: 'Consider using more active voice to make your writing more engaging.',
      severity: 'info'
    });
  }

  // Provide positive feedback for good notes
  if (stats.wordCount > 100 && stats.paragraphCount > 2 && stats.averageSentenceLength < 20) {
    suggestions.push({
      type: 'tip',
      message: 'Great job! Your note is well-structured and easy to read.',
      severity: 'info'
    });
  }

  return suggestions;
}
