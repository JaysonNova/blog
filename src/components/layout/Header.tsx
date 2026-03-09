'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/articles', label: '文章' },
  { href: '/photography', label: '摄影' },
  { href: '/videos', label: '视频' },
  { href: '/about', label: '关于' },
]

export function Header() {
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'backdrop-blur-md bg-background/80 border-b border-border',
        'transition-transform duration-300',
        hidden && '-translate-y-full'
      )}
    >
      <nav className="container mx-auto px-md py-sm flex items-center justify-between max-w-container">
        <Link
          href="/"
          className="text-xl font-bold text-foreground hover:text-accent transition-colors no-underline"
        >
          Blog
        </Link>

        <div className="hidden md:flex items-center gap-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors relative no-underline',
                'hover:text-foreground',
                pathname === item.href
                  ? 'text-foreground after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          {mounted && <ThemeToggle />}
        </div>

        <div className="flex md:hidden items-center gap-sm">
          {mounted && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="切换菜单"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-md py-md flex flex-col gap-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  'text-lg font-medium transition-colors no-underline',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
