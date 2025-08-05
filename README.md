# Minimal Blog

A clean, minimal blog built with Next.js and Tailwind CSS. Fully static and deployable to any static hosting service.

## Features

- **Dark theme by default** with light theme toggle
- **Responsive design** that works on all devices
- **Clean typography** and spacing
- **Category filtering** (AI, Startup, Software, General, Non-tech)
- **Search functionality** (UI ready)
- **Sidebar navigation** with hamburger menu
- **Horizontal post cards** with thumbnails
- **Hero images** for blog posts and homepage
- **Image optimization** with Unsplash integration
- **Static export** for deployment anywhere
- **SEO optimized** with metadata and sitemap
- **RSS feed** for subscribers
- **Custom 404 page**

## Tech Stack

- **Next.js 13** - React framework with App Router
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons
- **Unsplash Images** - High-quality thumbnails

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Build the static site:
```bash
pnpm run build
```

2. The static files will be generated in the `out/` directory.

## Deployment

### GitHub Pages (Recommended)
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to "GitHub Actions"
4. The workflow will automatically deploy on push to main branch

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `pnpm run build`
4. Set publish directory: `out`

### Any Static Host
1. Run `pnpm run build`
2. Upload contents of `out/` directory to your hosting service

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

## SEO Features

- **Meta tags** for all pages
- **Open Graph** and Twitter cards with images
- **XML sitemap** at `/sitemap.xml`
- **RSS feed** at `/feed.xml`
- **Structured data** for blog posts
- **Optimized images** with proper sizing

## Design

- **Dark theme**: #121212 background with clean contrast
- **Layout**: Centered content with 20% spacing on sides
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Colors**: Minimal palette with proper contrast ratios
- **Images**: High-quality Unsplash thumbnails with hover effects

## License

MIT 