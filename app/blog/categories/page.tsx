import Link from 'next/link'
import { TopNav } from '@/components/TopNav'
import { getAllCategories, getCategoryStats } from '@/data/posts'
import { FolderOpen, ArrowRight } from 'lucide-react'

export default function CategoriesPage() {
  const categories = getAllCategories()
  const stats = getCategoryStats()

  const categoryUrls = {
    'AI': '/blog/ai/',
    'Startup': '/blog/startup/',
    'Software': '/blog/software/',
    'General': '/blog/general/',
    'Non-Tech': '/blog/non-tech/',
    'React': '/blog/software/' // React posts are in Software category
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Categories</h1>
        <p className="text-muted-foreground">
          Browse posts by category and discover content that interests you
        </p>
      </div>
      
      <TopNav activeCategory="all" />
      
      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={categoryUrls[category as keyof typeof categoryUrls] || '/blog/'}
            className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-border/60 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stats[category] || 0} {stats[category] === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <p className="text-muted-foreground text-sm">
              Explore our {category.toLowerCase()} articles and insights
            </p>
          </Link>
        ))}
      </div>

      {/* Category Stats */}
      <div className="mt-12 p-6 bg-card border border-border rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Category Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="font-medium">{category}</span>
              <span className="text-sm text-muted-foreground">
                {stats[category] || 0} posts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 