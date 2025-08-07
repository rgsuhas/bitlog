
# Minimal Blog

Clean, responsive blog built with **Next.js 13**, **Tailwind CSS**, and **TypeScript**. Ideal for tech writing, startups, and personal notes. Fully static, fast, and deployable anywhere.

🔗 **Live Site**: [https://minimal-blog.vercel.app](https://minimal-blog.vercel.app)  
🖼️  
![Homepage Preview](https://minimal-blog.vercel.app/og.png)

---

## Features

- Dark mode by default with toggle  
- Responsive, mobile-first layout  
- Post categories: AI, Software, Startup, etc.  
- Sidebar with hamburger nav  
- Search-ready UI  
- SEO + RSS + Sitemap  
- Static export (`out/`)  
- Blog thumbnails from Unsplash  

---

## Quick Start

```bash
pnpm install
pnpm dev


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
---
