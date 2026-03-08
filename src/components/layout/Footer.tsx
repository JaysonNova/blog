'use client'

import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:contact@example.com', icon: Mail, label: 'Email' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-md py-xl max-w-container">
        <div className="flex flex-col items-center gap-lg">
          {/* Social Links */}
          <div className="flex items-center gap-md">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
