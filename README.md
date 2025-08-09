
# Bitlog

A minimal, responsive blog built with **Next.js 13**, **Tailwind CSS**, and **TypeScript**. Designed for tech writing, startups, and personal notes. Fully static, fast, and deployable anywhere.

🔗 **Live Site**: [https://rg-bitlog.vercel.app/](https://rg-bitlog.vercel.app/)

![Homepage Preview](https://github.com/user-attachments/assets/c4771118-109a-40b2-88fd-d9ebcc8c4450)

## Features

- **Dark Mode**: Default dark theme with toggle
- **Responsive Design**: Mobile-first layout
- **Category Filtering**: AI, Software, Startup, General, Non-Tech
- **Navigation**: Sidebar with hamburger menu
- **SEO Optimized**: Meta tags, sitemap, RSS feed
- **Static Export**: Deploy anywhere with `out/` directory
- **Image Integration**: Blog thumbnails from Unsplash

## Quick Start

```bash
pnpm install
pnpm dev
```

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Home page with hero post
│   ├── blog/page.tsx   # Blog listing page
│   ├── blog/[slug]/    # Individual blog posts with hero images
│   ├── sitemap.ts      # XML sitemap generation
│   ├── feed.xml/       # RSS feed
│   ├── not-found.tsx   # 404 page
│   └── loading.tsx     # Loading component
├── components/
│   ├── Header.tsx      # Top navigation
│   ├── Sidebar.tsx     # Side navigation
│   ├── TopNav.tsx      # Category filters
│   ├── PostCard.tsx    # Post display component with thumbnails
│   └── ThemeProvider.tsx # Theme management
├── data/
│   └── posts.ts        # Blog post data with Unsplash thumbnails
└── out/                # Static build output
```

## Building for Production

```bash
pnpm run build
```

## Deployment

### GitHub Pages
Automatically deployed via GitHub Actions. Push to `main` branch to trigger deployment.

### Vercel
Connect your repository to Vercel for automatic deployments.

### Netlify
Deploy the `out/` directory to Netlify for static hosting.

## Adding New Posts

Edit `data/posts.ts` to add new blog posts with the following structure:

```typescript
{
  id: 'unique-id',
  title: 'Post Title',
  excerpt: 'Brief description',
  content: 'Full markdown content',
  tags: ['category'],
  thumbnail: 'https://images.unsplash.com/...',
  date: '2024-01-01'
}
```
