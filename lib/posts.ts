/**
 * Post Data Access Layer
 * 
 * This module handles all data operations related to blog posts.
 * Currently uses mock data for development, but is structured to easily
 * integrate with a real database or CMS in the future.
 * 
 * All functions include proper error handling and return consistent
 * data structures for reliable integration with UI components.
 */

import { Post, Author, PostStatus, PaginatedResponse, PaginationParams } from './types';

/**
 * Mock authors for demonstration purposes
 * In production, this would come from a user management system
 */
const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    initials: 'SC',
    bio: 'Full-stack developer passionate about modern web technologies and user experience.',
    website: 'https://sarahchen.dev'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    initials: 'MR',
    bio: 'DevOps engineer and cloud architecture specialist with 8+ years of experience.',
    website: 'https://marcusdev.io'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    initials: 'EW',
    bio: 'UI/UX designer turned frontend developer, focused on accessible and inclusive design.',
    website: 'https://emilywatson.design'
  }
];

/**
 * Mock blog posts for demonstration
 * In production, this would be fetched from a database or CMS
 * Each post includes comprehensive metadata for rich display and SEO
 */
const mockPosts: Post[] = [
  {
    id: '1',
    slug: 'building-modern-web-apps',
    title: 'Building Modern Web Applications with Next.js 14',
    excerpt: 'Explore the latest patterns and best practices for creating scalable, performant web applications using Next.js 14 and the app directory structure.',
    content: `# Building Modern Web Applications with Next.js 14

Next.js 14 introduces powerful new features that make building modern web applications more efficient and enjoyable than ever before.

## Key Features

### App Router
The new App Router provides a more intuitive way to structure your application with improved performance and developer experience.

### Server Components
React Server Components allow you to render components on the server, reducing bundle size and improving initial page load times.

### Streaming
Built-in streaming support enables progressive page loading for better user experience.

## Best Practices

1. **Use TypeScript** - Strong typing prevents runtime errors and improves developer productivity
2. **Implement proper error boundaries** - Graceful error handling improves user experience
3. **Optimize images** - Use Next.js Image component for automatic optimization
4. **Follow accessibility guidelines** - Ensure your app is usable by everyone

## Conclusion

Next.js 14 provides an excellent foundation for building production-ready web applications with modern best practices built-in.`,
    author: mockAuthors[0],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    status: 'published',
    readTime: 8,
    tags: ['Next.js', 'React', 'Web Development', 'TypeScript'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    metaDescription: 'Learn how to build modern, scalable web applications using Next.js 14 and the latest React features.',
    viewCount: 1247
  },
  {
    id: '2',
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Better Code',
    excerpt: 'Dive deep into advanced TypeScript patterns that will make your code more maintainable, type-safe, and elegant.',
    content: `# Advanced TypeScript Patterns for Better Code

TypeScript offers powerful features that go beyond basic type annotations. Let's explore advanced patterns that can significantly improve your code quality.

## Utility Types

TypeScript provides several built-in utility types that can help you create more flexible and reusable code.

### Pick and Omit

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Create a type without sensitive information
type PublicUser = Omit<User, 'password'>;

// Create a type with only specific fields
type UserCredentials = Pick<User, 'email' | 'password'>;
\`\`\`

## Conditional Types

Conditional types allow you to create types that depend on other types.

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };
\`\`\`

## Mapped Types

Create new types by transforming properties of existing types.

\`\`\`typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

These patterns help create more robust and maintainable TypeScript applications.`,
    author: mockAuthors[1],
    publishedAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    status: 'published',
    readTime: 12,
    tags: ['TypeScript', 'Programming', 'Best Practices'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop',
    metaDescription: 'Master advanced TypeScript patterns including utility types, conditional types, and mapped types.',
    viewCount: 892
  },
  {
    id: '3',
    slug: 'responsive-design-principles',
    title: 'Responsive Design Principles for 2024',
    excerpt: 'Learn the fundamental principles of responsive design and how to create websites that work beautifully on all devices.',
    content: `# Responsive Design Principles for 2024

Creating websites that work seamlessly across all devices is more important than ever. Here are the key principles to follow.

## Mobile-First Approach

Start designing for mobile devices and progressively enhance for larger screens.

## Flexible Grid Systems

Use CSS Grid and Flexbox to create layouts that adapt to different screen sizes.

## Responsive Images

Implement responsive images that load appropriately sized versions based on the device.

## Touch-Friendly Interfaces

Design interactive elements that work well with touch input on mobile devices.

## Performance Considerations

Optimize for performance across all devices, especially on slower mobile connections.`,
    author: mockAuthors[2],
    publishedAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    status: 'published',
    readTime: 6,
    tags: ['Design', 'CSS', 'Responsive', 'Mobile'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=1200&h=600&fit=crop',
    metaDescription: 'Essential responsive design principles for creating mobile-friendly websites in 2024.',
    viewCount: 634
  },
  {
    id: '4',
    slug: 'getting-started-with-markdown',
    title: 'Getting Started with Markdown for Technical Writing',
    excerpt: 'A comprehensive guide to using Markdown for technical documentation, blog posts, and more.',
    content: `# Getting Started with Markdown for Technical Writing

Markdown is a lightweight markup language that's perfect for technical writing. Here's everything you need to know.

## Basic Syntax

### Headers
Use \`#\` for headers. More \`#\` symbols create smaller headers.

### Emphasis
- *Italic text* with single asterisks
- **Bold text** with double asterisks
- ***Bold and italic*** with triple asterisks

### Lists
Create ordered and unordered lists easily:

1. First item
2. Second item
3. Third item

- Bullet point
- Another bullet
- One more

### Code
Inline \`code\` with backticks, or code blocks with triple backticks.

### Links and Images
[Link text](https://example.com)
![Alt text](image-url.jpg)

## Advanced Features

### Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

### Blockquotes
> This is a blockquote
> It can span multiple lines

## Best Practices

1. Keep it simple and readable
2. Use consistent formatting
3. Preview your content before publishing
4. Learn your editor's shortcuts

Markdown makes technical writing efficient and enjoyable!`,
    author: mockAuthors[0],
    publishedAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    status: 'published',
    readTime: 5,
    tags: ['Markdown', 'Writing', 'Documentation'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=1200&h=600&fit=crop',
    metaDescription: 'Learn Markdown syntax and best practices for technical writing and documentation.',
    viewCount: 445
  }
];

/**
 * Simulates network delay for realistic development experience
 * In production, this would be replaced with actual API calls
 */
const simulateNetworkDelay = (ms: number = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retrieves all published blog posts
 * 
 * @param featured - Optional filter to only return featured posts
 * @returns Promise resolving to array of published posts
 * 
 * @example
 * ```typescript
 * const allPosts = await getAllPosts();
 * const featuredPosts = await getAllPosts(true);
 * ```
 */
export async function getAllPosts(featured?: boolean): Promise<Post[]> {
  try {
    await simulateNetworkDelay();
    
    let posts = mockPosts.filter(post => post.status === 'published');
    
    if (featured !== undefined) {
      posts = posts.filter(post => post.featured === featured);
    }
    
    // Sort by publication date (newest first)
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

/**
 * Retrieves a single blog post by its slug
 * 
 * @param slug - URL-friendly identifier for the post
 * @returns Promise resolving to the post or null if not found
 * 
 * @example
 * ```typescript
 * const post = await getPostBySlug('building-modern-web-apps');
 * if (post) {
 *   console.log(post.title);
 * }
 * ```
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    await simulateNetworkDelay();
    
    const post = mockPosts.find(post => 
      post.slug === slug && post.status === 'published'
    );
    
    return post || null;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw new Error(`Failed to fetch post: ${slug}`);
  }
}

/**
 * Retrieves paginated list of posts with optional filtering
 * 
 * @param params - Pagination and filtering parameters
 * @returns Promise resolving to paginated response
 * 
 * @example
 * ```typescript
 * const result = await getPaginatedPosts({
 *   page: 1,
 *   limit: 10,
 *   tag: 'React'
 * });
 * ```
 */
export async function getPaginatedPosts(params: PaginationParams): Promise<PaginatedResponse<Post>> {
  try {
    await simulateNetworkDelay();
    
    let filteredPosts = mockPosts.filter(post => post.status === 'published');
    
    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply tag filter
    if (params.tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag => tag.toLowerCase() === params.tag?.toLowerCase())
      );
    }
    
    // Apply status filter
    if (params.status) {
      filteredPosts = filteredPosts.filter(post => post.status === params.status);
    }
    
    // Sort by publication date (newest first)
    filteredPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Calculate pagination
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const items = filteredPosts.slice(startIndex, endIndex);
    
    return {
      items,
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    throw new Error('Failed to fetch paginated posts');
  }
}

/**
 * Retrieves all unique tags from published posts
 * Useful for creating tag filters and navigation
 * 
 * @returns Promise resolving to array of unique tags
 * 
 * @example
 * ```typescript
 * const tags = await getAllTags();
 * // ['React', 'TypeScript', 'Next.js', ...]
 * ```
 */
export async function getAllTags(): Promise<string[]> {
  try {
    await simulateNetworkDelay();
    
    const publishedPosts = mockPosts.filter(post => post.status === 'published');
    const allTags = publishedPosts.flatMap(post => post.tags);
    const uniqueTags = Array.from(new Set(allTags));
    
    // Sort tags alphabetically
    return uniqueTags.sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}

/**
 * Retrieves posts by a specific author
 * 
 * @param authorId - Unique identifier for the author
 * @returns Promise resolving to array of posts by the author
 * 
 * @example
 * ```typescript
 * const authorPosts = await getPostsByAuthor('1');
 * ```
 */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  try {
    await simulateNetworkDelay();
    
    const posts = mockPosts.filter(post => 
      post.author.id === authorId && post.status === 'published'
    );
    
    // Sort by publication date (newest first)
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error(`Error fetching posts by author "${authorId}":`, error);
    throw new Error(`Failed to fetch posts by author: ${authorId}`);
  }
}