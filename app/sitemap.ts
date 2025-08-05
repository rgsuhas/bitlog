import { getAllPosts } from '@/data/posts'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const baseUrl = 'https://yourdomain.com'
  
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  return [
    { 
      url: baseUrl, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    { 
      url: `${baseUrl}/blog/`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    { 
      url: `${baseUrl}/blog/ai/`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/blog/startup/`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/blog/software/`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/blog/general/`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/blog/non-tech/`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/about/`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...postUrls,
  ]
} 