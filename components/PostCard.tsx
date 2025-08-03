'use client'

import Link from 'next/link'
import { Calendar, Clock, Eye, ExternalLink, Bookmark } from 'lucide-react'
import { Post } from '@/data/posts'

interface PostCardProps {
  post: Post
}

// Function to get relevant Unsplash image based on post content
function getUnsplashImage(post: Post): string {
  const { title, tags } = post
  
  // Create search terms based on title and tags
  const searchTerms = [
    ...tags,
    ...title.toLowerCase().split(' ').filter(word => word.length > 3)
  ]
  
  // Map specific terms to Unsplash search queries
  const imageMap: Record<string, string> = {
    'nextjs': 'nextjs,react,web-development',
    'typescript': 'typescript,programming,code',
    'ai': 'artificial-intelligence,technology,future',
    'startup': 'startup,business,entrepreneurship',
    'software': 'software,programming,technology',
    'development': 'programming,code,technology',
    'psychology': 'psychology,mind,human-behavior',
    'design': 'design,creativity,art',
    'technology': 'technology,innovation,future',
    'general': 'abstract,minimal,modern'
  }
  
  // Find the best matching term
  let bestMatch = 'general'
  for (const term of searchTerms) {
    if (imageMap[term.toLowerCase()]) {
      bestMatch = term.toLowerCase()
      break
    }
  }
  
  // Generate Unsplash URL with the search term
  const searchQuery = imageMap[bestMatch] || 'technology'
  return `https://source.unsplash.com/400x300/?${searchQuery}`
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = getUnsplashImage(post)

  return (
    <article className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-border/60 transition-all duration-200">
      <div className="flex items-start space-x-6">
        {/* Thumbnail Image */}
        <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          {/* Fallback placeholder */}
          <div className="hidden w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-2xl">📄</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Actions */}
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <div className="flex items-center space-x-1 ml-4">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="View">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Share">
                <ExternalLink className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Bookmark">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
} 