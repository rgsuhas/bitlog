# Minimal Blog

A clean, minimal blog built with Next.js and Tailwind CSS.

## Features

- **Dark theme by default** with light theme toggle
- **Responsive design** that works on all devices
- **Clean typography** and spacing
- **Category filtering** (AI, Startup, Software, General, Non-tech)
- **Search functionality** (UI ready)
- **Sidebar navigation** with hamburger menu
- **Horizontal post cards** with thumbnails

## Tech Stack

- **Next.js 13** - React framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Home page
│   └── blog/page.tsx   # Blog listing page
├── components/
│   ├── Header.tsx      # Top navigation
│   ├── Sidebar.tsx     # Side navigation
│   ├── TopNav.tsx      # Category filters
│   ├── PostCard.tsx    # Post display component
│   └── ThemeProvider.tsx # Theme management
└── app/globals.css     # Global styles
```

## Design

- **Dark theme**: #121212 background with clean contrast
- **Layout**: Centered content with 20% spacing on sides
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Colors**: Minimal palette with proper contrast ratios

## License

MIT 