/**
 * SEO System
 * 
 * Comprehensive SEO system for generating meta tags, structured data,
 * sitemaps, and optimizing content for search engines. Provides
 * production-ready SEO capabilities with proper optimization.
 * 
 * Features:
 * - Meta tag generation
 * - Structured data (JSON-LD)
 * - Sitemap generation
 * - Robots.txt configuration
 * - Open Graph tags
 * - Twitter Cards
 * - Schema markup
 */

import { createClientSupabase } from './supabase/client';
import { dbUtils } from './supabase/utils';
import { Post } from './types';

export interface MetaTags {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: {
    '@type': string;
    name: string;
    url: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
}

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate meta tags for a post
 * 
 * @param post - Post data
 * @param baseUrl - Base URL of the site
 * @returns Meta tags object
 * 
 * @example
 * ```typescript
 * const metaTags = generateMetaTags(post, 'https://example.com');
 * ```
 */
export function generateMetaTags(post: Post, baseUrl: string): MetaTags {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.coverImage || `${baseUrl}/default-og-image.jpg`;
  
  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: post.tags || [],
    author: post.author?.name || 'Unknown Author',
    canonical: postUrl,
    ogTitle: post.title,
    ogDescription: post.excerpt || post.content.substring(0, 160),
    ogImage: imageUrl,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: post.title,
    twitterDescription: post.excerpt || post.content.substring(0, 160),
    twitterImage: imageUrl
  };
}

/**
 * Generate structured data (JSON-LD) for a post
 * 
 * @param post - Post data
 * @param baseUrl - Base URL of the site
 * @returns Structured data object
 */
export function generateStructuredData(post: Post, baseUrl: string): StructuredData {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.coverImage || `${baseUrl}/default-og-image.jpg`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Unknown Author',
      url: `${baseUrl}/author/${post.author?.id || 'unknown'}`
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Platform',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: imageUrl,
    url: postUrl
  };
}

/**
 * Generate sitemap XML
 * 
 * @param posts - Array of posts
 * @param baseUrl - Base URL of the site
 * @returns Sitemap XML string
 */
export function generateSitemap(posts: Post[], baseUrl: string): string {
  const urls: SitemapUrl[] = [
    // Homepage
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    // Blog listing
    {
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.8
    }
  ];

  // Add post URLs
  posts.forEach(post => {
    if (post.status === 'published') {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: 'weekly',
        priority: 0.6
      });
    }
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

/**
 * Generate robots.txt content
 * 
 * @param baseUrl - Base URL of the site
 * @returns Robots.txt content
 */
export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /_next/

# Allow important pages
Allow: /blog/
Allow: /about/
Allow: /contact/
`;
}

/**
 * Generate RSS feed XML
 * 
 * @param posts - Array of published posts
 * @param baseUrl - Base URL of the site
 * @returns RSS feed XML string
 */
export function generateRSSFeed(posts: Post[], baseUrl: string): string {
  const publishedPosts = posts.filter(post => post.status === 'published');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Platform'}</title>
    <link>${baseUrl}</link>
    <description>Latest blog posts and articles</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${publishedPosts.map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || post.content.substring(0, 200))}</description>
      <author>${post.author?.name || 'Unknown Author'}</author>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return rss;
}

/**
 * Escape XML special characters
 * 
 * @param text - Text to escape
 * @returns Escaped text
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate meta tags HTML
 * 
 * @param metaTags - Meta tags object
 * @returns HTML string with meta tags
 */
export function generateMetaTagsHTML(metaTags: MetaTags): string {
  return `
    <title>${metaTags.title}</title>
    <meta name="description" content="${metaTags.description}" />
    <meta name="keywords" content="${metaTags.keywords.join(', ')}" />
    <meta name="author" content="${metaTags.author}" />
    <link rel="canonical" href="${metaTags.canonical}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${metaTags.ogTitle}" />
    <meta property="og:description" content="${metaTags.ogDescription}" />
    <meta property="og:image" content="${metaTags.ogImage}" />
    <meta property="og:type" content="${metaTags.ogType}" />
    <meta property="og:url" content="${metaTags.canonical}" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="${metaTags.twitterCard}" />
    <meta name="twitter:title" content="${metaTags.twitterTitle}" />
    <meta name="twitter:description" content="${metaTags.twitterDescription}" />
    <meta name="twitter:image" content="${metaTags.twitterImage}" />
  `.trim();
}

/**
 * Generate structured data HTML
 * 
 * @param structuredData - Structured data object
 * @returns HTML string with structured data
 */
export function generateStructuredDataHTML(structuredData: StructuredData): string {
  return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * Optimize content for SEO
 * 
 * @param content - Content to optimize
 * @param keywords - Target keywords
 * @returns Optimized content
 */
export function optimizeContent(content: string, keywords: string[]): string {
  let optimized = content;
  
  // Add keywords to headings if not present
  keywords.forEach(keyword => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    optimized = optimized.replace(headingRegex, (match, hashes, heading) => {
      if (!heading.toLowerCase().includes(keyword.toLowerCase())) {
        return `${hashes} ${heading} - ${keyword}`;
      }
      return match;
    });
  });
  
  // Ensure proper heading structure
  const headingLevels = optimized.match(/^(#{1,6})\s+/gm) || [];
  let currentLevel = 0;
  
  optimized = optimized.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, heading) => {
    const level = hashes.length;
    if (level > currentLevel + 1) {
      // Skip levels, adjust to current + 1
      const adjustedHashes = '#'.repeat(currentLevel + 1);
      currentLevel = level - 1;
      return `${adjustedHashes} ${heading}`;
    }
    currentLevel = level;
    return match;
  });
  
  return optimized;
}

/**
 * Generate breadcrumb structured data
 * 
 * @param breadcrumbs - Array of breadcrumb items
 * @param baseUrl - Base URL of the site
 * @returns Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>,
  baseUrl: string
): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`
    }))
  };
}

/**
 * Generate organization structured data
 * 
 * @param baseUrl - Base URL of the site
 * @returns Organization structured data
 */
export function generateOrganizationStructuredData(baseUrl: string): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Platform',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      // Add social media URLs here
      // 'https://twitter.com/yourhandle',
      // 'https://linkedin.com/company/yourcompany'
    ]
  };
} 