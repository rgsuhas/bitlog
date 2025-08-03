"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import type { Post } from "@/lib/types";

interface SocialShareProps {
  post: Post;
}

export default function SocialShare({ post }: SocialShareProps) {
  const postUrl = `https://cloudblog.com/blog/${post.slug}`;
  const shareText = `Check out \"${post.title}\" by ${post.author.name}`;

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(postUrl)}`,
      color: "hover:text-blue-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postUrl
      )}`,
      color: "hover:text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        postUrl
      )}`,
      color: "hover:text-blue-700",
    },
    {
      name: "Copy Link",
      icon: LinkIcon,
      url: "#",
      color: "hover:text-green-600",
      onClick: () => {
        navigator.clipboard.writeText(postUrl);
        // TODO: Show toast notification
      },
    },
  ];

  return (
    <div className="flex items-center justify-center space-x-4 rounded-lg border bg-muted/20 p-6">
      <span className="text-sm font-medium text-muted-foreground">
        Share this post:
      </span>
      <div className="flex space-x-2">
        {shareLinks.map((link) => {
          const IconComponent = link.icon;
          return link.onClick ? (
            <Button
              key={link.name}
              variant="ghost"
              size="sm"
              className={cn("h-9 w-9 p-0 transition-colors", link.color)}
              onClick={link.onClick}
            >
              <IconComponent className="h-4 w-4" />
              <span className="sr-only">{link.name}</span>
            </Button>
          ) : (
            <Button
              key={link.name}
              variant="ghost"
              size="sm"
              className={cn("h-9 w-9 p-0 transition-colors", link.color)}
              asChild
            >
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${link.name}`}
              >
                <IconComponent className="h-4 w-4" />
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
