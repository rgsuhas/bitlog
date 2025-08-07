
# Bitlog: Minimal Blog

Clean, responsive blog built with **Next.js 13**, **Tailwind CSS**, and **TypeScript**. Ideal for tech writing, startups, and personal notes. Fully static, fast, and deployable anywhere.

🔗 **Live Site**: [https://bitlog-eight.vercel.app/](https://bitlog-eight.vercel.app/)  
🖼️  
![Homepage Preview](<img width="1911" height="993" alt="image" src="https://github.com/user-attachments/assets/c4771118-109a-40b2-88fd-d9ebcc8c4450" />
)
<img width="1200" height="893" alt="image" src="https://github.com/user-attachments/assets/b0f5ce08-3ee4-4530-a3fe-01f67cda3f6d" />


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

---
