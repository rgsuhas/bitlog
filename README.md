# CloudBlog - Modern Markdown Blog Platform

A production-ready blog platform built with Next.js 14, TypeScript, and Supabase. Features a powerful markdown editor, real-time collaboration, and comprehensive content management.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Real-time Editing**: Live markdown preview with auto-save
- **Authentication**: Secure user management with Supabase Auth
- **Role-based Access**: Admin, Editor, Author, and Reader roles
- **Content Management**: Draft, publish, and archive posts
- **SEO Optimized**: Meta tags, sitemaps, and structured data
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Analytics**: View tracking and engagement metrics
- **Comments System**: Nested comments with moderation
- **File Upload**: Image upload with optimization

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Git

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bitlog
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Setup

#### Option A: Manual Setup (Recommended)

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `scripts/setup-database.sql`
4. Execute the SQL script
5. Run the verification script:

```bash
npm run setup-db
```

#### Option B: Automatic Setup

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
bitlog/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Admin dashboard
│   ├── editor/            # Markdown editor
│   └── login/             # Authentication pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── blog/             # Blog-related components
│   ├── dashboard/        # Dashboard components
│   ├── editor/           # Editor components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── supabase/         # Database configuration
│   ├── auth.ts           # Authentication logic
│   ├── posts.ts          # Post management
│   └── types.ts          # TypeScript definitions
├── scripts/              # Setup and utility scripts
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup-db` - Test database connection
- `npm run seed` - Seed database with sample data

## 🗄️ Database Schema

### Tables

- **profiles**: User profiles and roles
- **posts**: Blog posts with metadata
- **comments**: Nested comment system
- **analytics**: View and engagement tracking

### Key Features

- Row Level Security (RLS) policies
- Automatic timestamps
- Full-text search capabilities
- Tag-based filtering
- View count tracking

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full system access
- **Editor**: Can edit and publish posts
- **Author**: Can create and edit own posts
- **Reader**: Can view published content

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Profile is automatically created
3. Role-based access control is enforced
4. Real-time session management

## 📝 Content Management

### Post States

- **Draft**: Work in progress
- **Published**: Live on the blog
- **Archived**: Hidden from public view

### Editor Features

- Real-time markdown preview
- Auto-save functionality
- Image upload and embedding
- Tag management
- SEO meta tag editing

## 🎨 UI Components

Built with Radix UI and Tailwind CSS:

- Responsive design system
- Dark/light mode support
- Accessible components
- Loading states and animations
- Toast notifications

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 🔍 SEO Features

- Dynamic meta tags
- Open Graph support
- Structured data
- Sitemap generation
- Robots.txt configuration

## 📊 Analytics

- Page view tracking
- User engagement metrics
- Comment analytics
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🗺️ Roadmap

- [ ] Advanced search functionality
- [ ] Newsletter integration
- [ ] Social media sharing
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API documentation
- [ ] Mobile app
- [ ] Plugin system

---

Built with ❤️ using Next.js, TypeScript, and Supabase 