import { getAllPosts } from '@/data/posts'

export async function GET() {
  const posts = getAllPosts()
  const baseUrl = 'https://yourdomain.com'
  
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Minimal Blog</title>
  <link>${baseUrl}</link>
  <description>A minimal, functional blog with insights on technology and development</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}/</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}/</guid>
    </item>
  `).join('')}
</channel>
</rss>`
  
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
} 