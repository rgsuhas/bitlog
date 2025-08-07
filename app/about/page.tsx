import Link from 'next/link'
import { ArrowLeft, Heart, Code, BookOpen, Users, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're passionate about sharing knowledge and insights from the world of technology and beyond.
        </p>
      </header>

      {/* Content */}
      <div className="space-y-12">
        {/* Mission Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our mission is to create a platform where developers, entrepreneurs, and tech enthusiasts 
            can share their experiences, learn from each other, and stay updated with the latest 
            trends in technology.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe in the power of knowledge sharing and community building. Every article, 
            tutorial, and insight shared here contributes to the growth of our collective understanding 
            of technology and its impact on our world.
          </p>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Passion</h3>
              <p className="text-sm text-muted-foreground">
                We're passionate about technology and its potential to change the world.
              </p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                We embrace new technologies and innovative approaches to problem-solving.
              </p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                We believe in building strong, supportive communities around shared interests.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We're a small team of developers, designers, and content creators who love what we do. 
            Our diverse backgrounds and experiences help us create content that resonates with 
            different audiences and perspectives.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Content Creation</h3>
              <p className="text-sm text-muted-foreground">
                Our writers and contributors are experts in their fields, bringing real-world 
                experience and practical insights to every article.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Technical Excellence</h3>
              <p className="text-sm text-muted-foreground">
                Our technical team ensures that all code examples, tutorials, and technical 
                content are accurate, up-to-date, and well-tested.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center p-8 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions, suggestions, or want to contribute? We'd love to hear from you!
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <a
              href="mailto:rgsuhas6364@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              rgsuhas6364@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  )
} 