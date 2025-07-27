/**
 * Markdown Processing Utilities
 * 
 * This module handles the conversion of markdown content to HTML and provides
 * utilities for markdown manipulation. Currently implements basic functionality
 * with plans for integration with advanced markdown processors like remark/rehype.
 * 
 * Future enhancements will include:
 * - Syntax highlighting for code blocks
 * - Custom component rendering (MDX support)
 * - Table of contents generation
 * - Math equation rendering
 * - Mermaid diagram support
 */

/**
 * Configuration options for markdown processing
 * Allows customization of the markdown rendering behavior
 */
export interface MarkdownOptions {
  /** Whether to sanitize HTML content for security */
  sanitize?: boolean;
  /** Whether to enable syntax highlighting for code blocks */
  highlightCode?: boolean;
  /** Whether to generate a table of contents */
  generateToc?: boolean;
  /** Custom CSS classes for styling */
  cssClasses?: {
    heading?: string;
    paragraph?: string;
    codeBlock?: string;
    inlineCode?: string;
    blockquote?: string;
    list?: string;
    table?: string;
  };
}

/**
 * Result of markdown processing including metadata
 */
export interface MarkdownResult {
  /** Processed HTML content */
  html: string;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Table of contents (if generated) */
  toc?: TableOfContentsItem[];
  /** Extracted metadata from frontmatter */
  metadata?: Record<string, any>;
}

/**
 * Table of contents item structure
 */
export interface TableOfContentsItem {
  /** Heading text */
  title: string;
  /** Anchor link slug */
  slug: string;
  /** Heading level (1-6) */
  level: number;
  /** Child headings */
  children?: TableOfContentsItem[];
}

/**
 * Basic markdown to HTML conversion
 * 
 * This is a simplified implementation for initial development.
 * In production, this should be replaced with a robust markdown processor
 * like remark + rehype for better performance and feature support.
 * 
 * @param markdown - Raw markdown content
 * @param options - Processing options
 * @returns Processed markdown result
 * 
 * @example
 * ```typescript
 * const result = await processMarkdown('# Hello World\n\nThis is **bold** text.');
 * console.log(result.html); // '<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>'
 * ```
 */
export async function processMarkdown(
  markdown: string, 
  options: MarkdownOptions = {}
): Promise<MarkdownResult> {
  try {
    // Basic markdown processing (to be replaced with remark/rehype)
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Inline code
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      // Code blocks (basic)
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      // Line breaks and paragraphs
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>');
    
    // Wrap in paragraph tags if content doesn't start with a block element
    if (!html.startsWith('<h') && !html.startsWith('<p') && !html.startsWith('<pre')) {
      html = `<p>${html}</p>`;
    }
    
    // Calculate reading time (average 200 words per minute)
    const wordCount = markdown.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    return {
      html,
      readingTime,
      // TODO: Implement TOC generation
      toc: undefined,
      // TODO: Implement frontmatter parsing
      metadata: undefined
    };
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw new Error('Failed to process markdown content');
  }
}

/**
 * Extracts plain text from markdown content
 * Useful for generating excerpts and search indexing
 * 
 * @param markdown - Raw markdown content
 * @returns Plain text without markdown formatting
 * 
 * @example
 * ```typescript
 * const plainText = extractPlainText('# Hello\n\nThis is **bold** text.');
 * console.log(plainText); // 'Hello This is bold text.'
 * ```
 */
export function extractPlainText(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    // Remove inline code
    .replace(/`(.*?)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove links (keep text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates a URL-friendly slug from text
 * Used for creating post slugs and anchor links
 * 
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 * 
 * @example
 * ```typescript
 * const slug = generateSlug('Building Modern Web Apps');
 * console.log(slug); // 'building-modern-web-apps'
 * ```
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates markdown content for common issues
 * Helps ensure content quality and consistency
 * 
 * @param markdown - Markdown content to validate
 * @returns Array of validation warnings/errors
 * 
 * @example
 * ```typescript
 * const issues = validateMarkdown('# Title\n\nContent without proper structure');
 * if (issues.length > 0) {
 *   console.log('Content issues found:', issues);
 * }
 * ```
 */
export function validateMarkdown(markdown: string): string[] {
  const issues: string[] = [];
  
  // Check for missing title
  if (!markdown.match(/^#\s+/m)) {
    issues.push('Content should start with a main heading (# Title)');
  }
  
  // Check for very short content
  if (markdown.length < 100) {
    issues.push('Content appears to be very short (less than 100 characters)');
  }
  
  // Check for unmatched code blocks
  const codeBlockMatches = markdown.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    issues.push('Unmatched code block delimiters (```)');
  }
  
  // Check for unmatched inline code
  const inlineCodeMatches = markdown.match(/`/g);
  if (inlineCodeMatches && inlineCodeMatches.length % 2 !== 0) {
    issues.push('Unmatched inline code delimiters (`)');
  }
  
  // Check for broken links (basic check)
  const linkMatches = markdown.match(/\[([^\]]+)\]\(([^)]+)\)/g);
  if (linkMatches) {
    linkMatches.forEach(link => {
      const urlMatch = link.match(/\]\(([^)]+)\)/);
      if (urlMatch && !urlMatch[1].trim()) {
        issues.push('Empty link URL found');
      }
    });
  }
  
  return issues;
}

/**
 * Estimates reading time for markdown content
 * Based on average reading speed of 200 words per minute
 * 
 * @param markdown - Markdown content
 * @returns Estimated reading time in minutes
 * 
 * @example
 * ```typescript
 * const time = estimateReadingTime(markdownContent);
 * console.log(`${time} min read`);
 * ```
 */
export function estimateReadingTime(markdown: string): number {
  const plainText = extractPlainText(markdown);
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// TODO: Future enhancements to implement
// - Integration with remark/rehype for robust markdown processing
// - Syntax highlighting with Prism.js or highlight.js
// - Custom component rendering for MDX support
// - Math equation rendering with KaTeX
// - Mermaid diagram support
// - Image optimization and lazy loading
// - Table of contents generation with proper nesting
// - Frontmatter parsing for metadata extraction
// - Plugin system for extensibility