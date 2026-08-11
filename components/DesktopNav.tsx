'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, Heart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { href: string; label: string; icon: typeof Home }

const userNavItems: Item[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function DesktopNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  if (isAdmin) return null

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
      {userNavItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}