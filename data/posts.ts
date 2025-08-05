export interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  tags: string[]
  publishedAt: string
  readTime: number
  content: string
  thumbnail: string
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    excerpt: 'Learn the basics of Next.js and build your first application. This comprehensive guide covers everything from setup to deployment.',
    slug: 'getting-started-nextjs',
    tags: ['Software'],
    publishedAt: '2024-01-15',
    readTime: 5,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    content: `
# Getting Started with Next.js

Next.js is a powerful React framework that makes building full-stack web applications simple and efficient.

## Why Next.js?

- **Zero Configuration**: Get started immediately with sensible defaults
- **Server-Side Rendering**: Better SEO and performance
- **File-Based Routing**: Create routes by adding files to the pages directory
- **API Routes**: Build API endpoints as Node.js serverless functions

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features

### 1. File-Based Routing
Create routes by adding files to the \`pages\` directory:

\`\`\`
pages/
  index.js          # → /
  about.js          # → /about
  posts/
    [id].js         # → /posts/1, /posts/2, etc.
\`\`\`

### 2. API Routes
Create API endpoints in the \`pages/api\` directory:

\`\`\`javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World!' })
}
\`\`\`

### 3. Static Generation
Pre-render pages at build time:

\`\`\`javascript
export async function getStaticProps() {
  return {
    props: {
      data: 'Static data'
    }
  }
}
\`\`\`

## Deployment

Deploy to Vercel with one command:

\`\`\`bash
npm run build
vercel --prod
\`\`\`

Next.js is the perfect framework for building modern web applications. Start your journey today!
    `
  },
  {
    id: '2',
    title: 'The Future of AI in Development',
    excerpt: 'Exploring how AI is transforming the software development landscape. From code generation to testing automation.',
    slug: 'future-ai-development',
    tags: ['AI'],
    publishedAt: '2024-01-10',
    readTime: 8,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecadf41?w=800&h=400&fit=crop',
    content: `
# The Future of AI in Development

Artificial Intelligence is revolutionizing how we write, test, and maintain code. Let's explore the current state and future possibilities.

## Current AI Tools

### 1. Code Generation
- **GitHub Copilot**: AI-powered code completion
- **Tabnine**: Context-aware code suggestions
- **CodeWhisperer**: AWS's AI coding assistant

### 2. Code Review
- **DeepCode**: AI-powered code review
- **CodeGuru**: Automated code analysis
- **SonarQube**: Quality gate automation

### 3. Testing
- **Testim**: AI-powered test automation
- **Applitools**: Visual AI testing
- **Functionize**: Intelligent test creation

## Impact on Development

### Pros
- **Faster Development**: Generate boilerplate code quickly
- **Better Code Quality**: AI catches common mistakes
- **Reduced Learning Curve**: AI helps with new languages/frameworks
- **24/7 Availability**: AI doesn't need sleep

### Cons
- **Over-reliance**: Developers might become dependent
- **Security Concerns**: AI-generated code might have vulnerabilities
- **Job Displacement**: Some roles might become automated
- **Quality Issues**: AI can generate incorrect or inefficient code

## The Future

### 2024-2025
- More sophisticated code generation
- Better understanding of project context
- Integration with more IDEs and tools

### 2025-2030
- AI pair programming becomes standard
- Automated testing and deployment
- AI-powered project management

### Beyond 2030
- AI-driven architecture decisions
- Automated system design
- Self-healing applications

## Preparing for the Future

1. **Learn AI Tools**: Familiarize yourself with current AI coding assistants
2. **Focus on Architecture**: AI can't replace good system design
3. **Develop Soft Skills**: Communication and problem-solving remain human
4. **Stay Updated**: Keep learning new technologies and approaches

The future of development is AI-assisted, not AI-replaced. Embrace the tools while developing your core skills.
    `
  },
  {
    id: '3',
    title: 'Building a Startup from Scratch',
    excerpt: 'Lessons learned from building and launching a successful startup. Real insights from the trenches.',
    slug: 'building-startup-scratch',
    tags: ['Startup'],
    publishedAt: '2024-01-05',
    readTime: 12,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    content: `
# Building a Startup from Scratch

Starting a company is one of the most challenging and rewarding experiences. Here are the lessons I learned building my startup from the ground up.

## The Idea Phase

### 1. Validate Your Idea
- **Talk to potential customers** before writing any code
- **Build a simple MVP** to test assumptions
- **Measure everything** - don't guess, know

### 2. Market Research
- **Competitive analysis**: Who else is solving this problem?
- **Market size**: Is the opportunity big enough?
- **Customer segments**: Who will pay for your solution?

## The MVP Phase

### 1. Keep It Simple
- **Focus on core features** only
- **Launch quickly** - perfect is the enemy of done
- **Get feedback early** and often

### 2. Technical Decisions
- **Choose familiar technologies** - don't experiment with new tech
- **Plan for scale** but don't over-engineer
- **Document everything** - you'll thank yourself later

## The Launch Phase

### 1. Marketing Strategy
- **Content marketing**: Blog posts, videos, podcasts
- **Social media**: Build an audience before you need it
- **PR**: Get press coverage for credibility

### 2. Customer Acquisition
- **Referral programs**: Reward existing customers
- **Partnerships**: Leverage other companies' audiences
- **SEO**: Long-term organic growth

## The Growth Phase

### 1. Team Building
- **Hire for culture fit** first, skills second
- **Remote-first**: Access to global talent
- **Equity distribution**: Fair but not equal

### 2. Funding
- **Bootstrap as long as possible**
- **Raise when you have traction**
- **Choose investors carefully** - they're long-term partners

## Common Mistakes

### 1. Building Too Much
- **Feature creep** kills startups
- **Focus on one thing** and do it well
- **Launch early** and iterate

### 2. Ignoring Customers
- **Listen to feedback** but don't build everything requested
- **Understand the problem** before building the solution
- **Measure user behavior** not just opinions

### 3. Poor Financial Management
- **Track cash flow** religiously
- **Plan for 18 months** of runway
- **Don't spend on non-essentials**

## Success Metrics

### 1. Product Metrics
- **User engagement**: Time spent, features used
- **Retention**: How many users come back
- **Growth rate**: Month-over-month growth

### 2. Business Metrics
- **Revenue**: Monthly recurring revenue
- **Customer acquisition cost**: How much to acquire a customer
- **Lifetime value**: Total value of a customer

## The Reality

### Challenges
- **Long hours**: 80+ hour weeks are common
- **Stress**: Everything is your responsibility
- **Uncertainty**: No guaranteed paycheck
- **Isolation**: Few people understand your journey

### Rewards
- **Freedom**: Build what you want
- **Impact**: Solve real problems
- **Learning**: Accelerated personal growth
- **Financial upside**: Potential for significant returns

## Advice for Founders

1. **Start small**: Don't try to change the world overnight
2. **Stay focused**: Say no to good opportunities
3. **Take care of yourself**: Health is your most important asset
4. **Build a support network**: Other founders understand
5. **Keep learning**: The journey never ends

Building a startup is a marathon, not a sprint. Prepare for the long haul and enjoy the journey.
    `
  },
  {
    id: '4',
    title: 'Why I Switched to TypeScript',
    excerpt: 'After years of using JavaScript, here\'s why I finally made the switch to TypeScript and never looked back.',
    slug: 'why-typescript',
    tags: ['Software'],
    publishedAt: '2024-01-01',
    readTime: 6,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    content: `
# Why I Switched to TypeScript

After years of writing JavaScript, I finally made the switch to TypeScript. Here's why I wish I had done it sooner.

## The JavaScript Problem

### 1. Runtime Errors
JavaScript errors only surface at runtime:

\`\`\`javascript
// This will fail at runtime
const user = { name: 'John' };
console.log(user.age.toUpperCase()); // TypeError!
\`\`\`

### 2. Poor IDE Support
Without types, IDEs can't provide good autocomplete:

\`\`\`javascript
// IDE doesn't know what properties exist
function processUser(user) {
  return user. // What properties are available?
}
\`\`\`

### 3. Refactoring Nightmares
Changing a property name requires manual search and replace:

\`\`\`javascript
// If you change 'name' to 'fullName', you have to find all usages
const user = { name: 'John' };
console.log(user.name); // Will break if renamed
\`\`\`

## The TypeScript Solution

### 1. Compile-Time Error Detection
TypeScript catches errors before runtime:

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = { name: 'John', age: 30 };
console.log(user.age.toUpperCase()); // Compile error!
\`\`\`

### 2. Excellent IDE Support
Full autocomplete and IntelliSense:

\`\`\`typescript
function processUser(user: User) {
  return user. // IDE shows all available properties
}
\`\`\`

### 3. Safe Refactoring
Renaming is automatic and safe:

\`\`\`typescript
interface User {
  fullName: string; // Renamed from 'name'
  age: number;
}

const user: User = { fullName: 'John', age: 30 };
console.log(user.fullName); // Automatically updated
\`\`\`

## Real-World Benefits

### 1. Better Code Quality
- **Fewer bugs**: Catch errors at compile time
- **Self-documenting**: Types serve as documentation
- **Easier maintenance**: Clear interfaces and contracts

### 2. Improved Developer Experience
- **Faster development**: Better autocomplete
- **Confidence**: Know your code works before running
- **Better tooling**: Enhanced debugging and profiling

### 3. Team Collaboration
- **Clear contracts**: Interfaces define expectations
- **Easier onboarding**: New developers understand code faster
- **Reduced code review time**: Types catch obvious issues

## Migration Strategy

### 1. Gradual Adoption
- **Start with new files**: Write new code in TypeScript
- **Add types incrementally**: Don't rewrite everything at once
- **Use .js files**: TypeScript can check JavaScript files

### 2. Configuration
\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "allowJs": true,
    "checkJs": true
  }
}
\`\`\`

### 3. Common Patterns
\`\`\`typescript
// Generic types for reusable components
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Union types for flexibility
type Status = 'loading' | 'success' | 'error';

// Optional properties
interface User {
  name: string;
  email?: string; // Optional
}
\`\`\`

## Common Concerns

### 1. "It's Too Complex"
- **Start simple**: Use basic types first
- **Learn gradually**: Add advanced features as needed
- **Good defaults**: TypeScript has sensible defaults

### 2. "It Slows Down Development"
- **Initial setup**: Takes time to configure
- **Long-term gains**: Saves time on debugging and refactoring
- **Better tooling**: Faster development with good IDE support

### 3. "JavaScript is Fine"
- **Growing ecosystem**: Most popular libraries have TypeScript support
- **Industry standard**: Major companies use TypeScript
- **Future-proof**: TypeScript is here to stay

## Getting Started

### 1. Install TypeScript
\`\`\`bash
npm install -g typescript
npm install --save-dev typescript @types/node
\`\`\`

### 2. Create tsconfig.json
\`\`\`bash
npx tsc --init
\`\`\`

### 3. Start with a simple file
\`\`\`typescript
// hello.ts
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Conclusion

TypeScript has transformed how I write JavaScript. The initial learning curve is worth the long-term benefits. Start small, be patient, and enjoy the improved developer experience.

The future of JavaScript development is typed. Don't get left behind.
    `
  },
  {
    id: '5',
    title: 'The Psychology of Product Design',
    excerpt: 'Understanding user psychology is crucial for creating products that people actually want to use.',
    slug: 'psychology-product-design',
    tags: ['General'],
    publishedAt: '2023-12-28',
    readTime: 10,
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
    content: `
# The Psychology of Product Design

Great product design isn't just about aesthetics—it's about understanding how people think, feel, and behave. Here's how psychology shapes successful products.

## Cognitive Load Theory

### 1. Working Memory Limits
Humans can only hold 7±2 items in working memory:

\`\`\`
✅ Good: Simple navigation with 5-7 main items
❌ Bad: Overwhelming menus with 20+ options
\`\`\`

### 2. Chunking Information
Break complex information into digestible pieces:

\`\`\`
✅ Good: Progressive disclosure of features
❌ Bad: Dumping all information at once
\`\`\`

## Visual Hierarchy

### 1. F-Pattern Reading
Users scan in an F-pattern on web pages:

\`\`\`
✅ Good: Important content in top-left area
❌ Bad: Key information buried in bottom-right
\`\`\`

### 2. Visual Weight
Use size, color, and contrast to guide attention:

\`\`\`
✅ Good: Clear primary actions with high contrast
❌ Bad: All elements competing for attention
\`\`\`

## Color Psychology

### 1. Emotional Associations
- **Blue**: Trust, stability, professionalism
- **Green**: Growth, health, nature
- **Red**: Energy, urgency, danger
- **Yellow**: Optimism, creativity, warmth

### 2. Cultural Considerations
- **Red**: Good luck in China, danger in Western cultures
- **White**: Purity in Western cultures, mourning in Eastern cultures

## Social Proof

### 1. User Reviews
- **Display prominently**: Show social validation
- **Use real photos**: Increase authenticity
- **Highlight numbers**: "Join 10,000+ users"

### 2. Testimonials
- **Include photos**: Human faces increase trust
- **Use specific details**: "Increased sales by 40%" vs "Great product"
- **Show diversity**: Appeal to different user segments

## Loss Aversion

### 1. Scarcity and Urgency
- **Limited time offers**: Create FOMO
- **Stock indicators**: "Only 3 left in stock"
- **Countdown timers**: Increase urgency

### 2. Free Trials
- **Risk-free trial**: Reduces commitment barrier
- **Easy cancellation**: Builds trust
- **Value demonstration**: Show benefits quickly

## Anchoring Effect

### 1. Price Anchoring
- **Show original price**: Makes sale price seem better
- **Premium options**: Make standard option look reasonable
- **Feature comparison**: Highlight value of paid plans

### 2. Feature Anchoring
- **Show competitor prices**: Position your value
- **Highlight premium features**: Justify higher pricing
- **Use "most popular"**: Guide user choice

## Cognitive Ease

### 1. Familiarity
- **Use common patterns**: Don't reinvent the wheel
- **Consistent terminology**: Match user expectations
- **Standard icons**: Leverage existing mental models

### 2. Clarity
- **Simple language**: Avoid jargon
- **Clear benefits**: What's in it for the user?
- **Visual aids**: Icons, diagrams, videos

## Decision Fatigue

### 1. Reduce Choices
- **Curated options**: Don't overwhelm with choices
- **Smart defaults**: Pre-select reasonable options
- **Progressive disclosure**: Show options when needed

### 2. Guide Decisions
- **Clear recommendations**: "Most popular" or "Best value"
- **Comparison tables**: Make differences obvious
- **Decision trees**: Help users choose

## Emotional Design

### 1. Delightful Moments
- **Micro-interactions**: Small animations and feedback
- **Easter eggs**: Hidden features that surprise users
- **Personalization**: Tailored experiences

### 2. Emotional Journey
- **Onboarding**: Build excitement and confidence
- **Success moments**: Celebrate user achievements
- **Error handling**: Empathetic error messages

## Accessibility Psychology

### 1. Inclusive Design
- **Multiple ways to complete tasks**: Accommodate different abilities
- **Clear error messages**: Help users understand and fix issues
- **Consistent navigation**: Reduce cognitive load

### 2. Universal Design
- **Design for extremes**: Solutions work for everyone
- **Consider temporary disabilities**: Broken arm, poor lighting
- **Test with diverse users**: Different ages, abilities, backgrounds

## Behavioral Triggers

### 1. Triggers
- **External**: Notifications, emails, ads
- **Internal**: Emotions, thoughts, routines
- **Action**: Clear call-to-action buttons

### 2. Motivation
- **Core motivators**: Social acceptance, status, achievement
- **Progress indicators**: Show advancement toward goals
- **Gamification**: Points, badges, leaderboards

## Implementation Tips

### 1. User Research
- **Observe behavior**: Don't just ask opinions
- **A/B testing**: Test psychological principles
- **Analytics**: Measure what users actually do

### 2. Iterative Design
- **Start with psychology**: Understand user needs first
- **Test assumptions**: Validate with real users
- **Measure impact**: Track behavioral changes

### 3. Ethical Considerations
- **Respect user autonomy**: Don't manipulate
- **Transparent practices**: Be honest about techniques
- **User benefit**: Focus on helping users

## Conclusion

Understanding psychology isn't about manipulation—it's about creating products that work with human nature, not against it. The best products feel intuitive because they align with how people naturally think and behave.

Design with empathy, test with rigor, and always put the user first.
    `
  }
]

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter(post => post.tags.includes(tag))
}

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getFeaturedPosts(): Post[] {
  return posts.slice(0, 3)
} 